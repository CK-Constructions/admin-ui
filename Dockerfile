# -------- Builder Stage --------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# ARG VITE_RAZORPAY_KEY
# ENV VITE_RAZORPAY_KEY=$VITE_RAZORPAY_KEY

RUN npm run build   # creates /app/dist

# -------- Production Stage --------
FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 8060
CMD ["serve", "-s", "dist", "-l", "8060"]
