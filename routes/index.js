const router = require('express').Router();

router.use('/', require('./swagger'))
router.use('/authors', require('./authors'))
router.use('/books', require('./books'))

module.exports = router;