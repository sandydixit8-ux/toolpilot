FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice-writer \
    libreoffice-core \
    fonts-liberation \
    fonts-dejavu-core \
    fonts-freefont-ttf \
    && rm -rf /var/lib/apt/lists/*

ENV HOME=/tmp
ENV DBUS_SESSION_BUS_ADDRESS=/dev/null

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY server.js ./

RUN mkdir -p /tmp/toolpilotpro/jobs

EXPOSE 3001

CMD ["node", "server.js"]
