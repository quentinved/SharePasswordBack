# pull official base image
FROM node:12-alpine

# set working directory
WORKDIR /app-server

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app-server/node_modules/.bin:$PATH

# install app dependencies
# add app
COPY . ./
# COPY package.json ./
# COPY package-lock.json ./
# RUN npm cache clean --force
RUN yarn install
RUN yarn global add nodemon
# RUN npm install react-scripts@3.4.1 -g --silent

# start app
CMD ["nodemon", "server.js"]