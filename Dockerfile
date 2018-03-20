FROM ubuntu:latest
MAINTAINER Jay Chia "jc2375@cornell.edu"

# Base Installations
RUN apt-get update -y
RUN apt-get install -y python-pip python2.7 build-essential libffi-dev
RUN apt-get install -y git

# Install pip
WORKDIR /data
RUN pip install pip --upgrade
RUN pip install git+https://github.com/cuappdev/appdev.py.git --upgrade

# Install requirements using pip
ADD vol/requirements.txt /vol/requirements.txt
WORKDIR /vol
RUN pip install -r requirements.txt

# Set Environment variables
ENV APP_SETTINGS=config.DevelopmentConfig
ENV DATABASE_URL=postgresql://localhost/my_app_db

# Allow for mounting on vol
VOLUME /vol

# Default command to run on startup
ENTRYPOINT ["python"]
CMD ["/vol/app.py"]
