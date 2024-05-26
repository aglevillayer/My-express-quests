const database = require("../../database");
const getUsers = (req, res) => {
  /* let initialSql = "select * from users";
  const value = [];

  if (req.query.language != null) {
    initialSql += " where language = ?";
    value.push(req.query.language);
    if (req.query.city != null) {
      initialSql += " AND city = ?";
      value.push(req.query.city);
    }
  } else if (req.query.city != null) {
    initialSql += " where city = ?";
    value.push(req.query.city);
  }

  database
    .query(initialSql, value) */

  const initialSql = "select * from users";
  const where = [];

  if (req.query.language != null) {
    where.push({
      column: "language",
      value: req.query.language,
      operator: "=",
    });
  }
  if (req.query.city != null) {
    where.push({
      column: "city",
      value: req.query.city,
      operator: "=",
    });
  }
  database
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql} ${index === 0 ? "where" : "AND"} ${column}${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("select * from users where id=?", [id])
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?,?,?,?,?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.status(201).send({ id: result.insertId });
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  postUser,
};
