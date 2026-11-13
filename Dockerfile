FROM node:20-alpine AS builder
WORKDIR /app

COPY frontend/package.json .
COPY frontend/package-lock.json .

RUN npm ci


COPY frontend .

RUN npm run build

FROM alpine:3.24

RUN apk update
RUN apk add nginx uv

RUN adduser -D -g 'www' www

WORKDIR /app
COPY backend/pyproject.toml .
COPY backend/uv.lock .
COPY backend/src/app/__init__.py ./src/app/__init__.py
COPY backend/README.md .
COPY backend/.python-version .


RUN uv sync

COPY backend .

RUN uv sync



COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder app/dist/frontend/browser /www
RUN chown -R www:www /www

EXPOSE 80
EXPOSE 443


CMD nginx && uv run uvicorn src.app.main:app --host 0.0.0.0 --port 8000