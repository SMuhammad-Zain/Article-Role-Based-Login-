# Article Sharing App Files

---

## 1. src\routes
- Contains the routes to be used with the specific prefixes for api
- Gives each route a specific controller
- *auth.routes* stores the routes for authentication
- *posts.routes* stores the routes for post management

---

## 2. src\controllers
- Contains the *async functions* to add functionality for each route
- API Logic
- Stores the cookies on browser and sends response to frontend
- *auth.controller* stores the logic and working for authentication
- *posts.controller* stores the logic and working for creating, viewing and modifyng post with access controls

---

## 3. src\models
- Contains the schemas for each document of database
- Initializes each database model of clusters according to schema
- Uses *ref* to connect with other collections
- *auth.model* stores the authentication details for both type of users
- *sessions.model* stores the session logs of each user
- *posts.model* stores pst of every writer

---

## 4. src\config
- Connects the database with the server

---

## 5. src\middlewares
- Stores the middleware which checks whether the user is logged in or not
- Add the users' id and role to *req* object
