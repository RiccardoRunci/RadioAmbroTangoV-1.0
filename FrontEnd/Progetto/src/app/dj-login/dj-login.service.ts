import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //importo HttpClient che è una classe che stà nel packeg '@angular/common/http'

@Injectable({
  providedIn: 'root'
})

export class DjLoginService 
{
  isLoggedIn!: boolean;
  ngOnInit(): void {  }
  //isLoggedIn: boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>;
  private Accesso = false;
  constructor(private http: HttpClient) { }
//-----------------------------------------------------------------------------------------------------
  Registra(EmailUtente:string,PasswordUtente:string)
  {
    var InserisciUt = ('/api/Dj-Login/inserisciutente');
    this.http.post
    (
      InserisciUt,
      {
        'emailUt': EmailUtente,
        'passwordUt': PasswordUtente
      }
    ).subscribe
    (
      res => 
      {
        alert(res); 
      }, 
      err => 
      {
        console.log(err);
      }
    )  
  }
//-----------------------------------------------------------------------------------------------------  
LoginPassword(EmailUtente: string,PasswordUtente: string)
  {
    var InserisciUt = ('/api/Dj-Login/login');
    return this.http.post//il return và messo se sposto la subscribe nel component!!!
    (
      InserisciUt,
      {
        'emailUt': EmailUtente,
        'passwordUt': PasswordUtente
      },
    ) .pipe();/*.subscribe
    (
      res => 
      {
        alert(res); 
      }, 
      err => 
      {
        console.log(err);
      }
    )   */
  }
//-----------------------------------------------------------------------------------------------------  
  
}
