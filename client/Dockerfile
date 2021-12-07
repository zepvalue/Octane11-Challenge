FROM node:alpine
RUN mkdir /frontend
WORKDIR /frontend
RUN npm install -g gatsby-cli
COPY package.json /frontend/package.json
RUN yarn install && yarn cache clean
COPY . .
CMD ["yarn", "develop", "-H", "0.0.0.0" ]