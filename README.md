#README
#Getting Started

-fork
-git clone
-npm install(!)

you will have to create a database and refer to it in the DATABASE_URL, you will have to create a .env file and set all those variables in it:

DATABASE_URL
DB_ENV
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
HOST
SECRET
SECRET2
SENDGRID_USERNAME
SENDGRID_PASSWORD

you can start in your terminal localhost with the command - nodemon (it should give you kind of green happy words that mean that everything is good to go. if its and red and angry it means that you forgot to npm intsall..)

Go to the browser and open a tab and type localhost:3000, the site should be up.

#Deploy
- We deployed with Heroku.
- To deploy to heroku- you will have to start heroku on your machine.
-You will have to set the environment variables on the configuration of heroku. you will have to set for heroku the same variables as we did for the .env file.

the command:

heroku config:set [your_variable]=[some_awesome_code]

than you will have to git push heroku master. If it is all green - you have deployed your site.

heroku open to see your deployed site.


-You won't be able to see the admin view if you are not an admin. You will have to go into your database and change your user to an admin.
