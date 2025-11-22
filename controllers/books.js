const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validateBook = (book) => {
    if (!book.title || typeof book.title !== 'string')
        return { valid: false, error: "title is required and must be a string." };
    if (!book.authorId || !ObjectId.isValid(book.authorId))
        return { valid: false, error: "authorId is required and must be a valid ID." };
    if (!book.publishedYear || typeof book.publishedYear !== 'number')
        return { valid: false, error: "publishedYear is required and must be a number." };
    if (!book.genre || typeof book.genre !== 'string')
        return { valid: false, error: "genre is required and must be a string." };
    return { valid: true };
};

const getBooks = async (req, res) => {
    //#swagger.tags=['Books']
    try {
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('books')
            .find();
        
        const books = await result.toArray();
        
        res.setHeader('content-type', 'application/json');
        res.status(200).json(books);
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error." });
    }
};

const postBook = async (req, res) => {
    //#swagger.tags=['Books']
    const book = {
        title: req.body.title,
        authorId: new ObjectId(req.body.authorId),
        publishedYear: req.body.publishedYear,
        genre: req.body.genre
    }

    const valid = validateBook(book);
    if (!valid.valid)
        return res.status(400).json({ error: valid.error });

    try {
        const response = await mongodb
            .getDatabase()
            .db()
            .collection('books')
            .insertOne(book);

        if (response.acknowledged > 0) {
            res.status(204).send();
        }
        else {
            res.status(500).json(response.error || 'Database error while creating book.');
        }        
    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const putBook = async (req, res) => {
    //#swagger.tags=['Books']
    const book = {
        title: req.body.title,
        authorId: new ObjectId(req.body.authorId),
        publishedYear: req.body.publishedYear,
        genre: req.body.genre
    }

    const valid = validateBook(book);
    if (!valid.valid)
        return res.status(400).json({ error: valid.error });

    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid book ID." });
        }
        const bookId = new ObjectId(req.params.id);
        const response = await mongodb
            .getDatabase()
            .db()
            .collection('books')
            .replaceOne({ _id: bookId }, book);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        }
        else {
            res.status(500).json(response.error || 'Database error while modifying book.');
        }        
    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error.' })
    }
};

const deleteBook = async (req, res) => {
    //#swagger.tags=['Books']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid book ID." });
        }
        const bookId = new ObjectId(req.params.id);
        const response = await mongodb
            .getDatabase()
            .db()
            .collection('books')
            .deleteOne({ _id: bookId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        }
        else {
            res.status(500).json(response.error || 'Database error while deleting book.');
        }        
    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error.'})
    }
};

module.exports = {
    getBooks,
    postBook,
    putBook,
    deleteBook
};