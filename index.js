const express = require('express');
const body_parser = require('body-parser');
const server = express();
const mysql = require('mysql2');
server.use(body_parser.json());
const port = 8090;

// create the connection to database
const connection = mysql.createPool({
    host: 'localhost',
    port: '3306',
    database: 'api',
    user: 'root',
    password: 'hYjx2f',
    namedPlaceholders: true
});

// Return index.html
server.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// ------------------------
// GET all Users
server.get("/users", (req, res) => {
    connection.query(`
    SELECT
        *
    FROM
        users;
    `, (err, rows) => {
        res.json({
            users: rows
        });
    })
});

// GET user by Id
server.get("/users/:id", (req, res) => {
    const userId = req.params.id;

    connection.query(`
    SELECT
        *
    FROM
        users
    WHERE
        id=:userId;
    `, {userId}, (err, rows) => {
        if (rows.length == 0) {
            res.json({
                errors: [
                    "No user found!"
                ]
            });
        } else {
            res.json({
                user: rows[0]
            });
        }
    });
});

// POST
server.post("/users", (req, res) => {
    const user = req.body;

    connection.query(`
    INSERT INTO
        users
        (
            firstName,
            lastName,
            age
        )
    VALUES (
        :firstName,
        :lastName,
        :age
    );
    `, {
        ...user
    }, (err, rows) => {
        res.json(rows);
    });
});

// UPDATE
server.put("/users/:id", (req, res) => {
    const user = req.body;
    const userId = req.params.id;

    connection.query(`
    UPDATE
        users
    SET
        firstName=:firstName,
        lastName=:lastName,
        age=:age
    WHERE
        id= :userId;
    `, {
        ...user,
        userId
    }, (err, rows) => {
        res.json(rows);
    });
});

// DELETE
server.delete("/users/:id", (req, res) => {
    const userId = req.params.id;

    connection.query(`
    DELETE FROM
        users
    WHERE
        id=:userId;
    `, {userId}, (err, result) => {
        res.json({
            success: !!result.affectedRows
        });
    });
});
// ------------------------

server.get("/favico.ico", (req, result) => {
    result.sendStatus(204);
});

// ------------------------
server.listen(port);

console.log("");
console.log("Listening on port " + port);
console.log("Ctrl-c to stop");
console.log("");

// ------------------------