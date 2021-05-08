import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule,ComponenteRouting } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms'; //databinding a due vie
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'; //HTTP_INTERCEPTORS per i token
import { AdminComponent } from './admin/admin.component';
import { DjComponentComponent } from './dj-component/dj-component.component';
import { UtenteComponent } from './utente/utente.component';
import {YouTubePlayerModule} from '@angular/youtube-player';
//import {/*InterceptorDj,*/ InterceptorUtente/*, InterceptorAdmin*/} from './token-interceptor-service.service' //Per HTTP_INTERCEPTORS per i token (Admin,dj e utente normale).


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ComponenteRouting,
    DjComponentComponent,
    UtenteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, //databinding a 2 vie.
    HttpClientModule, //per usare i service e fare le chiamate a node.
    ReactiveFormsModule, //PER FARE I CONTROLLI PER VEDERE SE è SCRITTA BENE L'EMAIL.
    YouTubePlayerModule 
  ],
  providers: [
  /* { 
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorUtente, //classe dell'interceptor dell'utente normale.
      multi:true
    }, */
   /* { 
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorDj, //classe dell'interceptor dell'utente dj.
      multi:true
    },
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorAdmin, //classe dell'interceptor dell'utente admin.
      multi:true
    }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
