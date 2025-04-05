const express = require('express');
const router = express.Router();
const { caesarEncrypt, caesarDecrypt, vigenereEncrypt, vigenereDecrypt, playfairEncrypt, playfairDecrypt } = require('../utils/ciphers');

router.post('/', (req, res) => {
    const { message, key, cipher, mode } = req.body;
    console.log("Received:", { message, key, cipher, mode });
    if (!message || !key || !cipher || !mode) {
        return res.status(400).json({ error: 'Missing fields in request' });
    }
    let result = '', steps = [];
    let matrix = [];
    try {
        switch (cipher) {
            case 'Caesar': {
                const caesar = mode === 'encrypt' ? caesarEncrypt(message, key) : caesarDecrypt(message, key);
                result = caesar.result;
                steps = caesar.steps;
                break;
            }
            case 'Vigenere': {
                const vigenere = mode === 'encrypt' ? vigenereEncrypt(message, key) : vigenereDecrypt(message, key);
                result = vigenere.result;
                steps = vigenere.steps;
                break;
            }
            case 'Playfair': {
                const playfair = mode === 'encrypt' ? playfairEncrypt(message, key) : playfairDecrypt(message, key);
                result = playfair.result;
                steps = playfair.steps;
                matrix = playfair.matrix;
                console.log('Matrix:', matrix); // DEBUG: Log matrix here
                break;
            }            
            default:
                return res.status(400).json({ error: 'Invalid cipher' });
        }
        res.json({ result, steps, matrix });
    } catch (err) {
        console.error('Processing error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.toString() });
    }
});

module.exports = router;