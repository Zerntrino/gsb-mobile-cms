FROM node:16-alpine as builder

WORKDIR /app

COPY . .

RUN npm install --unsafe-perm && npm run build-dev

FROM nginx:alpine

COPY --from=builder /app/dist/* /var/www/html/web/