import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UtenteService} from './utente.service';
import { Canzoni } from './Canzoni';
import { Episodi } from './Episodi';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';


@Component({
  selector: 'app-utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.css']
})
export class UtenteComponent implements OnInit 
{
  public ArrayCanzoni: Canzoni[] = [];
  public ArrayEpisodi: Episodi[] = [];

  private EpisodioSelezionato="";
  
  constructor(private service: UtenteService,
              private router: Router) {}

  ngOnInit(): void { this.elencoEpisodi();} 
//----------------------------------------------------------------------------------
  LogOut()
  {
    localStorage.removeItem('tokenLogin');
    this.router.navigate(['LoginUtente']); //per cambiare pagina, guarda il costruttore, importa router.
  }
//----------------------------------------------------------------------------------
ElencoCanzoni()
{
  if(this.EpisodioSelezionato!=="" && this.EpisodioSelezionato!=="Seleziona Episodio")
  {
    this.service.ElencoCanzoni(this.EpisodioSelezionato)
    .subscribe(data => this.ArrayCanzoni = data);
    if (this.ArrayCanzoni.length===0)
    {
      //NON CI SONO CANZONI!!!!
    }
    else
    {

    }
  }
  else
  {
    alert("Devi prima selezionare un episodio dale menu a tendina!");
  }
}
//----------------------------------------------------------------------------------
selectChangeHandler (event: any) //metodo per far funzionare la selezione degli elementi dentro la select (componente html)
{
  //this.flagHtmlEpisodi=true;
  //update the ui
  this.EpisodioSelezionato = event.target.value;
}
//----------------------------------------------------------------------------------
elencoEpisodi()
  {
    this.service.ElencoEpisodi()
    .subscribe(data => this.ArrayEpisodi = data);
  }
//----------------------------------------------------------------------------------
}//fine classe.
