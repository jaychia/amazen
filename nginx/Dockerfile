FROM nginx:latest
RUN rm /etc/nginx/conf.d/default.conf
ADD sites-enabled/flask_project /etc/nginx/conf.d/flask_project.conf
