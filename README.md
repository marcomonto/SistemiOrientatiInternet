//TODO TO FINISH

Progetto SOI Montorsi
Per avviare il progetto, esegui il seguente comando nel terminale:

docker-compose up --build

Accedi all'applicazione tramite:

Indirizzo: http://montorsi.soi2223.unipr.it:8080/
**Username**: marcomonto
**Password**: password
Indirizzo del Database:

Indirizzo: http://localhost:8085/_/
**Username**: prova@mail.com
**Password**: provaprova

### Panoramica Tecnica
Dopo aver effettuato l'accesso con un token JWT, gli utenti possono accedere alla dashboard in tempo reale. Questa dashboard si collega al server tramite WebSocket utilizzando un token di autenticazione e rende dinamicamente i componenti utilizzando RxJS.

In caso di errori del servizio, c'è la possibilità di riconnessione manuale, anche se avviene automaticamente ogni 30 secondi.

//TODO
Spiegazioni sulle Funzionalità
Calcolo della Temperatura
Spiega il processo o i dettagli del calcolo della temperatura.

//TODO
Integrazione con Pocketbase
Fornisci dettagli sull'integrazione con Pocketbase.

Aggiunta di Sensori (Porte/Finestre)
Per aggiungere dinamicamente un servizio Porta o Finestra:

Assicurati che sia stato aggiunto tramite CLI con Docker.
Compila il modulo nel dialogo inserendo l'indirizzo nel formato ws://<indirizzoIP>:<porta>
La sezione storico consente agli utenti di visualizzare i dati salvati nel database tramite le API di Pocketbase.

### Documentazione Esterna
Per ulteriori informazioni, esplora la Documentazione di Pocketbase.