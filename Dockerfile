FROM node:18.18.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build  # Ensure this generates the correct build output folder

FROM node:18.8.0-alpine AS deployer

WORKDIR /app

COPY --from=builder /app/.svelte-kit /app/.svelte-kit  # Copy .svelte-kit for SvelteKit server
COPY --from=builder /app/output /app/output  # Ensure this is the correct output folder

COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/tsconfig.json /app/tsconfig.json

RUN npm install --production

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "output/server/index.js"]