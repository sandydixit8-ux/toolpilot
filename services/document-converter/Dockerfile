FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice \
    fonts-liberation \
    fonts-dejavu-core \
    fonts-freefont-ttf \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

ENV HOME=/tmp
ENV DBUS_SESSION_BUS_ADDRESS=/dev/null

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY server.js ./

RUN mkdir -p /tmp/toolpilotpro/jobs && chmod -R 777 /tmp/toolpilotpro

EXPOSE 3001

CMD ["node", "server.js"]
