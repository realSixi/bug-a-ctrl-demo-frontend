# Common build stage
FROM node:18-alpine as common-build-stage
COPY . ./app

WORKDIR /app

RUN npm ci
RUN npm run build

EXPOSE 3000

CMD [ "npx", "serve", "build"]
