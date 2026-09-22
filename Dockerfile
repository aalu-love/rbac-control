FROM node:20-alpine

WORKDIR /app

# Copy dependency files first
COPY --chown=node:node package*.json ./

# Install production dependencies
RUN npm install

# Copy application source
COPY --chown=node:node . .

# Switch from root to the built-in non-root Node user
USER node

EXPOSE 3000

CMD ["npm", "start"]