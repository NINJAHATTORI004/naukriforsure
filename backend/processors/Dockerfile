FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9 turbo

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=api

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma

RUN npm install -g pnpm@9 && pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 3001
CMD ["node", "apps/api/dist/main.js"]