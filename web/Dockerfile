FROM ubuntu:latest
MAINTAINER Jay Chia "jc2375@cornell.edu"

# Base Installations
RUN apt-get update -y
RUN apt-get install -y python-pip python2.7 build-essential libffi-dev
RUN apt-get install -y git

# Install pip
RUN pip install pip --upgrade
RUN pip install git+https://github.com/cuappdev/appdev.py.git --upgrade

# Install requirements using pip
ADD ./requirements.txt /data/requirements.txt
WORKDIR /data
RUN pip install -r requirements.txt
WORKDIR /vol
