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
const corsWhitelist = ['http://localhost:3500','https://www.google.com'];
const corsOptions = {
    origin: (origin, callback) => {
      if(corsWhitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// handles form data
app.use(express.urlencoded({extended: false}));

// handles json
app.use(express.json());

// handles static files
app.use(express.static('static'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new.html'));
});

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
