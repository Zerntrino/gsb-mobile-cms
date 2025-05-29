FROM node:20-alpine3.20 AS builder

WORKDIR /app

COPY . .

RUN yarn install --unsafe-perm

# Install gettext
RUN apk update
RUN apk add --no-cache gettext=0.22.5-r0

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

RUN apk add --no-cache nginx

RUN chown -R nonroot:nonroot /etc/nginx/
RUN mkdir -p /var/cache/nginx/ && chown -R nonroot:nonroot /var/cache/nginx/
RUN chown -R nonroot:nonroot /var/run/
RUN mkdir -p /var/lib/nginx/logs && chown -R nonroot:nonroot /var/lib/nginx/

COPY nginx.conf /etc/nginx/nginx.conf.template
COPY .well-known/* /etc/nginx/html/.well-known/

RUN chmod +x docker-entrypoint.sh
RUN chmod +x tools/env-to-ts.ts

# EXPOSE 80
# EXPOSE 80
EXPOSE 8080

USER nonroot

CMD ["/app/start.sh"]

