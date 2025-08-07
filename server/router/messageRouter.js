const express = require('express');
const { createmessage, getHappyUsers, getmessage, getSatisfactionRate } = require('../Controller/ContactControl');

const msgRoute =express.Router();
msgRoute.post('/createmsg',createmessage)
msgRoute.get('/gethappy',getHappyUsers)
msgRoute.get('/getmsg',getmessage)
msgRoute.get('/rate',getSatisfactionRate)
module.exports = msgRoute;