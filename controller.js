'use strict';

var response = require('./res');

exports.index = function (req, res) {
    response.ok("Halo! Selamat datang di e-CIA", res)
};

