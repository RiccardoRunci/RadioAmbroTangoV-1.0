import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { DjComponentService } from './dj-component.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Episodi } from './Episodi';
import { Observable } from 'rxjs/internal/Observable';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';



@Component({
  selector: 'app-dj-component',
  templateUrl: './dj-component.component.html',
  styleUrls: ['./dj-component.component.css']
})


export class DjComponentComponent
{ 
  
  private blobFinale:any;
  private base64data="";

  public setbase64data(base64:string)
  {
    this.base64data=base64;
  }
  public getbase64data()
  {
    return this.base64data;
  }

  public getBlobFinale(){return this.blobFinale;}
  public setBlobFinale(blob:any){this.blobFinale=blob; this.ProntoPerInviareBlob=true;}
  private record:any;  //Lets initiate Record OBJ
  private recording = false; //Will use this flag for detect recording
  public getRecording() {return this.recording;}
  public getUrl() {return this.url;}
  private url: string;  //Url of Blob
  private error: string;
  //----------------------------------------
  public FormCanzoni: FormGroup;
  EpisodioSelezionato:string;
  ProntoPerInviare=false;
  ProntoPerInviareBlob=false; 
  ArrayEpisodi: Episodi[] = [];
  ngOnInit(): void { this.elencoEpisodi();} 
//------------------------------------------------------------------------------------------------------------------------------------
  constructor(fb:FormBuilder,private service: DjComponentService,private domSanitizer: DomSanitizer,private router: Router) 
  { 
    const reg = "(https?://)?(www\\.)?(yotu\\.be/|youtube\\.com/)?((.+/)?(watch(\\?v=|.+&v=))?(v=)?)([\\w_-]{11})(&.+)?";
    this.FormCanzoni= fb.group
    ({
      LinkYouTube:  ["",[Validators.required, Validators.pattern(reg)]],
    });
    this.EpisodioSelezionato="";
    this.url="";
    this.error="";
  }
//Metodi per far funzionare i messaggi del formGroup:---------------------------------------------------------------------------------
  get f() { return this.FormCanzoni.controls; }
//------------------------------------------------------------------------------------------------------------------------------------
  elencoEpisodi()
  {
    this.service.ElencoEpisodi()
    .subscribe(data => this.ArrayEpisodi = data);
  }
//------------------------------------------------------------------------------------------------------------------------------------
selectChangeHandler (event: any) //metodo per far funzionare la selezione degli elementi dentro la select (componente html)
{
  //this.flagHtmlEpisodi=true;
  //update the ui
  this.EpisodioSelezionato = event.target.value;
}
//------------------------------------------------------------------------------------------------------------------------------------
insersiciEpisodio(NomeEpisodio:string)
{
  if (NomeEpisodio==="" || NomeEpisodio==="Seleziona Episodio")
  {
    alert("Devi dare un nome all'episodio!!!");
  }
  else
  {
    NomeEpisodio=NomeEpisodio.toLowerCase();
    this.service.InserisciEpisodio(NomeEpisodio).subscribe
    (
      res => 
      {
        console.log(res);
        if (res==="Episodio già presente!")
        {
          alert("Episodio Già Presente!");
          this.elencoEpisodi();
        }
        else if(res==="Episodio inserito!")
        {
          alert("Episodio inserito!");
          this.elencoEpisodi();
        }
      }, 
      err => 
      {
        alert("Errore nell'inserimento dell'episodio: \n"+err);
      }
    );
  }
}
//------------------------------------------------------------------------------------------------------------------------------------
eliminaEpisodio(NomeEpisodio:string)
{
  if (NomeEpisodio==="" || NomeEpisodio==="Seleziona Episodio")
  {
    alert("Devi scegliere un episodio dal menu a tendina!!!");
  }
  else
  {
  this.service.EliminaEpisodio(NomeEpisodio)
  .subscribe(res => 
    {
      console.log(res);
      if (res==="Episodio eliminato!")
      {
        alert("Episodio eliminato!");
        this.elencoEpisodi();
        this.EpisodioSelezionato="";
      }
      else if(res==="Non posso eliminare quell'episodio perchè ha delle canzoni.")
      {
        alert(res);
        this.elencoEpisodi();
      }
      else if(res==="Episodio non presente, Non posso eliminarlo!")
      {
        alert(res);
        this.elencoEpisodi();
        this.EpisodioSelezionato="";
      }
    }, 
    err => 
    {
      console.log(err);
      alert("Errore nell'eliminazione dell'episodio: \n"+err);
    });
    //this.selectChangeHandler(null); //così levo nell'html il residuo di ""
    //this.flagHtmlEpisodi==false;
  }
}
//------------------------------------------------------------------------------------------------------------------------------------
insersiciCanzone(LinkCanzone:string)
{ 
  this.onSubmit();
  if(this.ProntoPerInviare===true)
  {
    //console.log("Canzone arrivata: "+LinkCanzone);
    if(LinkCanzone!="")
    {
      var YouTubeVideo_id = LinkCanzone.split('v=')[1].split('&')[0]; //estraggo l'id dal video di youtube!!
      //alert ("Link di youtube: "+ YouTubeVideo_id);
      //INSERIRE QUI LA PARTE PER SPEDIRLO AL DB!!!---------------------------------------------------------------
      this.service.insersiciCanzone(this.getbase64data(),YouTubeVideo_id,this.EpisodioSelezionato).subscribe
      (                           //this.getBlobFinale(),
        res => 
        {
          console.log(res);
          if (res==="Purtroppo non puoi inserire la stessa canzone \n(lo stesso link youtube) più di una volta! \n anche in episodi differenti!")
          {
            alert(res);
            this.elencoEpisodi();
          }
          else if(res==="Canzone inserita!")
          {
            alert(res);
            this.elencoEpisodi();
          }
          else if(res==="Episodio NON valido. Non Presente in tab_episodi!")
          {
            alert(res);
            this.elencoEpisodi();
          }
        }, 
        err => 
        {
          alert("Errore nell'inserimento della canzone: \n"+err);
        }
      );
      //----------------------------------------------------------------------------------------------------------
    } 
    else
    {
      alert("Devi inserire il link di una canzone");
    }
  }
  else
  {
    alert("Attenzione!\nCi sono degli errori sulla Canzone o sull'Epiosiodio o sul Vocale!!!");
  }
}
//------------------------------------------------------------------------------------------------------------------------------------
onSubmit() 
{
  // stop here if form is invalid 
  if (this.FormCanzoni.invalid || this.EpisodioSelezionato==="" || this.EpisodioSelezionato==="Seleziona Episodio" ||this.ProntoPerInviareBlob===false) 
  {
    this.ProntoPerInviare=false;  
    return;
  }
  else
  {
    this.ProntoPerInviare=true;  
  }
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------     
sanitize(url:string)
{
    return this.domSanitizer.bypassSecurityTrustUrl(url);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------     
/**Start recording.*/
initiateRecording() 
{
    this.recording = true;
    let mediaConstraints = {
        video: false,
        audio: true
    };
    navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then(this.successCallback.bind(this), this.errorCallback.bind(this));
       
        setTimeout(()=> //SETTO UN TIMEOUT PER NON FARE LE REGISTRAZIONI TROPPO LUNGHE.
        {
          if(this.recording === true) //significa che ancora non ho premuto io "stop record"
          this.stopRecording();
        }, 7000);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------     
/**Will be called automatically.*/
successCallback(stream: any) 
{
    var options = {
        mimeType: "audio/wav",
        numberOfAudioChannels: 1,
        //sampleRate: 16000,
    };
    //Start Actuall Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------     
/**Stop recording.*/
stopRecording() 
{
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------     
/**Process Error.*/
errorCallback(error: any) 
{
    this.error = 'Can not play audio in your browser';
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------     
clearAudioRecordedData() //metodio per cancellare la url di riferimento all'oggetto rtc (leva anche l'audio dal html)
{
 this.url="";
 this.ProntoPerInviareBlob=false;
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------         
 /*** processRecording Do what ever you want with blob
  *      * @param  {any} blob Blog*/
processRecording(blob: any) 
{
  
    this.url = URL.createObjectURL(blob);
   
    this.setBlobFinale(blob);
     console.log("BLOB?? "+blob); //stampa [object Blob]
      console.log("this.getBlobFinale().size? "+this.getBlobFinale().size); //2 secondi di audio = 147500 byte
      console.log("this.getBlobFinale().type? "+this.getBlobFinale().type); //stampa: audio/wav
      console.log("Url: "+this.getUrl()); //stampa: blob:http://localhost:4200/e4f9207b-9e07-44a5-b928-28d7ebbd100d

      
      this.BlobToBase64(this.getBlobFinale()).subscribe(base64 =>
        { 
          //console.log(base64+"\n")
          //console.log(typeof(base64)+"\n");
          //console.log(base64.length); //lunghezza della stringa
          this.setbase64data(base64);
          //console.log(this.getbase64data().length); //lunghezza della stringa
        });
      //console.log("All'incontrario:\n")
      //this.Base64ToBlob(this.base64data,"audio/wav",512);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------
DownloadFile(Bloob: any, filename: string): any 
{
 const blob = Bloob;
 const url = window.URL.createObjectURL(blob);
 console.log("DownloadFile_DIMENSIONI DEL BLOB: "+blob.size);
 console.log("DownloadFile_TIPO MIME DEL BLOB: "+blob.type);

 const anchor = document.createElement('a');
 anchor.download = filename;
 anchor.href = url;
 console.log("Questo???"+anchor.href);
 document.body.appendChild(anchor);
 anchor.click();
 document.body.removeChild(anchor);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------
private Base64ToBlob(b64Data:any, contentType :string, sliceSize :number): Blob
    {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize)
        {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++)
            {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
//-------------------------------------------------------------------------------------------------------------------------------------------------------
BlobToBase64(blob:any): Observable<string> 
{
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return fromEvent(reader, 'load')
    .pipe(map(() => (reader.result as string).split(',')[1]));
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------
LogOut()
{
  localStorage.removeItem('tokenLoginDj');
  this.router.navigate(['LoginUtente']); //per cambiare pagina, guarda il costruttore, importa router.
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------
}//fine classe


