FROM node:17

RUN apt-get update

RUN mkdir playfulbot
WORKDIR /playfulbot
RUN npm update

COPY ./backend ./backend

WORKDIR /playfulbot/backend
RUN npm install --production .


WORKDIR /playfulbot/backend
ENV NODE_ENV=production
CMD sleep 5 && npm run cli db-drop && npm run cli db-create && npm run cli load-demo && npm run cli serve
# CMD echo "foo" && echo "bar"

