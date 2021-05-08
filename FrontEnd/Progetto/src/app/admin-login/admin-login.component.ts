import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthGuard } from '../AdminAuthGuard';
import { AdminLoginService } from './admin-login.service';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit 
{
  registerForm!: FormGroup; //variabile del form controll
  submitted = false; //variabile del form controll
  ProntoPerInviare=false; //variabile del form controll
  
  constructor
  (
    private formBuilder: FormBuilder,
    private service: AdminLoginService,
    private router:Router,
    private Auth: AdminAuthGuard
  ) 
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
          
           if(res==="Password Errata!")
           {
             alert(res);
           }
           else if(res==="UTENTE NON TROVATO!!")
           {
            alert(res);
           }
           else
           {
            localStorage.setItem('tokenLoginAdmin',res.toString()); //per vederlo: F12->Application
            //salvo il token sul browser!
            console.log("ANGULAR ADMIN TOKEN:\n"+localStorage.getItem('tokenLoginAdmin'));
            this.Auth.setIsLoggedIn(true); //metto true per far funzionare il metodo CanActivate dell'auth administrator
            console.log("SEI CONNESSO!!!!!!!!!!!!");
            this.router.navigate(['Admin']) //cambio la pagina e vado al component Admin!
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
}
