const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');

const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', booksController.getBooks);
router.post('/', isAuthenticated, booksController.postBook);
router.put('/:id', isAuthenticated, booksController.putBook);
router.delete('/:id', isAuthenticated, booksController.deleteBook);

module.exports = router;