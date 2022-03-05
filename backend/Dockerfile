FROM node:14-alpine
WORKDIR /app

ENV PORT=5000
ENV INDEXER_BASE_URL=https://api.mainnet.tzkt.io/v1

COPY package.json /app/package.json
RUN npm install --only=prod
COPY . /app
EXPOSE 5000 
USER node
CMD ["node", "src/index.js"]