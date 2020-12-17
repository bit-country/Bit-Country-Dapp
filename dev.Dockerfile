FROM node:13.12.0-alpine

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
RUN cd /tmp && yarn
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD . /opt/app

CMD ["yarn", "start"]
