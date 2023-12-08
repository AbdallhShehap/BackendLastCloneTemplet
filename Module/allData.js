// const mysql = require('mysql2');

// const db = mysql.createConnection({
//   host: "db-mysql-nyc1-44248-do-user-14618823-0.b.db.ondigitalocean.com",
//   port: "25060",
//   user: "doadmin",
//   password: "123.123.",
//   database: "test2",
//   ssl: true,
//   });
  
//   db.connect(err => {
//       if (err) {
//           console.error("Error connecting to the database:", err);
//         } else {
//           console.log("Connected to the database");
//         }
//   });
  
//   module.exports = db;


  


// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: "",
//   database: 'last data'
// });


//   db.connect(err => {
//       if (err) {
//           console.error("Error connecting to the database:", err);
//         } else {
//           console.log("Connected to the database");
//         }
//   });
  
//   module.exports = db;


  


const mysql = require("mysql2");

const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '', 
  database : 'last data'
});
// const pool = mysql.createPool({
//   host     : 'localhost',
//   user     : 'qtechnet_newdata',
//   password : '?mZ7l,xvO,^#',
//   database : 'qtechnet_newdata',
//   connectionLimit: 10,
// });

// You can export the pool directly for use in other modules
module.exports = pool;


﻿
