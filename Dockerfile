# FROM node:24.11.1-alpine3.22 AS builder
FROM node:18 as build

WORKDIR /app

# RUN addgroup -S nonroot \
#     && adduser -S nonroot -G nonroot
RUN groupadd -r nonroot && useradd -r -g nonroot nonroot

COPY . .

RUN chown -R nonroot:nonroot /app

# ENV
# ARG API_BACKEND=
# ARG OAUTH2_ISSUER=
# ARG OAUTH2_CLIENT_ID=
# ARG OAUTH2_REDIRECT_URI=
# ARG XAPPID=
# ARG APPLE_APP_ID=

# PROD
ENV API_BACKEND=http://gsbmycard.gsb.or.th
ENV OAUTH2_ISSUER=https://mfapwl.gsb.or.th
ENV OAUTH2_CLIENT_ID=0oa1xqec2w7jyv8pa1d8
ENV OAUTH2_REDIRECT_URI=https://gsbmycard.gsb.or.th/cms/auth/callback
ENV XAPPID=93b81b99
ENV APPLE_APP_ID=J88QXZ7C6C.com.gsb.mycard.delta

# UAT
# ENV API_BACKEND=http://gsbmycarduat.gsb.or.th
# ENV OAUTH2_ISSUER=https://mfapwldev.gsb.or.th
# ENV OAUTH2_CLIENT_ID=0oa1uk5axxcJJh8mB1d8
# ENV OAUTH2_REDIRECT_URI=https://gsbmycarduat.gsb.or.th/cms/auth/callback
# ENV XAPPID=9df6dceb
# ENV APPLE_APP_ID=L679254MM2.com.ubakong.gsb.gsbmcc-uat

# SIT
# ENV API_BACKEND=http://gsbmycardsit.gsb.or.th
# ENV OAUTH2_ISSUER=https://mfapwldev.gsb.or.th
# ENV OAUTH2_CLIENT_ID=0oa1uk5axxcJJh8mB1d8
# ENV OAUTH2_REDIRECT_URI=https://gsbmycardsit.gsb.or.th/cms/auth/callback
# ENV XAPPID=9df6dceb
# ENV APPLE_APP_ID=L679254MM2.com.ubakong.gsb.gsbmcc-uat

# DEV
# ENV API_BACKEND=http://gsb-api.ubakong.com
# ENV OAUTH2_ISSUER=https://mfapwldev.gsb.or.th
# ENV OAUTH2_CLIENT_ID=0oa1uk5axxcJJh8mB1d8
# ENV OAUTH2_REDIRECT_URI=https://gsbmycardsit.gsb.or.th/cms/auth/callback
# ENV XAPPID=9df6dceb
# ENV APPLE_APP_ID=L679254MM2.com.ubakong.gsb.gsbmcc-uat

# RUN echo $API_BACKEND
# RUN echo $OAUTH2_ISSUER
# RUN echo $OAUTH2_CLIENT_ID
# RUN echo $OAUTH2_REDIRECT_URI
# RUN echo $XAPPID
# RUN echo $APPLE_APP_ID

# Install gettext
# RUN apk update
# RUN apk add --no-cache gettext=0.24.1-r0
RUN apt-get update && apt-get install -y gettext

RUN chmod +x docker-entrypoint.sh

# RUN yarn install --unsafe-perm

# RUN yarn build-prod

EXPOSE 8080

USER nonroot

CMD [ "./docker-entrypoint.sh" ]


# # FROM nginx:1.26.3-alpine3.20
# FROM nginx:1.29.3-alpine3.22-slim

# # Install gettext
# RUN apk update
# RUN apk add --no-cache gettext=0.22.5-r0

# RUN addgroup -S nonroot \
#     && adduser -S nonroot -G nonroot

# COPY --from=builder /app/nginx.default.conf /etc/nginx/conf.d/default.conf

# COPY --from=builder /app/dist/* /etc/nginx/html
# COPY --from=builder /app/.well-known/* /etc/nginx/html/.well-known/

# COPY --from=builder /app/other/* /etc/nginx/html/other/

# RUN chown -R nonroot:nonroot /etc/nginx/
# RUN chown -R nonroot:nonroot /var/cache/nginx/
# RUN chown -R nonroot:nonroot /var/run/

# # EXPOSE 80
# EXPOSE 8080

# USER nonroot

# CMD ["nginx", "-g", "daemon off;"]