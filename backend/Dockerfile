# Backend Dockerfile - Node.js + Express
FROM node:18-alpine

WORKDIR /app

# Kopiraj package.json i instaliraj dependencies
COPY package*.json ./
RUN npm install

# Kopiraj ceo backend kod
COPY . .

# Expose port 3001
EXPOSE 3001

# Startuj server
CMD ["node", "main.js"]
