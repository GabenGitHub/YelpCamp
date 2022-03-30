FROM node:16-alpine

WORKDIR /app
COPY package.json ./
COPY . ./
RUN npm install --only=production

EXPOSE 4000
CMD [ "node", "app.js" ]