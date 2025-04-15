# Stage 1: Building the code
FROM node:18-alpine AS builder
 
WORKDIR /usr/src/app
 
# Install dependencies
COPY package*.json ./
RUN npm ci
 
# Bundle app source
COPY . .
 
# Build the app
RUN npm run build
 
# Stage 2: Running the application
FROM node:18-alpine
 
WORKDIR /usr/src/app
 
# Set environment variables
ENV BROKER_IP=broker
ENV BROKER_USR=device
ENV BROKER_PASS=device
ENV BROKER_PORT=1883
ENV DB_PORT=3306
ENV DB_NAME=wiot_db
ENV DB_NAME=wiot_db
ENV DB_USERNAME=root
ENV DB_PASSWORD=Fivecomm
ENV DB_HOST=database
ENV TIMEZONE=Europe/Madrid
ENV BACKUP_LIMIT=5
ENV READ_SEND_PERIODS_ENABLED=0
 
# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production
 
# Copy built code from builder stage
COPY --from=builder /usr/src/app/dist ./dist
 
# Expose the listening port
EXPOSE 3000
 
# Run the app
CMD ["node", "dist/server.js"]