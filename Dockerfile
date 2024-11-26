FROM node:alpine

WORKDIR '/app'

COPY package.json .
RUN npm install

ENV PORT 3000
EXPOSE 3000

COPY . .

CMD npm run dev -- --host 0.0.0.0