const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = {
  login(req, res, next) {
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
      .then((user) => {
        res.send({
          // eslint-disable-next-line no-underscore-dangle
          token: jwt.sign({ _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),

        });
      })
      .catch((error) => {
        res.status(401).send({ message: `${error.message} ошибка в login` });
      })
      .catch(next);
  },
  // eslint-disable-next-line consistent-return
  createUser(req, res) {
    const {
      name, about, avatar, email,
    } = req.body;

    if (!validator.isEmail(email)) {
      return res.send({ message: 'Не правильный формат почты' });
    }

    const { password } = req.body;
    const regex = /^[a-zA-Z0-9_-]{6,15}$/;
    const checkPass = regex.test(password.trim());
    if (!checkPass) {
      return res.status(400).send({ message: 'Слишком короткий пароль! Длинна пароля должна составлять от 6 символов' });
    }

    bcrypt.hash(req.body.password, 10)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }))
      .then((user) => res.status(201).send({ data: user, message: 'Вы создались' }))
      .catch(() => res.status(400).send({ message: 'Такая почта уже существует' }));
  },
};
