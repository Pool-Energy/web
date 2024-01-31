############################
# docker build environment #
############################

FROM node:18.19.0-bookworm AS build

WORKDIR /build

COPY . .

RUN npm run deps && \
    npm run build

############################
# docker final environment #
############################

FROM caddy:2.7.6-alpine

EXPOSE 80

WORKDIR /var/www/poolenergy

COPY --from=build /build/dist/poolenergy .
COPY ./docker/caddy/Caddyfile /etc/Caddyfile.tpl
COPY ./docker/entrypoint.sh /entrypoint.sh

CMD ["/bin/sh", "/entrypoint.sh"]
