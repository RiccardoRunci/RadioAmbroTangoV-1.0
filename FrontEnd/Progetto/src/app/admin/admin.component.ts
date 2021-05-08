import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from './admin.service';
import { Utenti } from './Utenti';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit 
{
  public ArrayUtente: Utenti[] = [];
  public RisultatoRicerca:string;

  constructor(private service: AdminService,private router: Router) 
  { 
    this.RisultatoRicerca = "";

  }
  ngOnInit(): void { this.Elenco();}
//---------------------------------------------------------------------------------------------------------
  Elenco()
  {
    let i:Number;
    this.service.TuttoElenco()
    .subscribe(data => this.ArrayUtente = data);
    
    //console.log("Lunghezza Array? "+this.ArrayUtente.length);
    if (this.ArrayUtente.length===0)
    {
      //NON CI SONO UTENTI!!!!
    }
    else
    {
      for (let entry of this.ArrayUtente) 
      {
        console.log(entry);
      }
    }
  }
 
//---------------------------------------------------------------------------------------------------------
  Elimina(EmailUtente:string)
  {
    if(EmailUtente.length===0)
    {
      alert("Inserisci il nome da eliminare!");
    }
    else
    {
      EmailUtente=EmailUtente.toLowerCase();
      this.service.EliminaUtente(EmailUtente).subscribe
      (
        result => alert("Fatto, "+result), //object object
        err => console.error("Che cosa è? "+err)
      );
      this.Elenco();
    }
  }
//---------------------------------------------------------------------------------------------------------
  Cerca(EmailUtente:string)
  {
    if(EmailUtente.length===0)
    {
      alert("Inserisci il nome da CERCARE!");
    }
    else
    {
      EmailUtente=EmailUtente.toLowerCase();
      
      this.service.CercaUtente(EmailUtente).subscribe
      (
        result => alert("Fatto, "+result), //object object
        err => console.error("Che cosa è? "+err)
      );
      
    }
  }
//---------------------------------------------------------------------------------------------------------
LogOut()
{
  localStorage.removeItem('tokenLoginAdmin');
  this.router.navigate(['LoginUtente']); //per cambiare pagina, guarda il costruttore, importa router.
}
//---------------------------------------------------------------------------------------------------------
}//Fine Classe
