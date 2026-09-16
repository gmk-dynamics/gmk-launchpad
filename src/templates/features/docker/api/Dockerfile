FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

ENV DATABASE_URL=postgresql://gmk_user:gmk_password@localhost:5432/gmk_build

RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

RUN npm prune --omit=dev

FROM node:20-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 3000

CMD ["node", "dist/server.js"]