# Everybody knows.....
It's Big Dick Bee, a Discord bot developed for Node.js with Typescript initially designed for Spotify control of a 
connected user by other members of the Discord.


## Requirements
You will need each of the following installed to be able to set up a development environment for BDB:
- Node.js - `12.0.10` or greater
- A PostgreSQL database  - `9.5` you will need to provide a valid connection string with a database and user with permissions for this application to manipulate

You will also need developer accounts for the following, with an application created on each of the respective services, you will need a client id and client secret for each of these:
- Spotify - https://developer.spotify.com
- Discord - https://discord.com/developers

## Environment Variables
The following environment variables must be set and accessible to BDB:
- `BEE_DISCORD_CLIENT_ID` - Your Discord BDB application client ID
- `BEE_DISCORD_CLIENT_SECRET` - Your Discord BDB application client secret
- `BEE_DISCORD_BOT_TOKEN` - The token for the bot you have created in your BDB Discord app that this server will log in with.
- `BEE_SPOTIFY_CLIENT_ID` - Your Spotify BDB application client ID
- `BEE_SPOTIFY_CLIENT_SECRET` - Your Spotify BDB application client secret
- `BEE_URL` - The base URL that the BDB frontend will sit on, this is used to generate callbacks
- `BEE_ENV` - `[PROD|DEV]` the current environment for BDB
- `BEE_LOGGING_LEVEL` - `[info|debug]` the output level for logging, info being the core, debug being more verbose
- `DATABASE_URL`= The connection string of a PostgreSQL database for this application to use 
    eg: `postgresql://big_dick_bee:big_dick_bee@localhost:5432/big_dick_bee`
- `PORT` - (Defaults to 3000) The port for the frontend application to bind to
- `BEE_JWT_SECRET` - The secret to use for signing JWT tokens
- `BEE_GREETER_CHANNEL` - The discord channel to fallback the greeter extension to when it can't DM a user
     
## Startup
Make sure all of the above environment variables are set

Run `npm install` followed by `npm run start-dev` to run the application under `ts-node`

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
Once the server is up and running, A user can connect their Spotify accounts by visiting `<BASE_URL>`.
A list of commands can be obtained by messaging `bee!help` to the bot user.

## Project Structure of src
- `src` - Root of all source code
    - `main` - Code to run on production lives here
        - `bot` - Discord bot lives here
            - `commands` - Classes for message response commands live here
            - `extensions` - Classes for bot behaviour extensions live here
        - `common` - Common code between the bot and web server lives here
        - `web` - Express based web server and routes live here
            - `routes` - REST routes live here
            - `views` - Nunjucks based HTML pages live here
    - `test` - Unit tests live here
- `server.ts` - Application entry point 
- `package.json` - Node configuration for the project
- `tsconfig.json` - Typescript options for the project
- `.travis.yml` - CI configuration

## Adding a command
- Add a new typescript class under 'main/bot/commands', this class must extend `BaseCommand` and implement it's abstract functionality
- Add the decorator `@Command.register` to the class
- The command will match based on what regular expression you pass through to the constructor of `BaseCommand`, when a message matches your regex, `execute` on your class will be called 


