const connection = require('../DBMS/ConnessioneDB');
const express = require('express');
const router = express.Router()
router.use(express.json());
var FormData = require('form-data');
const mid=require('./Token/mid'); //Il midleware per i token
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//seleziona tutte le persone
router.get('/TutteCanzoni/:NomeEpisodio',[mid.ControllaAutorizazione],(req,res)=>
{
    let NomeEpisodio=req.params.NomeEpisodio;
    try
    {
       let query = connection.query('select tab_canzoni.IdCanzone,tab_canzoni.Vocale,tab_canzoni.LinkYouTube,tab_canzoni.Episodio_ID from tab_canzoni,tab_episodi where  tab_canzoni.Episodio_ID = tab_episodi.IdEpisodio and tab_episodi.NomeEpisodio=?',NomeEpisodio,(err,result)=>
        {
            res.setHeader('Content-Type', 'application/json');//setto l'header del json? ma quelle sono parole chiavi!
            if(err) {res.status(500).send(JSON.stringify({"Errore": err }));} 
            else
            {
                res.json(result); //così res mi serializza l'oggetto automaticamente in json.
            }
        });
    }
    catch(error)
    {
        console.log("Errore in rest: /TutteCanzoni: "+Error);
    }
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
router.get('/Episodi',[mid.ControllaAutorizazione],(req,res)=>
{
    (CercaEpisodi(function(RisultatoFunzione)
    {
        if(RisultatoFunzione)
        {
            //console.log("Ci sono degli episodi");
            //POSSO ESTRARLI!----------------------------------------------------------------------------------------------------------------------------------
            try
            {
              let sql ='select * from tab_episodi';
              let query = connection.query(sql,(err,result)=>
              {
                res.setHeader('Content-Type', 'application/json');//setto l'header del json? ma quelle sono parole chiavi!
                if(err) {res.status(500).send(JSON.stringify({"Errore": err }));} 
                else
                {
                 res.json(result); //così res mi serializza l'oggetto automaticamente in json.
                }
              });
            }
            catch(error)
            {
              console.log("Errore estrapolazione /Episodi "+error);
            }
            //-------------------------------------------------------------------------------------------------------------------------------------------------
        }
        else
        {
            res.json("Non ci sono ancora episodi!");
        }
    }));
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
function CercaEpisodi(callback)
{//tutte le funzioni che lavorano con mysql sono delle callback.
    try //quindi aposto dei return ci vanno le "callback".
    {
        connection.query('SELECT COUNT(NomeEpisodio)as Contatore FROM tab_episodi',(err,row,result)=>
        {
          //console.log("row "+row[0].Contatore);
          if(row[0].Contatore>0)
          {
            console.log("Funzione Cerca Episodi: Ci sono degli Episodi!!")
            callback(true);
          }
          else
          {
            console.log("Funzione Cerca Episodi: NON ci sono degli Episodi!!");
            callback(false);
          }
        });
      }
      catch(err)
      {
        console.log("Errore ricerca"+err);
        callback(false);
      }
      //return false;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
module.exports=router;