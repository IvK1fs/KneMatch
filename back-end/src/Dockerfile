# Estágio 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência (estão na raiz)
COPY package*.json ./

# Instala todas as dependências
RUN npm ci --only=production

# Copia o código fonte (incluindo a pasta src)
COPY . .

# Estágio 2: Produção
FROM node:18-alpine

WORKDIR /app

# Instala curl para health check
RUN apk add --no-cache curl

# Copia node_modules do builder
COPY --from=builder /app/node_modules ./node_modules

# Copia os arquivos necessários (AJUSTADO para incluir a pasta src)
COPY --from=builder /app/src ./src
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/routes ./routes

# Copia package.json e package-lock.json
COPY --from=builder /app/package*.json ./

# Expõe a porta
EXPOSE 3001

# Health check (ajuste o caminho do health check se necessário)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Comando para iniciar a aplicação (apontando para o index.js dentro de src)
CMD ["node", "src/index.js"]