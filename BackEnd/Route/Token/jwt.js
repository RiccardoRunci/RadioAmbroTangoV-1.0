//https://www.youtube.com/watch?v=NikBvN7XDq4
var jwt=require('jsonwebtoken'); //importo la libreria dei jwt. Devo fare "npm -i jsonwebtoken"

/*Metodo che rilascerà un token:*/
let RilasciaToken=(EmailUtente)=>
{
    let payload={Email:EmailUtente}
    var token=jwt.sign(payload,'chiaveSegreta',{
        algorithm:"HS256",//ALGORITMO ADEGUATO PER LA chiaveSegreta.(aka sharedkey in chiaro,ma non è il massimo. ci vuole un token cifrato con un certificato macchina.)
        expiresIn:"2h"
    });
    /*Qui sopra tra le opzioni posso mettere issue: wwww.miosito.com per evitare
      che altri sito possano chiamare le mie rest. Così evito le richieste cross origin.*/
    return token;  
}

/*Metodo che verificherà se il token è  valido: SERVE PER PROTEGGERE LE ROTTE REST!*/
let ControllaToken=(token)=>
{
  jwt.verify(token,'chiaveSegreta',{expiresIn:'2h'}) //manda un eccezione se il token non è valido.
}

/*Esporto i metodi sopra per essere richiamati da altre chiamate rest*/
module.exports={
    RilasciaToken,
    ControllaToken
}