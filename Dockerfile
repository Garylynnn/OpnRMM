# Build stage
FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:22-slim

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/server.ts ./

# Install only production dependencies
RUN npm install --omit=dev

# Install tsx to run the server.ts file directly (Node 22+ supports type stripping, but tsx is safer for complex TS)
RUN npm install -g tsx

EXPOSE 3000

CMD ["tsx", "server.ts"]
