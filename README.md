# Amazen

## Download Docker and Docker-Compose
Some installations of docker will already include docker-compose!

A brief overview of Docker:
1. Define a Dockerfile for your container. A Dockerfile defines a base image and a series of commands to run on the base image to create your own image. For an example, navigate to ./web/Dockerfile. This Dockerfile pulls the default latest Ubuntu image, then installs python, git, pip etc. Then, it ADDs requirements.txt from the ./web folder to the Docker image that it's building, and inside the build it runs `pip install -r requirements.txt` which globally installs the pip requirements. This concludes the build and we have a 'Docker Image'.
2. To construct an image, you can run `docker build` while you are in the folder with your target image. This constructs an image and stores it somewhere in your computer that you can't see, somewhere like /home/usr/bin/Docker/images. To see what images you currently have in your host machine's docker, run `docker image ls`. Images that have been built before don't need to be rebuilt. If you build a new image that specifies FROM an image that you already have, Docker intelligently builds it based off of the previous image and it should build a lot faster. You should be thinking of images as immutable objects that define an execution environment. For example in this case, our web image has python installed, and other things that we will need including Flask, SQLAlchemy etc. We also define environment variables so that when in python we say os.environ['DB_USER'], we get the correct value that we expect. We no longer need to manually do all of these on our host machine/deployment machine. All we do is git pull the new Dockerfile and rebuild the image, which should incorporate all these changes for us.
3. Now, to actually run a process in the image, we need to start containers. You can think of containers as 'threads' that execute, and the image as the 'virtual environment' that these threads execute on. That is, if your container is running the web image, it will require Flask and the DB_USER environment variable. The web image already has all of these pre-installed and pre-defined, so if you do something like `docker run flask_web_image`, this spins up a new container which will run Flask with no problems, on any host machine. You can already see how this solves the issue of different people having different python versions, python installations, filepaths etc. Everything is 'self-contained' in the image.
4. Eventually we get to the point where we want to have a setup that looks like `server (nginx) -> web application (Flask) -> database (postgresql)`. What we can do is we define images for each, and then define ports on each image to allow the containers to talk to each other. We want to also have a single location where we define and spin up all of these containers, so that we don't have to manually spin them up one by one and set the ports etc. This is why we use docker-compose, and you can see an example of this definition in `docker-compose.yml`.
5. Now, you start realizing that containers come and go, and they don't actually make any changes to data. All they do is run some code and eventually disappear. Since images are immutable definitions of environments, you can't actually 'save' to an image. Any state that your container has after it's finished executing (e.g. saving some files in ~/Documents) disappears after the container dies. To add persistence to data, you define 'volumes'. A volume is a shared data repository between the container and its host. Essentially, it is 'mounting' one of your host's folders to the container *after* it finishes building. For example, you mount ~/Documents/vol-to-mount/ as a volume on your image at path /my-vol. Now, any container that you spin up from that image can access the contents of ~/Documents/vol-to-mount from its /my-vol path. Any changes you make in /my-vol will also be reflected on your host. Essentially, they share the folder!
6. For your databases, you definitely want this 'persistence'. This is so that when a database container dies, all of the sql tables and data inside the sql tables will still stay on your host machine instead of disappearing with the container. Also another advantage to this is you can have multiple database containers operating on the same data folder, and spin up as many containers as required to handle more database requests. Pretty neat!
7. For application deployment, you also want this. Imagine if every time we made a change to our Flask code we needed to rebuild the image. This would really suck. So, we define a volume to mount all of our Flask application code onto our docker image at /vol. This way, whenever we make a change in our host's ./web folder (for example, by changing app.py or by running `git pull`), these changes are detected by the containers running Flask and they automatically refresh their applications to take into account the new changes. Also in this way, we can spin up multiple Flask containers depending on how many requests we're getting, all sharing code from the ./web folder. We're not doing this because this goes into the territory of 'load balancing' which is beyond the scope of our project.


## Before starting, you need the following files
1. .env file, a template has been provided as env_template
2. .db_env file, a template has been provided as .db_env_template

## Run the following command to start all containers
docker-compose up -d

## Visit the website
Go to localhost:80 and you should see your website running!

## Make Changes in web folder
web folder is mounted in the docker container - changes here should show up in real time on your browser!

## Git commit as usual
Changes in ./web are captured in git commits - you can go ahead and commit/push as per normal

## Migrations/db stuff
If you set up your .env and .db_env properly, your app should be able to talk to your db. Whenever you make changes to your model, you need to migrate your database schema. Reminder: database schema migrations are LOCAL, I have gitignored all migration files.
