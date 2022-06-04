'use strict';

var response = require('./res');

exports.index = function (req, res) {
    response.success("Halo! Selamat datang di e-CIA. Link dokumentasi: https://gist.github.com/TCherylene/6abd31c7ad7f3792476c2d097cf20bfc", res)
};

