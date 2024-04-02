FROM node:21-alpine
WORKDIR /home/node/app
COPY *.json .
COPY ./src ./src
RUN npm i && npm run build

# Install docker-compose-wait script
ENV WAIT_VERSION=2.12.1
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

CMD npm run prod
