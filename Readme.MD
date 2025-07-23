# Authentication and Role-Based Access Control System

This project is a Role-Based Access Control (RBAC) system built with Node.js, Express, and MongoDB. It implements a comprehensive authentication and authorization mechanism using JWT tokens and a hierarchical permission structure.

## Project Structure

### Core Components

1. **Models**:

    - **User**: Stores user credentials and associated roles
    - **Role**: Defines roles like superuser, admin, editor, and viewer
    - **Scope**: Defines permissions for specific resources and actions
    - **Resource**: Represents entities like users, posts, and comments
    - **Permission**: Links resources with allowed actions

2. **Authentication & Authorization**:

    - JWT-based authentication system
    - Middleware for verifying user identity and permissions
    - Granular access control based on roles and scopes

3. **API Routes**:
    - Auth routes for user registration and login
    - Protected resource routes for posts, users, and comments
    - Each endpoint requires specific permissions

### Permission Structure

The system uses a hierarchical permission model:

-   **Resources**: The entities in the system (user, post, comment)
-   **Actions**: Operations that can be performed (read, write, delete)
-   **Scopes**: Combinations of resources and actions (e.g., r_post, rw_user, rwx_comment)
-   **Roles**: Collections of scopes assigned to users

Scope naming follows a pattern:

-   `r_` prefix: Read-only access
-   `rw_` prefix: Read and write access
-   `rwx_` prefix: Full access (read, write, delete)

### User Roles

1. **Superuser**: Has full access to all resources
2. **Admin**: Has full access to posts and comments
3. **Editor**: Has read/write access to posts and read-only access to comments
4. **Viewer**: Has read-only access to posts

## Database Configuration

The application connects to a MongoDB instance running in a Docker container with the following configuration:

-   Host: localhost:27017
-   Authentication: Username/password (admin/secret)
-   Database: rbac_jwt

## Running the Application

The application can be started with:

-   `npm start` for production
-   `npm run dev` for development with nodemon

A seeder endpoint is available at `/seeder` to initialize the database with resources, scopes, roles, and users.

The server runs on port 5000 by default and exposes API endpoints under the `/api` prefix.
