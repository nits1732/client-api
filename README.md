# CRM TICKET SYSTEM API

This api is a part of create CRM Ticket System with Mern stack from scrach

# How to use 
- `run 'git clone ...`
- `run npm start`

Note: Make sure you have nodemon in your system otherwise you can install as a dev dependencies in the project 

# Api Resources 

### User Api Resources 

All the User API router Follows `/v1/user`

| #  | Routers            |Verbs   | Progress | Is Private | Description             |
......................................................................................
Description
|1   |`/v1/user/login`                  |POST    | TODO   |NO     |verify user authentication and return JWT
|2   |`/v1/user/request-reset-password` |POST    | Done   |No     |Verify Email and Email pin to reset the password
|3   |`/v1/user/reset-password`         |PUT     | Done   |No     |Replace with new Password
|4   |`/v1/user/{id}`                   |GET     | TODO   |YES    |Get user info
|5   |`/v1/users/logout/:token`         |DELETE  | Done   |Yes    |Logout

### Ticket Api Resources 
| #  | Routers            |Verbs   | Progress | Is Private | Description             |
......................................................................................
|1   |`/v1/ticket`                  |GET     |TODO     |YES          |Get all ticket for the logged in user
|2   |`/v1/ticket/{id}`             |GET     |TODO     |Yes          |Get all ticket details
|3   |`/v1/ticket/`                 |POST    |DONE     |YES          |Create New Ticket
|4   |`/v1/ticket/{id}`             |PUT     |TODO     |YES          |Update ticket detail i.e reply message
|5   |`/v1/ticket/close-ticket/{id}`|PUT     |TODO     |YES          |Update ticket detail i.e reply message
|6   |`/v1/ticket/delete/{id}`      |Delete  |TODO     |YES          |Delete a ticket



