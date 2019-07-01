# sweater-weather-express

This takes the sweater weather project from the mod3 final and rebuilds it using express

## Initial Setup

- Clone down this repo
- Run `npm install` to install dependencies
- Run `npx sequelize db:create` and `npx sequelize db:migrate` to set up the database
- `npm start` will spin up your local server

## How to Use

This app has the following endpoints:
- POST /api/v1/users - submitting an email, password, and password confirmation in the body will create a user and add it to the DB, and return an api_key to the client
- POST /api/v1/sessions - submitting a valid email and password in the body will find a matching user in the database if one exists and return their api_key to the client
- GET /api/v1/forecast?location=denver,co - submitting a location and valid api_key will find and return a forecast for the location passed in the params
- POST /api/v1/favorites - submitting a valid api_key and location name in the body will find or create a location entry in the database and associate it with the user as a favorite
- GET /api/v1/favorites - submitting a valid api_key will return favorites for a user and a brief current weather summary
- DELETE /api/v1/favorites - submitting a valid api_key and location will remove the association between a user and that locaiton

### Known Issues
Currently there is a 500 error when an invalid email is submitted to POST /sessions
There are also several refactors to make in the code for readability and to DRY up the code

### How to Contribute
Fork this repo then submit a PR with your changes

### Schema Design
DB has 3 tables, Users, Favorites, and UserFavorites.
Users columns - id, email, password(encrypted with bcrypt), api_key, and timestamps
Favorites columns - id, location (contains name of location), timestamps
UserFavorites - id, user_id, favorite_id
