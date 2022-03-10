FROM node:14.7.0-alpine as build
WORKDIR /app

ENV BASE_API_URL=gk-api

COPY package.json /app/package.json
RUN npm install
COPY . /app
RUN npm run build
FROM nginx:1.16.0-alpine
RUN mkdir /nginx
RUN rm -v /etc/nginx/nginx.conf
COPY ./nginx/nginx.conf /etc/nginx/
# COPY ./nginx/ssl/private.key /etc/ssl/private.key
# COPY ./nginx/ssl/site.crt /etc/ssl/site.crt
COPY --from=build /app/build /nginx/static
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]