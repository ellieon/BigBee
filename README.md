# Everybody knows.....
It's Big Dick Bee, a Discord bot developed for Node.js with Typescript initially designed for Spotify control of a 
connected user by other members of the Discord.


## Requirements
You will need each of the following installed to be able to set up a development environment for BDB:
- Node.js
- PostgreSQL server

You will also need developer accounts for the following, with an application created on each of the respective services, so you can leverage the OAuth2 tokens:
- Spotify
- Discord

## Environment Variables
The following environment variables must be set and accessible to BDB:
- `BEE_DISCORD_CLIENT_ID` - Your Discord BDB application client ID
- `BEE_DISCORD_CLIENT_SECRET` - Your Discord BDB application client secret
- `BEE_DISCORD_BOT_TOKEN` - The token for the bot you have created in your BDB Discord app that this server will log in with.
- `BEE_SPOTIFY_CLIENT_ID` - Your Spotify BDB application client ID
- `BEE_SPOTIFY_CLIENT_SECRET` - Your Spotify BDB application client secret
- `BEE_URL` - The base URL that the BDB frontend will sit on, this is used to generate callbacks. 
- `BEE_ENV` - `[PROD|DEV]` the current environment for BDB
- `BEE_DEBUG_CHANNEL` - (Defaults to blank) When BEE_ENV is dev, only reacts to this channel, otherwise avoids this channel
- `DATABASE_URL`= The connection string of a PostgreSQL database for this application to use 
    eg: `postgresql://big_dick_bee:big_dick_bee@localhost:5432/big_dick_bee`
- `PORT` - (Defaults to 3000) The port for the frontend application to bind to
     
## Startup
Simply run `npm run start-dev` to run the application under `ts-node`

To run a pre-transpiled version of the server just run `npm run start`

## Database migration
BDB will automatically attempt to perform database migration to do initial setup of the database for application use.
The migration scripts are run automatically as part of the above start up and are located in the `migrations` folder of 
the project directory.
 
Any changes to the database should be performed through new database migration scripts,
 this can easily be done by running the following command in the project directory

`db-migrate create <your script name>`

This will add a new script in the migrations folder,
please see the documentation for db-migrate(https://www.npmjs.com/package/db-migrate)
for how to manipulate the database in these scripts

## Usage
Once the server is up and running, A user can connect their Spotify accounts by visiting `<BASE_URL>/spotify-login`.
This is currently a very rudimentary system that only supports one user for the time being.


## TODO
This bot is in very early stages of development, so the following features are planned:
- Multiple user support by linking Discord and Spotify accounts together
- Scheduling to refresh Spotify tokens before they expire"
- An actual proper frontend
- A bunch of other commands (Who knows yet)
- Regex command matching
- Clean up the code, I wrote this in a massive rush and am not happy with it in the slightest.


