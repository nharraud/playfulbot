FROM node:17

RUN apt-get update

RUN apt-get --assume-yes install nginx

RUN mkdir playfulbot
WORKDIR /playfulbot
RUN npm update

COPY ./frontend ./frontend

WORKDIR /playfulbot/frontend

RUN npm install --production .

ARG VITE_API_HTTP_URL
ARG VITE_API_WEBSOCKET_URL
ARG VITE_FRONTEND_URL
ENV VITE_API_HTTP_URL=$VITE_API_HTTP_URL
ENV VITE_API_WEBSOCKET_URL=$VITE_API_WEBSOCKET_URL
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL

RUN npm run build
RUN mkdir /var/www/playfulbot
RUN cp -r /playfulbot/frontend/build/. /var/www/playfulbot/html

COPY ./docker/frontend/nginx-config /etc/nginx/sites-enabled/playfulbot

CMD ["nginx", "-g", "daemon off;"]