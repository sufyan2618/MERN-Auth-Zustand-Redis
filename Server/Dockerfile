# Stage 1: Dependencies
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock ./
COPY .yarn .yarn
RUN yarn install --immutable

# Stage 2: Runtime
FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=deps /app ./

COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
