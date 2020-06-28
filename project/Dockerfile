FROM node:10


COPY nginx/conf.d /etc/nginx/conf.d
CMD ["/bin/sh", "-c", "exec nginx -g 'daemon off;';"]



# Create app directory
WORKDIR /usr/src/app

RUN npm -g install nodemon

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .





EXPOSE 8080

CMD [ "npm", "run", "server" ]
