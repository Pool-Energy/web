############################
# docker build environment #
############################

FROM node:18.20.4-bookworm AS build

WORKDIR /build

COPY . .

RUN npm install --legacy-peer-deps && \
    npm run build

############################
# docker final environment #
############################

FROM caddy:2.8.4-alpine

# Identify the maintainer of an image
LABEL maintainer="contact@pool.energy"

EXPOSE 80

WORKDIR /var/www/poolenergy

COPY --from=build /build/dist/poolenergy .
COPY ./docker/caddy/Caddyfile /etc/Caddyfile.tpl
COPY ./docker/entrypoint.sh /entrypoint.sh

CMD ["/bin/sh", "/entrypoint.sh"]
