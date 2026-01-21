# Assignment 3 Report — Blogs CRUD 
## Nogaibay Symbat SE-2402

## Overview
I built a full CRUD web application for blog posts.  
The backend is implemented with **Node.js + Express** and uses **MongoDB Atlas** as a cloud database through **Mongoose**.  
A simple frontend (served from `public/`) allows creating, viewing, editing, and deleting blogs.

---

## Data Model
Collection: `blogs`

Fields:
- `title` (String, required)
- `body` (String, required)
- `author` (String, required)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

A blog document example:
```json
{
  "_id": "6970615cabb92de9b21d7b51",
  "title": "My first blog",
  "body": "Hello from Atlas!",
  "author": "sima",
  "createdAt": "2026-01-21T05:17:16.915Z",
  "updatedAt": "2026-01-21T05:17:16.915Z",
  "__v": 0
}
```

## Backend Architecture

The backend follows a clean separation of responsibilities:

- `server.js`  
  Starts the server on the configured port.

- `src/app.js`  
  Creates the Express app, registers middleware, routes, and error handler.

- `src/config/db.js`  
  Connects to MongoDB using Mongoose.

- `src/models/Blog.js`  
  Defines the blog schema and model (including timestamps).

- `src/controllers/blogController.js`  
  Contains business logic for CRUD operations.

- `src/routes/blogRoutes.js`  
  Maps endpoints to controller functions.

- `src/middleware/errorHandler.js`  
  Centralized error handling middleware.


## REST API Specification

### Base URL
```text
http://localhost:3000
```
###1) Get all blogs
```text
GET /blogs
```
Response

200 OK

JSON array of blog documents

###2) Get blog by id
```text
GET /blogs/:id
```
Response

200 OK with one blog JSON

404 Not Found if id does not exist

###3) Create blog
```text
POST /blogs
```
Request body (JSON)

```json
{
  "title": "My first blog",
  "body": "Hello from Atlas!",
  "author": "sima"
}
```
Validation

returns 400 Bad Request if required fields are missing (depends on your controller rules)

Response

201 Created + created blog JSON (includes _id, createdAt, updatedAt)

###4) Update blog by id
```text
PUT /blogs/:id
```
Request body (JSON)

```json
{
  "title": "Updated title",
  "body": "Updated body",
  "author": "sima"
}
```
Response

200 OK with updated blog JSON

404 Not Found if id does not exist

###5) Delete blog by id
```text
DELETE /blogs/:id
```
Response

200 OK with confirmation JSON (or deleted blog)

404 Not Found if id does not exist

## Frontend Functionality

The UI (from `public/`) provides:

- Display a list of all blogs
- Create a new blog using a form
- Edit a blog (updates title/body/author)
- Delete a blog (with a confirmation modal)

Frontend communicates with the backend using `fetch()` requests to:

```text
GET     /blogs
POST    /blogs
PUT     /blogs/:id
DELETE  /blogs/:id
```
## Testing

All endpoints were tested using Thunder Client:

- `POST /blogs` returns `201 Created` and a new `_id`
- `GET /blogs` returns `200 OK` with an array including created blogs
- `PUT /blogs/:id` updates the document and returns `200 OK`
- `DELETE /blogs/:id` removes the document and returns `200 OK`

## Result

The application successfully performs full CRUD operations:

- Data is stored persistently in MongoDB Atlas
- API works through Express routes/controllers
- UI correctly displays and updates data from the API

