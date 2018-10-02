// implement your API here
const express = require('express'); // CommonJS modules > module.exports = someCode;
const cors = require('cors'); // install this package to connect from react

const db = require('./data/db.js');
const port = 8000;

const server = express();
 
server.use(express.json());
server.use(cors({ origin: "http://localhost:3000" }));; // this neeeded to connect from react

server.use(express.json()); // formatting our req.body obj.
server.post('/api/users', (req, res) => {
    const { name, bio } = req.body;
    if (!name || !bio) {
        res.status(400);
        res.json({ errorMessage: "Please provide name and bio for the user." });
    }
    else {
        db
            .insert({ name, bio })
            .then(response => {
                res.status(201);
                db.findById(response.id)
                    .then(user => {
                        res.json({ user });
                    });
            })
            .catch(error => {
                res.status(500);
                res.json({ errorMessage: "There was an error while saving the user to the database" });
            });
    }
});


server.get('/api/users', (req, res) => {
    db.find().then(users => {
        res.json({ users });
    })
        .catch(error => {
            res.status(500);
            res.json({ errorMessage: "The users information could not be retrieved." });
        });
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db
        .findById(id)
        .then(users => {
            if (users.length) {
                res.status(200);
                res.json({ users });
            }
            else {
                res.status(404);
                res.json({ errorMessage: "The user with the specified ID does not exist." });
            }
        })
        .catch(error => {
            res.status(500);
            res.json({ errorMessage: "The user information could not be retrieved." });
        })
});


server.put('/api/users/:id', (req, res) => {
    const { name, bio } = req.body;
    const id = req.params.id;
    if (!name || !bio) {
        res.status(400);
        res.json({ errorMessage: "Please provide name and bio for the user." });
    }
    else {
        db
            .update(id, { name, bio })
            .then(success => {
                if (success) {
                    res.status(200);
                    db.findById(id)
                        .then(user => {
                            res.json({ user });
                        });
                }
                else {
                    res.status(404);
                    res.json({ errorMessage: "The user with the specified ID does not exist." });
                }
            })
            .catch(error => {
                res.status(500);
                res.json({ errorMessage: "The user information could not be retrieved." });
            })
    }
});

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db
        .remove(id)
        .then(success => {
            if (success) {
                res.status(200);
                res.json({ success });
            }
            else {
                res.status(404);
                res.json({ errorMessage: "The user with the specified ID does not exist." });
            }
        })
        .catch(error => {
            res.status(500);
            res.json({ errorMessage: "The user could not be removed" });
        })
});



server.listen(port, () => console.log(`Server running on port ${port}`));

// server.get('/', (req, res) => {
//     //< ---- Route Handler ^^^
//     // request/route handler
//     res.send('<h1>Hello FSW13!</h1>');
// });

// server.get('/api/about', (req, res) => {
//     res.status(200).send('<h1>About Us</h1>');
// });

// server.get('/api/contact', (req, res) => {
//     res
//         .status(200)
//         .send('<div><h1>Contact</h1><input placeholder="email" /></div>');
// });

// // #################### USERS #######################

// server.get('/api/users', (req, res) => {
//     db.find()
//         .then(users => {
//             console.log('\n** users **', users);
//             res.json(users);
//         })
//         .catch(err => res.send(err));
// });

// server.post('/api/users', (req, res) => {
//     const { name, bio } = req.body;
//     const newUser = { name, bio };
//     db.insert(newUser)
//         .then(userId => {
//             const { id } = userId;
//             db.findById(id).then(user => {
//                 console.log(user);
//                 if (!user) {
//                     return res
//                         .status(422)
//                         .send({ Error: `User does not exist by that id ${id}` });
//                 }
//                 res.status(201).json(user);
//             });
//         })
//         .catch(err => console.error(err));
// });

// // watch for traffic in a particular computer port
// const port = 8000;
// server.listen(port, () =>
//     console.log(`\n=== API running on port ${port} ===\n`)
// );

// http://localhost:3000 > the 3000 is the port.
// 80: http, 443: https, 25: email servers
// npm run server or yarn server in our case