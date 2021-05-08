CREATE DATABASE IF NOT EXISTS dbprova;
SHOW DATABASES;
USE dbprova;

drop table tab_utenti;
CREATE TABLE tab_utenti (
IdUtente INT NOT NULL AUTO_INCREMENT,
NomeUtente VARCHAR(70) NOT NULL UNIQUE,
EmailUtente VARCHAR(70) NOT NULL,
PRIMARY KEY (IdUtente)
);
Describe  tab_utenti;

/*creo l'utente utenterootdbprova che vede solo il db dbprova con password:password*/
create user 'utenterootdbprova'@'localhost' identified by 'password';
/*dò tutti i privilegi all'utente utenterootdbprova sul db dbprova*/
grant all on dbprova.* to 'utenterootdbprova'@'localhost';

/*dò questo comando qui perchè viene fuori l'errore ER_NOT_SUPPORTED_AUTH_MODE*/
ALTER USER 'utenterootdbprova'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

drop table tab_credenziali;
CREATE TABLE tab_credenziali (
IdUtente INT NOT NULL AUTO_INCREMENT,
NomeUtente VARCHAR(40) NOT NULL UNIQUE,
PasswordUtente VARCHAR(120) NOT NULL,
PRIMARY KEY (IdUtente)
);
describe tab_credenziali;

insert into tab_credenziali (NomeUtente,PasswordUtente) values("MARCELLO","MARCELLO");
UPDATE tab_credenziali SET NomeUtente = 'Marco' WHERE IdUtente = 1;
UPDATE tab_credenziali SET PasswordUtente = 'Marco' WHERE IdUtente = 1;
select count(NomeUtente) as NumUtentiConQuelUserName from tab_credenziali where NomeUtente="Marco";
/*Altri esempi di query*/
ALTER TABLE tab_credenziali CHANGE COLUMN PasswordUtente PasswordUtente varchar(250) NOT NULL;
delete from tab_credenziali where IdUtente>3;

CREATE TABLE tabutenti (
IdUtente INT NOT NULL AUTO_INCREMENT,
EmailUtente VARCHAR(40) NOT NULL UNIQUE,
PasswordUtente VARCHAR(140) NOT NULL,
PRIMARY KEY (IdUtente)
);

CREATE TABLE tabadmin (
IdAdmin INT NOT NULL AUTO_INCREMENT,
EmailAdmin VARCHAR(40) NOT NULL UNIQUE,
PasswordAdmin VARCHAR(140) NOT NULL,
PRIMARY KEY (IdAdmin)
);

drop table tab_canzoni;
USE dbprova;
CREATE TABLE tab_canzoni (
IdCanzone INT NOT NULL AUTO_INCREMENT,
Vocale longtext NOT NULL,
LinkYouTube VARCHAR(70) NOT NULL unique,
Episodio_ID int,
PRIMARY KEY (IdCanzone),
CONSTRAINT FK_EpisodioID FOREIGN KEY (Episodio_ID) REFERENCES tab_episodi (IdEpisodio)
);
describe tab_canzoni;

/*Prima creo tab_episodi, poi tab_canzoni.
Posso cancellare un record di tab_episodi se non ha nessuna occorrenza in tab_canzoni.*/
CREATE TABLE tab_episodi (
IdEpisodio INT NOT NULL AUTO_INCREMENT,
NomeEpisodio VARCHAR(40) NOT NULL unique,
PRIMARY KEY (IdEpisodio)
);
describe tab_episodi;

SELECT COUNT(NomeEpisodio)as Contatore FROM tab_episodi;
select * from tab_episodi;
select * from tab_canzoni;
insert into tab_episodi(NomeEpisodio) values("Primo");
insert into tab_canzoni(Vocale,LinkYouTube,Episodio_ID) values("blablabla","Link https ecc...",14);
drop table tab_episodi;
Delete from tab_episodi where NomeEpisodio="Primo Episodio";

CREATE TABLE tabdj (
IdDj INT NOT NULL AUTO_INCREMENT,
EmailDj VARCHAR(50) NOT NULL,
PasswordDj VARCHAR(140) NOT NULL,
PRIMARY KEY (IdDJ)
);
describe tabdj;

use dbprova;
describe tab_episodi;
describe tab_canzoni;

SELECT COUNT(tab_canzoni.LinkYouTube) as "Contatore" FROM tab_canzoni, tab_episodi WHERE tab_episodi.IdEpisodio = tab_canzoni.Episodio_ID;
SELECT * FROM tab_episodi;
SELECT * FROM tab_canzoni;
delete from tab_canzoni where IdCanzone=7;
SELECT COUNT(tab_canzoni.Episodio_Id) as "Contatore" FROM tab_canzoni, tab_episodi WHERE tab_episodi.NomeEpisodio="episodio 3" and tab_episodi.IdEpisodio = tab_canzoni.Episodio_ID;

/*PER VERIFICARE CHE NON VADA IN CRASH NODE (PER VIA DELL'INTEGRITA' REFERENZIALE) VEDO SE
  PRIMA DI ELIMIARE UN EPISODIO DA tab_episodi ABBIA (QUEL NomeEpisodio) OCCORRENZE IN tab_canzoni.
  Quindi le conto con:*/
/*Conta quante occorrenze trova in tab_canzoni di un determinato NomeEpisodio*/
SELECT COUNT(tab_canzoni.Episodio_Id) as "Contatore" FROM tab_canzoni, tab_episodi WHERE tab_episodi.NomeEpisodio="Primo Episodio" and tab_episodi.IdEpisodio = tab_canzoni.Episodio_ID;

/* CANCELLA DA tab_canzoni i record che hanno il NomeEpisodio = a quello che gli passo*/
DELETE FROM tab_canzoni WHERE tab_canzoni.Episodio_Id = (SELECT IdEpisodio FROM tab_episodi WHERE NomeEpisodio="Primo Episodio");

select * from tabadmin;
select * from tabdj;
select * from tabutenti;

