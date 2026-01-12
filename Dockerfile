# -------- Builder Stage --------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build   # creates /app/build

# -------- Production Stage --------
FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 8060
CMD ["serve", "-s", "build", "-l", "8060"]
