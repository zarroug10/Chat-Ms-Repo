# Stage 1: Build Node.js app
FROM node:latest as node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Optionally, if your microservice requires any build step, perform it here
# Example: RUN npm run build

# Rebuild bcrypt module
RUN npm rebuild bcrypt --build-from-source

# Stage 2: Final image with only Node.js runtime
FROM node:latest as final

WORKDIR /usr/src/app

COPY --from=node /usr/src/app .

# Expose port 3000 for Node.js application
EXPOSE 3000

# Set environment variables for MySQL connection
ENV MYSQL_HOST=localhost
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=
ENV MYSQL_DATABASE=water_company

# Start the Node.js application
CMD ["node", "app.js"]
