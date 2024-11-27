FROM node:alpine

WORKDIR '/app'

COPY package.json .
RUN npm install

ENV PORT 5173
EXPOSE 5173

COPY . .

CMD npm run dev -- --host 0.0.0.0