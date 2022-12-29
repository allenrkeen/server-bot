FROM node:latest

WORKDIR /app

COPY package.json /app
RUN npm install

COPY . .

ENV DISCORD_TOKEN ""
ENV DISCORD_CLIENT_ID ""
ENV DISCORD_GUILD_ID ""

CMD [ "node", "index.js" ]