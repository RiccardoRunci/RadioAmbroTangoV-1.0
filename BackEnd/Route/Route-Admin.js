const connection = require('../DBMS/ConnessioneDB');
const express = require('express');
const router = express.Router()
const mid=require('./Token/midAdmin'); //Il midleware per i token
router.use(express.json());
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//seleziona tutte le persone
router.get('/utenti',[mid.ControllaAutorizazione],(req,res)=>{ //req e res sono i due oggetti request e response del protocollo http.
    let sql ='select * from tabutenti';
    let query = connection.query(sql,(err,result)=>
    {
      res.setHeader('Content-Type', 'application/json');//setto l'header del json? ma quelle sono parole chiavi!
        if(err) {res.status(500).send(JSON.stringify({"Errore": err }));} 
        else
        {
         res.json(result); //così res mi serializza l'oggetto automaticamente in json.
        }
    });
  });
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //seleziona una persona per id:
  router.get('/utenti/:EmailUtente',[mid.ControllaAutorizazione],(req,res)=>
  {
    EmailUtente=[req.params.EmailUtente];
  
    trovato=(CercaUtente(EmailUtente,function(RisultatoFunzione) //uso questa funzione callback!
     {
       if(RisultatoFunzione)
       {
          try
          {
            connection.query('SELECT IdUtente,EmailUtente,PasswordUtente FROM tabutenti where EmailUtente = ?',EmailUtente,(err,row,result)=>
            {
              if(!err)
              {
                res.json("Trovato\nId:"+row[0].IdUtente+"\nNomeUtente: "+row[0].EmailUtente+"\nPasswordUtente: "+row[0].PasswordUtente); 
              }
              else 
              { //Errore in generale:
                res.json("Errore nella ricerca:"+err );
              }
            });
          }
          catch(err)
          {
            console.log("Errore"+err);
            res.status(500).send(JSON.stringify({"Errore": err }));
          }
       }
       else
       {
        res.json("Utente NON TROVATO!"); 
       }
    }));
  
  });
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //route for delete data
  router.delete('/eliminautente/:EmailUtente',[mid.ControllaAutorizazione],function (req, res)  
  {
    //var url = require('url');
    //var parts = url.parse(req.url, true);
    //EmailUtente=[req.params.EmailUtente];
    //Email=parts.query.EmailUtente;
    Email=[req.params.EmailUtente];
    //console.log(parts);
    //console.log(parts.query.NomeUtente); //stampa il nome utente passato nella richiesta
  
    trovato=(CercaUtente(Email,function(RisultatoFunzione) //uso questa funzione callback!
    {
      if(RisultatoFunzione)
      {
        connection.query(`DELETE FROM tabutenti WHERE EmailUtente=?`, [Email],
        function (error) 
        {
          if (error) {throw error}
          else {res.json('Utente: '+Email+" è stato eliminato!");}
        });
      }
      else //NomeUtente non trovato!
      {
        res.json('Utente: '+Email+" NON TROVATO!!");
      }
    }));
    
   });
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  function CercaUtente(Email,callback)
   {//tutte le funzioni che lavorano con mysql sono delle callback.
    try //quindi aposto dei return ci vanno le "callback".
    {
      connection.query('SELECT COUNT(EmailUtente)as Contatore FROM tabutenti where EmailUtente = ?',Email,(err,row,result)=>
      {
        //console.log("row "+row[0].Contatore);
        if(row[0].Contatore>0)
        {
          console.log("TROVATO!!!!")
          callback(true);
        }
        else
        {
          console.log("NON TROVATO!!!");
          callback(false);
        }
      });
    }
    catch(err)
    {
      console.log("Errore ricerca"+err);
      callback(false);
    }
    return false;
  }
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
module.exports=router;

