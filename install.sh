#!/bin/bash
set -e

# install node packages (from package.json, kept in sync automatically)
npm install

# .env from example if missing
if [ ! -f server/.env ]; then
  cp server/.env.example server/.env
  echo "server/.env created from .env.example — edit it before running"
fi

# sequelize config from example if missing
if [ ! -f server/service/database/config/config.json ]; then
  cp server/service/database/config/config.json.exemple server/service/database/config/config.json
  echo "server/service/database/config/config.json created — edit DB credentials"
fi

# ssl certs (idempotent)
mkdir -p ssl
if [ ! -f ssl/key.pem ]; then
  cd ssl
  openssl genrsa -out key.pem 2048
  openssl req -new -key key.pem -out csr.pem -subj "/CN=localhost"
  openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
  cd ..
fi

clear

# run project
npm run server
