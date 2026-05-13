FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY controllers ./controllers
COPY models ./models
COPY routes ./routes
COPY middleware ./authMiddleware
COPY config ./config
COPY index.js ./

RUN chown -R node:node /app

USER node

EXPOSE 5000

CMD ["node", "index.js"]