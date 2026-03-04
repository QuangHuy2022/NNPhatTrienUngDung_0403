var express = require('express');
var router = express.Router();
let { dataRole, dataUser } = require('../utils/userData');

// GET /roles
router.get('/', function (req, res, next) {
    let result = dataRole.filter(e => !e.isDeleted);
    res.send(result);
});

// GET /roles/:id
router.get('/:id', function (req, res, next) {
    let id = req.params.id;
    let result = dataRole.find(e => e.id === id && !e.isDeleted);
    if (result) {
        res.send(result);
    } else {
        res.status(404).send({ message: "ROLE NOT FOUND" });
    }
});

// GET /roles/:id/users
router.get('/:id/users', function (req, res, next) {
    let id = req.params.id;
    let role = dataRole.find(e => e.id === id && !e.isDeleted);
    if (!role) {
        return res.status(404).send({ message: "ROLE NOT FOUND" });
    }
    let users = dataUser.filter(e => e.role && e.role.id === id && !e.isDeleted);
    res.send(users);
});

// POST /roles
router.post('/', function (req, res, next) {
    let newRole = {
        id: req.body.id || ("r" + Date.now()),
        name: req.body.name,
        description: req.body.description,
        creationAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
    };
    dataRole.push(newRole);
    res.send(newRole);
});

// PUT /roles/:id
router.put('/:id', function (req, res, next) {
    let id = req.params.id;
    let result = dataRole.find(e => e.id === id && !e.isDeleted);
    if (result) {
        if (req.body.name !== undefined) result.name = req.body.name;
        if (req.body.description !== undefined) result.description = req.body.description;
        result.updatedAt = new Date(Date.now());
        res.send(result);
    } else {
        res.status(404).send({ message: "ROLE NOT FOUND" });
    }
});

// DELETE /roles/:id
router.delete('/:id', function (req, res, next) {
    let id = req.params.id;
    let result = dataRole.find(e => e.id === id && !e.isDeleted);
    if (result) {
        result.isDeleted = true;
        result.updatedAt = new Date(Date.now());
        res.send(result);
    } else {
        res.status(404).send({ message: "ROLE NOT FOUND" });
    }
});

module.exports = router;
