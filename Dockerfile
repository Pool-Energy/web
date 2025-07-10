############################
# docker build environment #
############################

FROM node:24.4.0-bookworm AS build

WORKDIR /build

COPY . .

RUN npm install --legacy-peer-deps && \
    npm run build

############################
# docker final environment #
############################

FROM caddy:2.10.0-alpine

EXPOSE 8080

WORKDIR /var/www/poolenergy

COPY --from=build /build/dist/poolenergy .
COPY ./docker/caddy/Caddyfile /etc/Caddyfile.tpl
COPY ./docker/entrypoint.sh /entrypoint.sh

CMD ["/bin/sh", "/entrypoint.sh"]
