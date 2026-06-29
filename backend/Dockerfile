FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copiamos todo el codigo al contenedor
COPY . .

# Arrancar la app
RUN npm run build

# Exponer puerto 3000 (Default de Nestjs)
EXPOSE 3000

# Comando para iniciar en producción
CMD ["npm", "run", "start:prod"]