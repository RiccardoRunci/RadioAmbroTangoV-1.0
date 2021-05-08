const connection = require('../DBMS/ConnessioneDB');
const express = require('express');
const router = express.Router()
router.use(express.json());
const bcrypt= require ('bcrypt');
const jwt=require('./Token/jwtDj'); 

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
router.post('/inserisciutente',function (req, res)
{
   let Email=req.body.emailUt;
   let Password=req.body.passwordUt;
          //uso questa funzione callback!
   trovato=(CercaUtente(Email,async function(RisultatoFunzione) 
   {
     if(RisultatoFunzione)
     {
      res.json("DJ già presente!!!");
     }
     else
     {
        try
        {
         const salt=await bcrypt.genSalt(10);
         const hashPassword= await bcrypt.hash(Password,salt);

         let sql = `INSERT INTO tabdj (EmailDj, PasswordDj) VALUES(?, ?)`;
        connection.query(sql, [Email , hashPassword], (err, result,response) =>
        { //con stringify trasformo il json in stringa ma è sempre un json (però dentro è formato da stringhe)!!
          if (err) {res.status(500).send(JSON.stringify({"Errore":err }));} 
          else {res.json("Dj inserito!");}
        });
        }
        catch(error)
        {
          console.log("Errore inserimento DJ:"+error);
        }
      }
   }));

});
//--------------------------------------------------------------------------------------------------
function CercaUtente(Email,callback)
 {//tutte le funzioni che lavorano con mysql sono delle callback.
  try //quindi aposto dei return ci vanno le "callback".
  {
    connection.query('SELECT COUNT(EmailDj)as Contatore FROM tabdj where EmailDj = ?',Email,(err,row,result)=>
    {
      //console.log("row "+row[0].Contatore);
      if(row[0].Contatore>0)
      {
        console.log("DJ TROVATO!!!!")
        callback(true);
      }
      else
      {
        console.log("DJ NON TROVATO!!!");
        callback(false);
      }
    });
  }
  catch(err)
  {
    console.log("Errore ricerca Dj: "+err);
    callback(false);
  }
  return false;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
router.post('/login',async function (req,res)
{
  let Email=req.body.emailUt;
  let Password=req.body.passwordUt;

  (CercaUtente(Email,function(RisultatoFunzione) //Cerco l'utente!
  {
    if(RisultatoFunzione) //se trovo l'utente
    {
      console.log("DJ trovato!!")
      CercaPassword(Email,async function(RisultatoFunzione) //cerco la password:
      {
        console.log(RisultatoFunzione);  //questa è la password!
       try
       {
        if(await bcrypt.compare(Password,RisultatoFunzione))
        {
          console.log("Le 2 password coincidono");
           /*PARTE JWT
            DEL LOGIN 
            ADMIN */
            let token= jwt.RilasciaToken(Email); //ricevo il token dal file ./Token/jwt.js
            console.log("TOKEN RILASCIATO DALLA REST LOGIN UTENTI:\n"+token);
            res.status(200).json(token);
        }
        else
        {
          console.log("Le 2 password non conincidono!!!");
          res.json("Password Errata!");
        }
       }
       catch(error) { console.log("Errore Login DJ"+error); }
      });
    }
    else {res.json("DJ NON TROVATO!!");}
  }));
});
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function CercaPassword(Email,callback)
 {//tutte le funzioni che lavorano con mysql sono delle callback.
  try //quindi aposto dei return ci vanno le "callback".
  {
    connection.query('SELECT PasswordDj FROM tabdj where EmailDj = ?',Email,(err,row,result)=>
    {
      //console.log("row "+row[0].Contatore);
      if(!err)
      {
        //console.log("TROVATO!!!!")
        //console.log("Password trovata:"+row[0].PasswordUtente)
        callback(row[0].PasswordDj);
      }
    });
  }
  catch(err)
  { callback(false); }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports=router;