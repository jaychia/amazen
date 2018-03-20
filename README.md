## Build and run containers using the two commands below
docker build -t cs4300:latest . 
docker run -v ~/Desktop/Homework/Senior/CS4300/docker-final/vol:/vol -p 80:5000 -t cs4300

## Use your browser to go to localhost:80
This should redirect your browser to port 5000 of the docker container, which is currently running Flask!

## Make Changes in vol folder
Vol folder is mounted in the docker container - changes here should show up in real time on your browser.
# amazen
