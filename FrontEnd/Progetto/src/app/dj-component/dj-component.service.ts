import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Episodi } from './Episodi';

@Injectable({
  providedIn: 'root'
})

export class DjComponentService 
{
  ngOnInit(): void {  }
  constructor(private http: HttpClient) {}
//-----------------------------------------------------------------------------------------
  InserisciEpisodio(NomeEpisodio:string)
  {
    //creo un nuovo header contenente il token jwt dell'utente dj:
    let t=localStorage.getItem('tokenLoginDj');
    var headers_object = new HttpHeaders().set("Authorization", "Bearer " + t);
    const httpOptions = 
    {
      headers: headers_object
    };

    var InserisciEp = ('/api/Dj-Route/inserisciEpisodio');
    return this.http.post
    (
      InserisciEp,
      {
        'nomeEpisodio': NomeEpisodio,
      },httpOptions //allego l'header appena creato con il token.
    )
  }
//-----------------------------------------------------------------------------------------
  ElencoEpisodi():Observable<Episodi[]> //observable perchè è una funzione asincrona
  { 
    //creo un nuovo header contenente il token jwt dell'utente dj:
    let t=localStorage.getItem('tokenLoginDj');
    var headers_object = new HttpHeaders().set("Authorization", "Bearer " + t);
    const httpOptions = 
    {
      headers: headers_object
    };

    return  this.http.get<Episodi[]>('/api/Dj-Route/Episodi',httpOptions);
  }
//-----------------------------------------------------------------------------------------
  EliminaEpisodio(NomeEpisodio:string)
  {
    //creo un nuovo header contenente il token jwt dell'utente dj:
    let t=localStorage.getItem('tokenLoginDj');
    var headers_object = new HttpHeaders().set("Authorization", "Bearer " + t);
    const httpOptions = 
    {
      headers: headers_object
    };

    //console.log("Nome Episodio da eliminare arrivato: "+NomeEpisodio);
   var EliminaEp = ('/api/Dj-Route/EliminaEpisodio/'+NomeEpisodio);
    return this.http.delete(EliminaEp,httpOptions);
  } 
//-----------------------------------------------------------------------------------------
  insersiciCanzone(Vocale:string,LinkYouTube:string,NomeEpisodio:string) //'POST /inserisciCanzone'
  { 
    //creo un nuovo header contenente il token jwt dell'utente dj:
    let t=localStorage.getItem('tokenLoginDj');
    var headers_object = new HttpHeaders().set("Authorization", "Bearer " + t);
    const httpOptions = 
    {
      headers: headers_object
    };

    //mette tutto nell'header: f12->network-> click su inserisciCanzone e a dx su header 
      let formData = new FormData(); //per spedire la base64 creo una form data.
      formData.append('Vocale',Vocale); //per spedire la base64 creo una form data.
      formData.append('LinkYouTube',LinkYouTube);
      formData.append('NomeEpisodio',NomeEpisodio);
      console.log(Vocale);
    return this.http.post('/api/Dj-Route/inserisciCanzone',formData,httpOptions);
   
  }
//-----------------------------------------------------------------------------------------
  EliminaCanzone()
  {

  }
//-----------------------------------------------------------------------------------------
}
