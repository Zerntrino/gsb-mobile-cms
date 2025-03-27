FROM node:16-alpine as builder

WORKDIR /app

COPY . .

RUN yarn install --unsafe-perm && yarn build-prod

FROM nginx:1.26.3-alpine3.20

# Install gettext
RUN apk update
RUN apk add --no-cache gettext=0.22.5-r0

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

RUN chown -R nonroot:nonroot /etc/nginx/
RUN chown -R nonroot:nonroot /var/cache/nginx/
RUN chown -R nonroot:nonroot /var/run/

COPY nginx.conf /etc/nginx/nginx.conf.template

COPY --from=builder /app/dist/* /etc/nginx/html

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# EXPOSE 80
EXPOSE 8080

USER nonroot

# test

# Set the entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

