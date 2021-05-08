import { Injectable } from '@angular/core'; //HttpClient permette di fare upload/download e accedere ai dati di un servizio backend tramite il protocollo http.
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; //importo HttpClient che è una classe che stà nel packeg '@angular/common/http'
import {Utenti} from './Utenti';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService 
{
  /*Nel costruttore inizializzo l'attributo http che sarà di tipo HttpClient.
  In modo tale (per quando mi servirà) di fare this.http e richiamare il metodo get() il quale
  mi permette di fare il "fetch data" ossia di recuperare i dati dal backend.*/
  constructor(private http: HttpClient) { }
  
//-----------------------------------------------------------------------------------------------------------
  TuttoElenco():Observable<Utenti[]> //observable perchè è una funzione asincrona
  { //stampo la lista di tutti gli utenti!
    	//creo un nuovo header contenente il token jwt dell'utente admin:
      let t=localStorage.getItem('tokenLoginAdmin');
      var headers_object = new HttpHeaders().set("Authorization", "Bearer " + t);
      const httpOptions = 
      {
        headers: headers_object
      };
    
    return  this.http.get<Utenti[]>('/api/Admin/utenti',httpOptions);
  }
//-----------------------------------------------------------------------------------------------------------
  EliminaUtente(EmailUtente:string)
  {
    	//creo un nuovo header contenente il token jwt dell'utente admin:
      let t=localStorage.getItem('tokenLoginAdmin');
      var headers_object = new HttpHeaders().set("Authorization", "Bearer " + t);
      const httpOptions = 
      {
        headers: headers_object,

      };

    var url= ('/api/Admin/eliminautente/'+EmailUtente);
    //const params = new HttpParams().set('EmailUtente', EmailUtente);
    //return this.http.delete(url,{ params }),httpOptions;
    return this.http.delete(url,httpOptions);
  }
//----------------------------------------------------------------------------------------------------------- 
  CercaUtente(EmailUtente: string) 
  {
    let t=localStorage.getItem('tokenLoginAdmin');
    var headers_object = new HttpHeaders().set("Authorization", "Bearer " + t);
    const httpOptions = 
    {
      headers: headers_object
    };

    console.log("Comincio la ricerca?");
    return this.http.get('/api/Admin/utenti/'+EmailUtente,httpOptions);  
  }
//-----------------------------------------------------------------------------------------------------------
}

