FROM node:15

RUN apt-get update

RUN apt-get --assume-yes install nginx

RUN mkdir playfulbot
WORKDIR /playfulbot
RUN npm update

COPY ./frontend ./frontend

WORKDIR /playfulbot/frontend

RUN npm install --production .

ARG REACT_APP_API_HTTP_URL
ARG REACT_APP_API_WEBSOCKET_URL
ENV REACT_APP_API_HTTP_URL=$REACT_APP_API_HTTP_URL
ENV REACT_APP_API_WEBSOCKET_URL=$REACT_APP_API_WEBSOCKET_URL

RUN npm run build
RUN mkdir /var/www/playfulbot
RUN cp -r /playfulbot/frontend/build/. /var/www/playfulbot/html

COPY ./docker/frontend/nginx-config /etc/nginx/sites-enabled/playfulbot

CMD ["nginx", "-g", "daemon off;"]