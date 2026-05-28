# Estágio 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia package.json da raiz (um nível acima)
COPY ../package*.json ./

# Instala dependências
RUN npm install --only=production

# Copia todo o código da pasta src
COPY . .

# Estágio 2: Produção
FROM node:18-alpine

WORKDIR /app

# Instala curl
RUN apk add --no-cache curl

# Copia node_modules do builder
COPY --from=builder /app/node_modules ./node_modules

# Copia os arquivos (index.js está na mesma pasta)
COPY --from=builder /app/db.js ./db.js
COPY --from=builder /app/index.js ./
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/middleware ./middleware
COPY --from=builder /app/package*.json ./

# Expõe a porta
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Comando para iniciar (index.js está na raiz do /app)
CMD ["node", "index.js"]
