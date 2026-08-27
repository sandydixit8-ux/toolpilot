FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    libreoffice-draw \
    fonts-liberation \
    fonts-dejavu-core \
    fonts-freefont-ttf \
    fontconfig \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

ENV HOME=/tmp
ENV DBUS_SESSION_BUS_ADDRESS=/dev/null
ENV USER=root

RUN mkdir -p /tmp/toolpilotpro/jobs \
    && mkdir -p /tmp/.config/libreoffice \
    && chmod -R 777 /tmp/toolpilotpro \
    && chmod -R 777 /tmp/.config \
    && chmod -R 777 /tmp

# Pre-initialize LibreOffice user profile so soffice.bin doesn't need to create files at runtime
RUN HOME=/tmp USER=root DBUS_SESSION_BUS_ADDRESS=/dev/null \
    /usr/bin/soffice --headless --nofirststartwizard --norestore \
    --env:UserInstallation=file:///tmp/.config/libreoffice \
    --convert-to txt --outdir /tmp /dev/null 2>/dev/null; \
    chmod -R 777 /tmp/.config/libreoffice 2>/dev/null; \
    exit 0

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY server.js ./

EXPOSE 3001

CMD ["node", "server.js"]
