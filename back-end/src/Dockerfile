# Estágio 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies)
RUN npm ci

# Copia o código fonte
COPY . .

# Estágio 2: Produção
FROM node:18-alpine

WORKDIR /app

# Instala curl para health check (opcional)
RUN apk add --no-cache curl

# Copia apenas o necessário do estágio de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

# Cria usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Muda para o usuário não-root
USER nodejs

# Expõe a porta
EXPOSE 3001

# Health check para o Railway saber que o app está vivo
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Inicia a aplicação
CMD ["node", "src/index.js"]