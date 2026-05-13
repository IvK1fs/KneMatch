# Estágio 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./
RUN npm ci

# Copia o código e faz o build
COPY . .
RUN npm run build

# Estágio 2: Servir com Nginx
FROM nginx:alpine

# Copia os arquivos buildados para o Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Nginx já vai servir os arquivos
CMD ["nginx", "-g", "daemon off;"]