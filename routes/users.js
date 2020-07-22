const usersRouter = require('express').Router();
const { getUsers, getUserById } = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserById);

module.exports = usersRouter;
