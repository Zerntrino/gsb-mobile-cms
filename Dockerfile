FROM node:16-alpine as builder

WORKDIR /app

COPY . .

RUN yarn install --unsafe-perm && yarn build-prod

# FROM nginx:alpine
# EXPOSE 80

# COPY nginx-dev.conf /etc/nginx/conf.d/default.conf

# COPY --from=builder /app/dist/* /etc/nginx/html

FROM nginx:alpine

# Install envsubst to process environment variables
RUN apk add --no-cache gettext

EXPOSE 80

COPY nginx.conf /etc/nginx/nginx.conf.template

COPY --from=builder /app/dist/* /etc/nginx/html

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Set the entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]