FROM node:10-jessie
RUN npm i -g nexe
RUN echo "console.log('test');" > empty.js && nexe empty.js -t linux-x64-10.9.0 -o empty.js.outbin
RUN ./empty.js.outbin
COPY . /app
WORKDIR /app
RUN npm i . -g --unsafe-perm
CMD  nexe -t linux-x64-10.9.0 -i bin.js -o bin/linux