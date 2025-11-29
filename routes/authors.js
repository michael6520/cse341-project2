const express = require('express');
const router = express.Router();

const authorsController = require('../controllers/authors');

const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', authorsController.getAuthors);
router.post('/', isAuthenticated, authorsController.postAuthor);
router.put('/:id', isAuthenticated, authorsController.putAuthor);
router.delete('/:id', isAuthenticated, authorsController.deleteAuthor);

module.exports = router;