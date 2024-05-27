const express = require("express");

const app = express();
app.use(express.json()); //permet à Express de lire les corps de requête JSON - on en a besoin  pour les requêtes post !
// express.json est middleware que nous utilisons au tout début de notre code pour nous assurer que toutes nos routes sont capables de lire un corps de requête au format JSON.

const movieControllers = require("./controllers/movieControllers");
const userControllers = require("./controllers/userControllers");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.get("/api/users", userControllers.getUsers);
app.get("/api/users/:id", userControllers.getUserById);
app.post("/api/movies", movieControllers.postMovie);
app.post("/api/users", userControllers.postUser);
app.put("/api/movies/:id", movieControllers.putMovie);
app.put("/api/users/:id", userControllers.putUser);

module.exports = app;
