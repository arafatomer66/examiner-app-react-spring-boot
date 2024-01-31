FROM node:18-alpine as builder

WORKDIR /app

COPY ./package.json ./package.json

RUN npm install

COPY . .

ARG REACT_APP_NAME

ENV REACT_APP_NAME=${REACT_APP_NAME}

RUN npm run build

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html

