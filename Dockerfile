FROM node:16-alpine as builder

WORKDIR /app

COPY . .

RUN yarn install --unsafe-perm && yarn build-prod

FROM nginx:alpine
EXPOSE 80

COPY nginx-dev.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/* /etc/nginx/html