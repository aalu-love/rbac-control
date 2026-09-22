# Authentication & Role-Based Access Control

A production-oriented authentication and RBAC system built with Node.js, Express, MongoDB, Redis, JWT, Zod, and bcryptjs.

Built to demonstrate a clean authorization architecture:

```text
User → Role → Scope → Resource + Actions
```

## Stack

| Layer          | Tech                   | Why                                             |
| -------------- | ---------------------- | ----------------------------------------------- |
| API            | Node.js + Express      | Fast, non-blocking HTTP API                     |
| Database       | MongoDB + Mongoose     | Primary source of truth for users and RBAC data |
| Cache          | Redis                  | Fast permission lookups                         |
| Authentication | JWT                    | Stateless user identity                         |
| Authorization  | Custom RBAC middleware | Resource + action based access control          |
| Validation     | Zod                    | Request schema validation                       |
| Passwords      | bcryptjs               | Secure password hashing                         |

## Architecture Decisions

**1. No separate Permission model** — `src/models/`
The authorization hierarchy is `User → Role → Scope → Resource + Actions`. Scope already represents the permission relationship, so a separate `Permission` collection is unnecessary.

**2. JWT contains identity only** — `src/middleware/authenticate.js`
JWT contains the user ID plus standard `iat` and `exp` claims. Roles, scopes, and permissions are not stored in the token, preventing stale authorization data when RBAC changes.

**3. MongoDB is the source of truth** — `src/models/`
Users, roles, scopes, and resources are stored in MongoDB. Redis is only a disposable permission cache.

**4. Effective permissions are cached per user** — `src/services/permissionService.js`
Resolved permissions are stored in a Redis Set:

```text
rbac:user:<userId>

post:read
post:create
post:update
post:delete
user:read
```

Authorization can then use Redis set membership instead of rebuilding the complete role → scope → resource hierarchy on every request.

**5. Multiple roles use permission union** — `src/services/permissionService.js`
A user can have multiple roles. Permissions from all roles are combined using a JavaScript `Set`, automatically removing duplicates.

**6. Resource + action permission format** — `src/services/permissionService.js`
Permissions use a consistent format:

```text
resource:action
```

Examples:

```text
post:read
post:create
post:update
post:delete
user:read
```

Supported actions:

```text
create
read
update
delete
```

**7. Cache invalidation after RBAC changes** — `src/services/permissionService.js`
When a user's roles change, their Redis permission cache is cleared. When role scopes change, affected users must have their permission caches invalidated.

**8. Redis miss falls back to MongoDB** — `src/services/permissionService.js`
Redis is not authoritative. On a cache miss:

```text
Redis
  ↓
MongoDB
  ↓
User → Roles → Scopes → Resources
  ↓
resolvePermissions()
  ↓
Redis
```

The resolved permissions are cached and returned.

**9. Public registration cannot assign privileged roles** — `src/controllers/auth.controller.js`
Registration creates a normal user with the default role. Privileged role assignment is handled through an authenticated and authorized administrative operation.

**10. Frontend permissions are not security** — `GET /api/auth/me/permissions`
The frontend can use the permission endpoint to control UI elements, but every protected backend endpoint performs its own authorization check.

## Quick Start

```bash
# 1. Clone and enter directory
git clone <repo> && cd rbac-system

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Start MongoDB and Redis

# 5. Seed resources, scopes, roles and users
node src/seed.js

# 6. Start development server
npm run dev
```

Production:

```bash
npm start
```

The API is available at:

```text
http://localhost:5000/api
```

## API Reference

### Auth

```text
POST /api/auth/register          Create account
POST /api/auth/login             Login → returns JWT
GET  /api/auth/me/permissions    Get effective permissions
```

### Roles

```text
POST   /api/roles                Create role
GET    /api/roles                List roles
PATCH  /api/roles/:id            Update role
DELETE /api/roles/:id            Delete role
```

### User Roles

```text
POST   /api/users/:userId/roles  Assign role to user
DELETE /api/users/:userId/roles/:roleId
                                  Remove role from user
```

### Posts

```text
POST   /api/posts                Requires post:create
GET    /api/posts                Requires post:read
PATCH  /api/posts/:id            Requires post:update
DELETE /api/posts/:id            Requires post:delete
```

### Authentication

Protected endpoints require:

```bash
# JWT
curl \
  -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/posts
```

## Permission Flow

```text
Request
  ↓
Authorization: Bearer <JWT>
  ↓
authenticate
  ↓
userId
  ↓
authorize(resource, action)
  ↓
Redis
  ↓
permission exists?
  ├── YES → Controller
  └── NO  → 403 Forbidden
```

On a Redis cache miss:

```text
Redis
  ↓
MongoDB
  ↓
User
  ↓
Roles
  ↓
Scopes
  ↓
Resources
  ↓
resolvePermissions()
  ↓
Redis
  ↓
Controller
```

## Project Structure

```text
rbac-system/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── redis.js           # Redis connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── permission.controller.js
│   │   └── role.controller.js
│   ├── middleware/
│   │   ├── authenticate.js    # JWT verification
│   │   ├── authorize.js       # Permission checks
│   │   └── validate.js        # Zod validation
│   ├── models/
│   │   ├── User.js            # Users + roles
│   │   ├── Role.js            # Roles + scopes
│   │   ├── Scope.js            # Resource + actions
│   │   └── Resource.js         # Protected resources
│   ├── services/
│   │   └── permissionService.js
│   │                            # Resolve/cache/check/invalidate permissions
│   ├── validators/
│   │   └── auth.validator.js   # Auth request schemas
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── role.routes.js
│   │   └── user.routes.js
│   ├── seed.js                 # RBAC seed data
│   └── app.js                  # Express setup
├── .env.example
├── package.json
└── README.md
```

## RBAC Structure

```text
User
 │
 ├── Role
 │    ├── Scope
 │    │    └── Resource + Actions
 │    │
 │    └── Scope
 │         └── Resource + Actions
 │
 └── Role
      └── Scope
           └── Resource + Actions
```

Example:

```text
admin
├── post_read
│   └── post:read
│
├── post_write
│   ├── post:create
│   ├── post:update
│   └── post:delete
│
└── user_read
    └── user:read
```

## Scaling Path

The current architecture keeps the authorization model simple while leaving room to scale:

```text
Today:
MongoDB → permission resolver → Redis

Next:
Redis Set → O(1) permission membership checks

After that:
Redis Cluster → distributed permission cache

Later:
RBAC change events → invalidate affected user caches

Last resort:
Dedicated authorization service → shared RBAC across multiple APIs
```

The core model remains unchanged:

```text
User
 ↓
Role
 ↓
Scope
 ↓
Resource + Actions
```
