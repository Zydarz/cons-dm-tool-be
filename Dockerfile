FROM node:lts as build
RUN mkdir -p /usr/build
WORKDIR /usr/build
COPY . .
RUN npm install
RUN npm run build:prod
# RUN rm -rf /usr/build/node_modules
# RUN yarn install --production=true
 
FROM keymetrics/pm2:12-alpine
ARG PORT=3000
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY --from=build /usr/build /usr/src/app
EXPOSE $PORT
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
