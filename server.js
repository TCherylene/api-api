const express = require('express');
const bodyParser = require('body-parser');

var morgan = require('morgan');
const app = express();
var cors = require('cors');

//parse application/json
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

//panggil routes
var routes = require('./routes');
routes(app);

//daftarkan menu routes dari index
app.use('/api', require('./middleware'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.warn(`App listening on ${PORT}`);
})  