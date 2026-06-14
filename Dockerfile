FROM node:18-alpine

WORKDIR /app

# Install server dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy server files
COPY server/ ./server/

# Install client dependencies
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm install

# Copy client files
COPY client/src/ ./src/
COPY client/public/ ./public/

# Build client
RUN npm run build

# Back to root
WORKDIR /app

EXPOSE 5000 3000

# Start both server and client
CMD ["npm", "start"]
