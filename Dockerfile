FROM node:14.17.3-alpine3.12 AS builder
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm ci
COPY tsconfig.json /app
COPY src /app/src
RUN npm run build

FROM node:14.17.3-alpine3.12
WORKDIR /app
ENV NODE_ENV=production
COPY package.json /app
COPY package-lock.json /app
RUN npm ci --only=production
COPY --from=builder /app/dist /app/dist
CMD ["npm", "start"]
