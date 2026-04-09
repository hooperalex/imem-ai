# Multi-stage build for imem.ai MCP Server with MemPalace
FROM node:22-slim

# Install Python and required tools
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Install MemPalace globally
RUN pip3 install --break-system-packages mempalace

# Create palace directory
RUN mkdir -p /app/palace

# Initialize MemPalace (will create default palace structure)
RUN mempalace init /app/palace || true

# Expose port
EXPOSE 10000

# Set environment variables
ENV NODE_ENV=production
ENV MEMPALACE_PALACE_PATH=/app/palace
ENV PORT=10000

# Start the HTTP bridge
CMD ["npm", "run", "http"]
