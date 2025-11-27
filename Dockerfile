FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build   # creates /app/build (Next.js static export)

# Final stage - just serve the static build
FROM node:20-alpine
WORKDIR /app

# Install only 'serve' globally (very small)
RUN npm install -g serve

# Copy the built files from the previous stage
COPY --from=builder /app/build ./build

# serve automatically rewrites all routes to index.html for SPAs
CMD ["serve", "-s", "build", "-l", "8000"]

EXPOSE 8000