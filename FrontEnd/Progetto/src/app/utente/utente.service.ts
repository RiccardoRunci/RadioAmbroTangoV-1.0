import { Injectable } from '@angular/core';
import { Canzoni } from './Canzoni';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; //importo HttpClient che è una classe che stà nel packeg '@angular/common/http'
import { Observable } from 'rxjs';
import { Episodi } from './Episodi';

@Injectable({
  providedIn: 'root'
})
export class UtenteService 
{
  constructor(private http: HttpClient) { }
//-----------------------------------------------------------------------------------------------
  ElencoCanzoni(EpisodioSelezionato:string):Observable<Canzoni[]> //observable perchè è una funzione asincrona
  { //stampo la lista di tutti gli utenti!
    console.log("EPISODIO SELEZIONATO:"+EpisodioSelezionato);
    let t=localStorage.getItem('tokenLogin');
    var headers_object = new HttpHeaders().set("Authorization", "Bearer " + t);
    const httpOptions = 
    {
      headers: headers_object
    };
    return  this.http.get<Canzoni[]>('/api/Utente/TutteCanzoni/'+EpisodioSelezionato,httpOptions);
  }
//-----------------------------------------------------------------------------------------------
  ElencoEpisodi():Observable<Episodi[]> //observable perchè è una funzione asincrona
  { 
    //creo un nuovo header contenente il token jwt dell'utente dj:
    let t=localStorage.getItem('tokenLogin');
    var headers_object = new HttpHeaders().set("Authorization", "Bearer " + t);
    const httpOptions = 
    {
      headers: headers_object
    };

    return  this.http.get<Episodi[]>('/api/Utente/Episodi',httpOptions);
  }
//-----------------------------------------------------------------------------------------------  
}
