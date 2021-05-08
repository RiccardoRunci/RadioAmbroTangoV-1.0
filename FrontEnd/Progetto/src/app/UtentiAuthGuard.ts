import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoginService } from './login/login.service'

@Injectable
({
  providedIn: 'root'
})

export class UtentiAuthGuard implements CanActivate 
{

  private isLoggedIn:boolean;
  
  constructor(private auth: LoginService)
  {
    this.isLoggedIn=false;
  }
  
  public getLoggedId()
  {
    return this.isLoggedIn;
  }
  public setIsLoggedIn(value:boolean)
  {
    this.auth.isLoggedIn=value;
    console.log("Adesso l'autorizzazione per entrare nel component è: "+this.auth.isLoggedIn);
  }

    canActivate (route: ActivatedRouteSnapshot,state: RouterStateSnapshot)
    {
     return this.auth.isLoggedIn;
    }
}

