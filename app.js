const express = require("express");
const mysql = require('mysql');
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res) => {
    res.json({
        mensaje: "Nodejs and JWT"
    });
});

const connection = mysql.createConnection({
    host: 'db4free.net',
    user: 'nancybell',
    password: 'nancybell',
    database: 'belldata'
});





app.post("/api/login", (req, res) => {
    const user = {
        id: req.body.id,
        nombre: req.body.nombre,
    }

    jwt.sign({ user }, 'secretkey', { expiresIn: '2h' }, (err, token) => {
        res.json({
            token
        });
    });

});

app.post("/api/posts", verifyToken, (req, res) => {

    jwt.verify(req.token, 'secretkey', (error, authData) => {
        if (error) {
            res.sendStatus(403);
        } else {
            res.json({
                mensaje: "Post fue creado",
                authData
            });
        }
    });
});

// Authorization: Bearer <token>
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.get('/api/users', (req, res) => {
    const sql = `SELECT * FROM users`;
    connection.query(sql, (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('Not result');
        }
    });
});


app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM users WHERE id=${id}`;
    connection.query(sql, (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('Not result');
        }
    });
});


app.get('/api/calendar', (req, res) => {
    //const { id } = req.params;
    const sql = `SELECT * FROM calendar`;
    connection.query(sql, (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('Not result');
        }
    });
});

app.post('/api/addcalendar', (req, res) => {
    const sql = 'INSERT INTO calendar SET ?';

    const calendarObj = {
        nombre: req.body.nombre,
        dia: req.body.dia,
        hora: req.body.hora,
        lunes: req.body.lunes,
        martes: req.body.martes,
        miercoles: req.body.miercoles,
        jueves: req.body.jueves,
        viernes: req.body.viernes,
        sabado: req.body.sabado,
        domingo: req.body.domingo,
        estado: req.body.estado
    };

    connection.query(sql, calendarObj, error => {
        if (error) throw error;
        res.send('Horario creado!');
    });
});


app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, dia, hora, lunes, martes,
        miercoles,
        jueves,
        viernes,
        sabado,
        domingo,
        estado } = req.body;
    const sql = `UPDATE calendar SET nombre = '${nombre}', 
    dia='${dia}' ,
    hora='${hora}' ,
    lunes='${lunes}' ,
    martes='${martes}' ,
    miercoles='${miercoles}' ,
    jueves='${jueves}' ,
    viernes='${viernes}' ,
    sabado='${sabado}' ,
    domingo='${domingo}' ,
    estado='${estado}' ,
    WHERE id =${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('Calendario actualizado!');
    });
});

app.delete('/deletecalendar/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM calendar WHERE id= ${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('Calendario eliminado');
    });
});


// Sonar timbre
app.post('/api/sound', (req, res) => {
    // función para enviar información al arduino 
});

app.listen(3000, () => {
    console.log("nodejs app running...");
});