# Frontend Dockerfile - React
FROM node:18-alpine

WORKDIR /app

# Kopiraj package.json i instaliraj dependencies
COPY package*.json ./
RUN npm install

# Kopiraj ceo frontend kod
COPY . .

# Expose port 3000
EXPOSE 3000

# Startuj React dev server
CMD ["npm", "start"]
