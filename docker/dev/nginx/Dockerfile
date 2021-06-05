FROM node:15

RUN apt-get update

RUN apt-get --assume-yes install nginx

COPY ./nginx-config /etc/nginx/sites-enabled/playfulbot

CMD ["nginx", "-g", "daemon off;"]