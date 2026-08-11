FROM node:20-slim

# Install OpenSSL required by Prisma 7 client engine
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency files first to leverage Docker layer caching
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Copy application source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]