// const Mysqli = require('mysqli');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var mysql = require('mysql');
// s^FBiCnZFb.(
// var connection = mysql.createConnection({
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: '',
//     database: 'learning'
// });
var connection = mysql.createConnection({
    host: '103.27.238.234',
    port: 3306,
    user: 'lamdaolo_lamdaoloi',
    password: 's^FBiCnZFb.(',
    database: 'lamdaolo_lamdaoloi'
});
module.exports = {connection: connection} ;
// https://server-bao94.herokuapp.com/uploads/FunOfHeuristic_bon-buoc-de-co-ngay-mon-bun-rieu-cua-dong.jpg