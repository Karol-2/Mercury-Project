FROM node:18-alpine as base
WORKDIR /home/node/app
COPY *.html *.js *.ts *.json .
COPY ./src ./src
COPY ./public ./public
RUN npm i && npm run build

FROM nginx:1.25.3-alpine
COPY --from=base /home/node/app/dist /usr/share/nginx/html
EXPOSE 80
