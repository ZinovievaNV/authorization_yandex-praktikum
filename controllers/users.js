const User = require('../models/user');

module.exports = {
  getUsers(req, res) {
    User.find({})
      .then((user) => res.send({ data: user }))
      .catch((error) => res.status(500).send({ message: `${error.message}` }));
  },

  getUserById(req, res) {
    User.findById(req.params.userId)
      .orFail(new Error('Пользователь не найден'))
      .then((user) => res.send({ data: user }))
      .catch((error) => {
        res.status(404).send({ message: `${error.message}` });
      });
  },

};
