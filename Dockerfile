FROM node:20.20.2-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN apk add --no-cache openssl

RUN mkdir -p ssl && \
    [ -f ssl/key.pem ] || ( \
      openssl genrsa -out ssl/key.pem 2048 && \
      openssl req -new -key ssl/key.pem -out ssl/csr.pem -subj "/CN=localhost" && \
      openssl x509 -req -days 9999 -in ssl/csr.pem -signkey ssl/key.pem -out ssl/cert.pem \
    )

EXPOSE 5173

CMD ["npm", "run", "server"]
