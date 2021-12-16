FROM node:14

COPY dist /data/dist
COPY package.json /data
COPY package-lock.json /data
COPY node_modules /data/node_modules

WORKDIR /data

CMD [ "npm", "start" ]