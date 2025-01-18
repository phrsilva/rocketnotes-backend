const { Router } = require('express');

const ensureAuth = require('../middleware/ensureAuth');

const NotesController = require('../controllers/NotesController');
const AppError = require('../utils/AppError');

const notesRoutes = Router();

notesRoutes.use(ensureAuth);

const notesController = new NotesController();

notesRoutes.get('/', notesController.index);
notesRoutes.post('/', notesController.create);
notesRoutes.get('/:id', notesController.show)
notesRoutes.delete('/:id', notesController.delete)

module.exports = notesRoutes;


