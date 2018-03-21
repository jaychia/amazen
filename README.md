# Amazen

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
