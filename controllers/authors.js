const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validateAuthor = (author) => {
    if (!author.firstName || typeof author.firstName !== 'string')
        return { valid: false, error: 'firstName is required and must be a string.' };
    if (!author.lastName || typeof author.lastName !== 'string')
        return { valid: false, error: 'lastName is required and must be a string.' };
    if (!author.birthYear || typeof author.birthYear !== 'number')
        return { valid: false, error: 'birthYear is required and must be a number.' };
    return { valid: true };
};

const getAuthors = async (req, res) => {
    //#swagger.tags=['Authors']
    try {
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('authors')
            .find();
        
        const authors = await result.toArray();

        res.setHeader('content-type', 'application/json');
        res.status(200).json(authors);
    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const postAuthor = async (req, res) => {
    //#swagger.tags=['Authors']
    const author = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthYear: req.body.birthYear
    }

    const valid = validateAuthor(author);
    if (!valid.valid)
        return res.status(400).json({ error: valid.error });
    
    try {
        const response = await mongodb
            .getDatabase()
            .db()
            .collection('authors')
            .insertOne(author);

        if (response.acknowledged > 0)
            res.status(204).send();
        else
            res.status(500).json(response.error || 'Database error while creating author.');
    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error.' });
    }

};

const putAuthor = async (req, res) => {
    //#swagger.tags=['Authors']
    const author = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthYear: req.body.birthYear
    }

    const valid = validateAuthor(author);
    if (!valid.valid)
        return res.status(400).json({ error: valid.error });   

    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid author ID." });
        }
        const authorId = new ObjectId(req.params.id);

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('authors')
            .replaceOne({ _id: authorId }, author);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        }
        else {
            res.status(500).json(response.error || 'Database error while modifying author.');
        }        
    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error.' })
    }
};

const deleteAuthor = async (req, res) => {
    //#swagger.tags=['Authors']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid author ID." });
        }
        const authorId = new ObjectId(req.params.id);

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('authors')
            .deleteOne({ _id: authorId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        }
        else {
            res.status(500).json(response.error || 'Database error while deleting author.');
        }        
    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error.'})
    }
};

module.exports = {
    getAuthors,
    postAuthor,
    putAuthor,
    deleteAuthor
};