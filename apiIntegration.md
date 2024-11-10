# MISTRAL API INTEGRATION

Per integrare le API di Mistral nella tua applicazione, puoi continuare a utilizzare TypeScript, dato che il tuo progetto è già impostato in questo modo. Ecco i passaggi che ti consiglio di seguire per implementare correttamente le API di Mistral:


### 1. Installazione delle dipendenze

`npm install @mistralai/mistralai`


### 2. Creazione di un file per gestire le API

Crea un nuovo file per gestire le chiamate alle API di Mistral. Puoi chiamarlo `mistralApi.ts` e posizionarlo nella cartella `src/lib` o `src/app/api` a seconda della tua struttura preferita.

```ts
import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey: apiKey });

export const getChatResponse = async (userMessage: string) => {
  const chatResponse = await client.chat.complete({
    model: 'mistral-large-latest',
    messages: [{ role: 'user', content: userMessage }],
  });

  return chatResponse.choices[0].message.content;
};
```

### 3. Utilizzo dell'API nel componente della chat

Ora puoi utilizzare la funzione `getChatResponse` nel tuo componente della chat. Modifica il file `src/app/components/src-components-app-page.tsx` per includere la chiamata all'API quando un messaggio viene inviato.

```ts
import { getChatResponse } from '@/lib/mistralApi';

// ...

const handleSendMessage = async (): void => {
  if (!message.trim()) return; 
  const newMessage: ChatMessage = {
    id: Date.now().toString(),
    content: message,
    type: 'user',
  };
  setChatMessages([...chatMessages, newMessage]);
  setMessage(""); 

  // Chiamata all'API di Mistral
  const aiResponse = await getChatResponse(message);
  const aiMessage: ChatMessage = {
    id: Date.now().toString(),
    content: aiResponse,
    type: 'ai',
  };
  setChatMessages(prevMessages => [...prevMessages, aiMessage]);
};
```

### 4. Configurazione delle variabili d'ambiente

Assicurati di avere la chiave API di Mistral configurata nel tuo ambiente. Puoi farlo creando un file `.env.local` nella radice del tuo progetto e aggiungendo la seguente riga:

`MISTRAL_API_KEY=la_tua_chiave_api`

### 5. Test dell'integrazione

Avvia il tuo server di sviluppo e prova a inviare un messaggio nella chat. Dovresti vedere la risposta dell'IA generata da Mistral.