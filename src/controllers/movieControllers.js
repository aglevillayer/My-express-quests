const database = require("../../database");

// Version facile sans beaucoup de paramètres
const getMovies = (req, res) => {
  let sql = "select * from movies";
  const sqlValues = []; // Dans la correction il le définit avec const mais moi j'ai mis let instinctivement

  if (req.query.max_duration != null) {
    sql += " where duration <= ?"; // Attention ici on a dans l'url "max_duration" mais la clef est duration dans notre table de notre BDD
    sqlValues.push(req.query.max_duration);

    if (req.query.color != null) {
      sql += " AND color = ?";
      sqlValues.push(req.query.color); // j'avais de écrit de base sqlValues = [req.query.color]
    }
  } else if (req.query.color != null) {
    sql += " where color = ?";
    sqlValues.push(req.query.color); // j'avais de écrit de base sqlValues = [req.query.color]
  }

  database
    .query(sql, sqlValues)
    .then(([movies]) => {
      res.json(movies); // use res.json instead of console.log
    })
    .catch((err) => {
      console.error(err);
      res.Status(500).send("Error retrieving data from database");
    });
};

/* // Version difficle avec plus de paramètres
const getMovies = (req, res) => {
  const initialSql = "select * from movies";
  const where = [];

  if (req.query.color != null) {
    where.push({
      column: "color",
      value: req.query.color,
      operator: "=",
    });
  }
  if (req.query.max_duration != null) {
    where.push({
      column: "duration",
      value: req.query.max_duration,
      operator: "<=",
    });
  }

  database
    .query(
      where.reduce(
        (sql, { column, operator }, index) => // sql est la valeur initiale OU la dernière valeur retournée par la fonction = permet donc d'implémenter la phrase au fil des requêtes.
          `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`, // phrase de requête sql
        initialSql // la valeur initiale que prendra sql en début d'itération
      ),
      where.map(({ value }) => value) // on récupère la valeur de value stocké dans l'objet qui est dans le tableau where et on la met dans un autre tableau.
    )

    .then(([movies]) => {
      res.json(movies);
    })

    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};
*/

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies where id=?", [id])
    .then(([movies]) => {
      if (movies[0] != null) {
        res.json(movies[0]);
      } else {
        res.sendStatus(404); // Affichera "not found" dans le navigateur
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;
  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?,?,?,?,?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.status(201).send({ id: result.insertId });
      console.log(result.insertId);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
};
