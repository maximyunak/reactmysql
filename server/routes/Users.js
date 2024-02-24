const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');

const { validateToken } = require('../middlewares/AuthMiddlewares');

const { sign } = require('jsonwebtoken');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const exUser = await Users.findOne({ where: { username: username } });
  if (exUser) {
    return res.json('User with this username exists');
  } else {
    bcrypt.hash(password, 10).then((hash) => {
      Users.create({
        username: username,
        password: hash,
      });
      res.json('succes');
    });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) {
    return res.json({ error: "User doesn't exist" });
  }

  bcrypt.compare(password, user.password).then((match) => {
    if (!match) {
      return res.json({ error: 'Wrong username and password combination' });
    }

    const accessToken = sign({ username: user.username, id: user.id }, 'importantsecret');

    res.json({ token: accessToken, username: username, id: user.id });
  });
});

router.get('/auth', validateToken, (req, res) => {
  res.json(req.user);
});

router.get('/info/:id', async (req, res) => {
  const id = req.params.id;

  const info = await Users.findByPk(id, { attributes: { exclude: ['password'] } });
  res.json(info);
});

router.put('/changepassword', validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await Users.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) {
      return res.json({ error: 'Wrong password entered' });
    }

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        {
          password: hash,
        },
        { where: { username: req.user.username } },
      );
      res.json('succes');
    });
  });
});

module.exports = router;
