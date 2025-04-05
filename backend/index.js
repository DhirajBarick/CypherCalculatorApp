const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cipherRoutes = require('./routes/cipherRoutes');
const dotenv = require('dotenv');

const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

app.use('/api/cipher', cipherRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  
