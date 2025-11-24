##############################################
# Base
##############################################
FROM node:20-alpine AS base
RUN npm install -g pm2
WORKDIR /app
COPY package*.json ./

##############################################
# Dev build
##############################################
FROM base AS dev
RUN npm install
CMD ["npm", "run", "dev"]

##############################################
# Production build
##############################################
FROM base AS prod
RUN npm ci --omit=dev
COPY . .
CMD ["npm", "run", "start"]