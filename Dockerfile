FROM node:12
COPY package*.json ./
RUN npm install
RUN npm install --global pm2
COPY . ./
EXPOSE 27017 27017
EXPOSE 8000 8000
CMD [ "node","server"]
# CMD [ "pm2-runtime","server.js"]