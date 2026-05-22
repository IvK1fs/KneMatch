# Estágio 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência

COPY package*.json ./

# Instala todas as dependências
RUN npm ci-only=production

# Copia o código fonte (agora tudo está no /app)
COPY . .

# Estágio 2: Produção
FROM node:18-alpine

WORKDIR /app

# Instala curl para health check
RUN apk add --no-cache curl

# Copia node_modules do builder
COPY --from=builder /app/node_modules ./node_modules

# Copia os arquivos necessários (corrigido!)
COPY --from=builder /app/index.js ./
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/routes ./routes

# Copia package.json (opcional)
COPY --from=builder /app/package*.json ./

# Expõe a porta  


EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Comando corrigido
CMD ["npm", "start"]
