const express = require('express');
const app = express();

const path = require('path');
const cors = require('cors');

const {logger} = require('./middleware/logEvents');
const {errorHandler} = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
const corsOptions = require('./config/corsOptions')
app.use(cors(corsOptions));

// handles form data
app.use(express.urlencoded({extended: false}));

// handles json
app.use(express.json());

// handles static files
app.use(express.static('static'));

// Routes
app.use('/', require('./routes/root'));

// 404
app.use((req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
        return;
    }
    if (req.accepts('json')) {
        res.json({error: '404 Not Found'});
    }
    else {
        res.type('txt').send('404 Not Found');
    }
})

// Error handling
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
