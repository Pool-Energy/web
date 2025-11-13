############################
# docker build environment #
############################

FROM node:25.2.0-bookworm AS build

WORKDIR /build

COPY . .

RUN npm install --legacy-peer-deps && \
    npm run build

############################
# docker final environment #
############################

FROM caddy:2.10.2-alpine

EXPOSE 8080

WORKDIR /var/www/poolenergy

COPY --from=build /build/dist/poolenergy/browser .
COPY ./docker/caddy/Caddyfile /etc/Caddyfile.tpl
COPY ./docker/entrypoint.sh /entrypoint.sh

CMD ["/bin/sh", "/entrypoint.sh"]
