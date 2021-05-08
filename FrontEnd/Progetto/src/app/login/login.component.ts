import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { UtentiAuthGuard } from '../UtentiAuthGuard';

@Component
({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit 
{
  registerForm!: FormGroup;
  submitted = false;
  ProntoPerInviare=false;
  
  constructor(private formBuilder: FormBuilder,
              private service: LoginService,
              private router:Router,
              private Auth: UtentiAuthGuard) 
  {
    
  }
//--------------------------------------------------------------------------------
  ngOnInit(): void 
  {
      this.registerForm = this.formBuilder.group
      ({
      email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
      });
  }
//--------------------------------------------------------------------------------
  get f() { return this.registerForm.controls; }
//--------------------------------------------------------------------------------
  onSubmit() 
  {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) 
    {
      this.ProntoPerInviare=false;  
       return;
    }
    else
    {
      this.ProntoPerInviare=true;
    }
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value))
  }
//--------------------------------------------------------------------------------
  Login(Email:string,Password:string)
  {
    
    this.onSubmit();
    if(this.ProntoPerInviare===true)
    {
      if(Email.length<=0 || Password.length<=0 || Password.length<=5)
      {
        alert("Inserisci Email e Password!");
      }
      else
      {
        Email=Email.toLowerCase();
        Password=Password.toLowerCase();
        this.service.LoginPassword(Email,Password).subscribe
        (
          res => 
          {
            console.log("RES:\n"+res);
            if(res==='Utente NON TROVATO!!')
            {
             alert(res);
            }
            else if(res==="Password Errata!!!!")
            {
              alert(res);
            }
            else 
            {
              //salvo il token sul browser!
              localStorage.setItem('tokenLogin',res.toString()); //per vederlo: F12->Application
              this.getJwtToken();
              this.Auth.setIsLoggedIn(true); //metto true per far funzionare il metodo CanActivate dell'auth utente
              console.log("SEI CONNESSO!!!!!!!!!!!!");
              this.router.navigate(['Utenti']) //cambio la pagina e vado al component Utenti
            }
            
            
          }, 
          err => 
          {
            alert(err);
          }
        )  ;
      }
    }
    else
    {
      alert("Ci sono degli errori nella form!!\nControlla bene Email e Password!!");
    }
  }
//--------------------------------------------------------------------------------
  Registrati(Email:string,Password:string)
  {
    this.onSubmit();
    if(this.ProntoPerInviare===true)
    {
      if(Email.length<=0 || Password.length<=0 || Password.length<=5)
      {
        alert("Inserisci Email e Password!");
      }
      else
      {
        Email=Email.toLowerCase();
        Password=Password.toLowerCase();
        this.service.Registra(Email,Password);
      }
    }
    else
    {
      alert("Ci sono degli errori nella form!!\nControlla bene Email e Password!!");
    }
  }
//--------------------------------------------------------------------------------
getJwtToken()
{
  console.log("Token salvato:\n"+localStorage.getItem('tokenLogin'));
  return localStorage.getItem('tokenLogin');
}

/*removeToken() //è il logout, cancella il token.
{
  console.log("Cancello il token: tokenLogin");
  return localStorage.removeItem('tokenLogin');
}*/
//--------------------------------------------------------------------------------
}
