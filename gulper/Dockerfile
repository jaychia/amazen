FROM node 

RUN mkdir /runtime 
WORKDIR /runtime 
RUN npm init -y 

ADD . /runtime
RUN npm install
CMD ./node_modules/.bin/gulp
