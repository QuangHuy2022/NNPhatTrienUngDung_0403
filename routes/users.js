var express = require('express');
var router = express.Router();
let { dataUser, dataRole } = require('../utils/userData');

// GET /users
router.get('/', function (req, res, next) {
  let result = dataUser.filter(e => !e.isDeleted);
  res.send(result);
});

// GET /users/:id (or by username)
router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataUser.find(e => (e.username === id || e.id === id) && !e.isDeleted);
  if (result) {
    res.send(result);
  } else {
    res.status(404).send({ message: "USER NOT FOUND" });
  }
});

// POST /users
router.post('/', function (req, res, next) {
  let roleIdStr = req.body.role;
  if (typeof roleIdStr === 'object' && roleIdStr !== null) {
    roleIdStr = roleIdStr.id;
  }
  let getRole = dataRole.find(e => e.id === roleIdStr);

  if (!getRole) {
    return res.status(400).send({ message: "ROLE NOT FOUND" });
  }

  let newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl || "https://i.sstatic.net/l60Hf.png",
    status: req.body.status !== undefined ? req.body.status : true,
    loginCount: 0,
    role: getRole,
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  };
  dataUser.push(newUser);
  res.send(newUser);
});

// PUT /users/:id
router.put('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataUser.find(e => (e.username === id || e.id === id) && !e.isDeleted);
  if (result) {
    let keys = Object.keys(req.body);
    for (const key of keys) {
      if (key === 'role') {
        let roleIdStr = req.body.role;
        if (typeof roleIdStr === 'object' && roleIdStr !== null) roleIdStr = roleIdStr.id;
        let getRole = dataRole.find(e => e.id === roleIdStr);
        if (!getRole) {
          return res.status(400).send({ message: "ROLE NOT FOUND" });
        }
        result.role = getRole;
        continue;
      }
      if (key !== 'username' && result[key] !== undefined) {
        result[key] = req.body[key];
      }
    }
    result.updatedAt = new Date(Date.now());
    res.send(result);
  } else {
    res.status(404).send({ message: "USER NOT FOUND" });
  }
});

// DELETE /users/:id
router.delete('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataUser.find(e => (e.username === id || e.id === id) && !e.isDeleted);
  if (result) {
    result.isDeleted = true;
    result.updatedAt = new Date(Date.now());
    res.send(result);
  } else {
    res.status(404).send({ message: "USER NOT FOUND" });
  }
});

module.exports = router;
