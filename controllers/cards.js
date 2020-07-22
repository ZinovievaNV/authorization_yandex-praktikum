/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

module.exports = {
  getCards(req, res) {
    Card.find({})
      .populate(['owner', 'likes'])
      .then((card) => res.send({ data: card }))
      .catch((error) => res.status(500).send({ message: `${error.message}` }));
  },
  createCard(req, res) {
    const { name, link } = req.body;
    Card.create({ name, link, owner: req.user._id })
      .then((card) => res.send({ data: card }))
      .catch((error) => res.status(400).send({ message: `${error.message}` }));
  },

  deleteCardById(req, res) {
    Card.findById({ _id: req.params.cardId })
      .orFail(() => Error('Карточка не найдена'))
      // eslint-disable-next-line consistent-return
      .then((card) => {
        if (!(card.owner.toString() === req.user._id.toString())) {
          return res.status(403).send({ message: 'это не Ваша карта, её нельзя удалить!' });
        }
        Card.deleteOne({ _id: card._id })
          .then(() => {
            res.send({ message: 'Карточка удалена' });
          })
          .catch((error) => {
            res.status(500).send({ message: `${error.message}` });
          });
      })
      .catch((error) => res.status(404).send({ message: error.message }));
  },

};
