# syntax=docker/dockerfile:1

# ---- build ---------------------------------------------------------------
FROM node:24-alpine AS build
WORKDIR /app

RUN npm install -g pnpm

# Camada de dependências isolada: só invalida o cache se o lockfile mudar.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# VITE_API_URL é embutida no bundle em build time (Vite não lê env em
# runtime), então precisa ser um build arg, não só uma env var do container.
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm run build

# ---- runtime ---------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1
