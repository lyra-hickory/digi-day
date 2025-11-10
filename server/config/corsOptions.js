const cors = require("cors");
const express = require("express");
const corsWhitelist = [
    'http://localhost:3500',
    'https://www.google.com',
];
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

module.exports = {corsOptions};