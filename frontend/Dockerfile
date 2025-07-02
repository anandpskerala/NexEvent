# Base build stage
FROM node:22-alpine AS build
WORKDIR /app

RUN npm install -g pnpm


COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install

COPY . .
ARG VITE_BACKEND_URL
ARG VITE_SOCKET_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
