# Common build stage
FROM node:14.14.0-alpine3.12 as common-build-stage
COPY . ./app

WORKDIR /app

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "npx", "serve", "build"]
