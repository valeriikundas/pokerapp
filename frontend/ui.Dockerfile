FROM node:lts-alpine
EXPOSE 8080
RUN npm install -g http-server
WORKDIR /frontend
COPY package-lock.json ./
RUN npm install --verbose
COPY . .
CMD ["npm", "run", "serve"]

# CMD [ "http-server", "dist" ]