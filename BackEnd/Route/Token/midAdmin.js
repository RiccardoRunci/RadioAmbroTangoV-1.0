//https://www.youtube.com/watch?v=NikBvN7XDq4
/*Questo file è un midleware che mi consente di utilizzare facilmente l'accesso 
  tramite token su tutte le rotte rest*/
  const jwt=require('./jwtAdmin');

  /*Questo metodo ci consentirà di verificare se siamo o no autenticati con jwt:*/
  const ControllaAutorizazione= (req,res,next)=>
  {
    try //uso il try catch per catturare l'eccezione lanciata da ControllaToken.
    {//controllo se nell'headers della nostra req ci sia un 'autorization': 
      if(req.headers['authorization']==null)
      { 
        console.log("SI FERMA QUI???");
        res.sendStatus(401); //non trovo l'authorization:
      }
      else //se trovo l'authorization:
      {
        let token=req.headers['authorization'];
        token=token.slice(7,token.length); //metodo che toglie la scritta bearer. lascia il caratteri dal 7 alla fine.
        jwt.ControllaToken(token); //passo il token al metodo di ./Token/jwt.js che lo controlla.
        next();
      }
    }
    catch(err)
    {
      console.log(err.message);
      res.sendStatus(401);
    }
  }
  
  module.exports=
  {
      ControllaAutorizazione
  }