const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./db');

const bodyParser = require('body-parser'); 
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;


const JWTauthMiddleware = require('./JWTauth')

const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');


//use the routes
app.use('/user' ,userRoutes);
app.use('/candidate',candidateRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})            // 1st argument is the port number where we define the port number and 2nd argument is the callback function