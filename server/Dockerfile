FROM --platform=linux/amd64 node:18.20.3-alpine3.19

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "prod"]