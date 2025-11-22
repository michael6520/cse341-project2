const express = require('express');
const router = express.Router();

const authorsController = require('../controllers/authors');

router.get('/', authorsController.getAuthors);
router.post('/', authorsController.postAuthor);
router.put('/:id', authorsController.putAuthor);
router.delete('/:id', authorsController.deleteAuthor);

module.exports = router;