FROM node:20-alpine3.20 AS builder

WORKDIR /app

COPY . .

RUN yarn install --unsafe-perm
RUN yarn prebuild
RUN yarn build-prod

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
COPY --from=builder /app/.well-known/* /etc/nginx/html/.well-known/

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# ENV
ARG API_BACKEND=a
ARG OAUTH2_ISSUER=b
ARG OAUTH2_CLIENT_ID=c
ARG OAUTH2_REDIRECT_URI=d

RUN echo $API_BACKEND
RUN echo $OAUTH2_ISSUER
RUN echo $OAUTH2_CLIENT_ID
RUN echo $OAUTH2_REDIRECT_URI

# EXPOSE 80
EXPOSE 8080

USER nonroot

# Set the entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

