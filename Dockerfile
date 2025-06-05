FROM node:20-alpine3.20 AS builder

WORKDIR /app

COPY . .

# ENV
# ARG API_BACKEND=
# ARG OAUTH2_ISSUER=
# ARG OAUTH2_CLIENT_ID=
# ARG OAUTH2_REDIRECT_URI=

ENV API_BACKEND=http://gsb-api.ubakong.com
ENV OAUTH2_ISSUER=https://mfapwldev.gsb.or.th
ENV OAUTH2_CLIENT_ID=0oa1uk5axxcJJh8mB1d8
ENV OAUTH2_REDIRECT_URI=https://gsb-api.ubakong.com/cms/auth/callback

# RUN echo $API_BACKEND
# RUN echo $OAUTH2_ISSUER
# RUN echo $OAUTH2_CLIENT_ID
# RUN echo $OAUTH2_REDIRECT_URI

# Install gettext
RUN apk update
RUN apk add --no-cache gettext=0.22.5-r0

RUN chmod +x docker-entrypoint.sh
RUN ./docker-entrypoint.sh

RUN yarn install --unsafe-perm
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

COPY --from=builder /app/nginx.default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/* /etc/nginx/html
COPY --from=builder /app/.well-known/* /etc/nginx/html/.well-known/


# EXPOSE 80
EXPOSE 8080

USER nonroot

CMD ["nginx", "-g", "daemon off;"]