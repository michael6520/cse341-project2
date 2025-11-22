const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');

router.get('/', booksController.getBooks);
router.post('/', booksController.postBook);
router.put('/:id', booksController.putBook);
router.delete('/:id', booksController.deleteBook);

module.exports = router;