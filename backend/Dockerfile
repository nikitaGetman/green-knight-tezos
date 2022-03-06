FROM node:14-alpine
WORKDIR /app

ENV PORT=5000
ENV INDEXER_BASE_URL=https://api.mainnet.tzkt.io/v1
# localhost:5432
ENV DB_HOST=postgres_container 
ENV DB_USER=admin
ENV DB_PASSWORD=admin
ENV DB_NAME=app_db

COPY package.json /app/package.json
RUN npm install --only=prod
COPY . /app
EXPOSE 5000 
USER node
CMD ["node", "src/index.js"]