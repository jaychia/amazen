FROM node 

RUN mkdir /runtime 
WORKDIR /runtime 
RUN npm init -y 

ADD . /runtime
RUN npm install --save-dev babel-preset-es2015 browserify gulp gulp-babel gulp-notify gulp-util gulp-watch react react-dom vinyl-buffer vinyl-source-stream babel-preset-react babel-core babel-preset-stage-3 babelify@7.2.0
CMD ./node_modules/.bin/gulp
