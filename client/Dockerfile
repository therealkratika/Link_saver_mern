FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src ./src
COPY public ./public
COPY vite.config.js ./
COPY index.html ./

RUN chown -R node:node /app

USER node

EXPOSE 5173

CMD ["npm", "run", "dev"]