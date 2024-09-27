# Builder image
# =============

FROM node:22.9.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm prune --production

# Production image
# ================

FROM node:22.9.0-alpine

ENV NODE_ENV=production \
    PORT=3000

LABEL org.opencontainers.image.authors="simon.oulevay@heig-vd.ch"

WORKDIR /app

RUN addgroup -S onechatroom && \
    adduser -D -G onechatroom -H -s /usr/bin/nologin -S onechatroom && \
    chown onechatroom:onechatroom /app

USER onechatroom:onechatroom

COPY --chown=onechatroom:onechatroom --from=builder /app /app

CMD ["node", "./bin/www"]

EXPOSE 3000
