const mysql = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'utenterootdbprova',
    password : 'password',
    database : 'dbprova',
    port: '3306' //porta di mysql
  });

  connection.connect((err)=>{ //se ho qualche problema per connettermi al db!
    if(err){
        console.log('Connessione al db non riusciuta!!\n',+JSON.stringify(err,undefined,2)); //mostra l'errore
    }
    console.log("db connesso!!");
    });

    module.exports=connection;