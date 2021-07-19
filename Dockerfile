FROM node:14.17.3-alpine3.12

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm ci

COPY tsconfig.json /app
COPY src /app/src
RUN npm run build

CMD ["npm", "start"]
