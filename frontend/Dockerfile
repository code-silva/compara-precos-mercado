FROM node:20-alpine
WORKDIR /app

# Instalação das dependências do react
COPY package.json package-lock.json* ./
RUN npm install

# Copiando o resto do projeto
COPY . .

# Expondo a porta para comunicação entre os containêres
EXPOSE 8081

CMD ["npx", "expo", "start", "--host", "lan"]