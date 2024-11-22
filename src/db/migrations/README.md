# Database Migrations

Questo folder contiene tutte le migrazioni del database.

## Migrazioni

- 001_create_tables.sql: Crea le tabelle iniziali per chat_histories e chat_messages 

----------------------------------------------------------------------

## Tabella chat_histories:

1. id (Primary Key)
Tipo: uuid
Non usare int8, usa uuid che è disponibile direttamente come tipo in Supabase
Valore default: gen_random_uuid()
Spunta "Is Primary Key"
1. user_id
Tipo: uuid
Foreign key che riferisce a auth.users
Non nullable
1. title
Tipo: text
Non nullable
Lunghezza illimitata
1. created_at
Tipo: timestamptz (timestamp with time zone)
Valore default: now()
1. updated_at
Tipo: timestamptz (timestamp with time zone)
Valore default: now()
updated_at
Tipo: timestamptz (timestamp with time zone)
Valore default: now()

--------------------------------------------
## Tabella chat_messages:

1. id (Primary Key)
Tipo: uuid
Valore default: gen_random_uuid()
Spunta "Is Primary Key"
2. chat_id
Tipo: uuid
Foreign key che riferisce a chat_histories.id
Non nullable
Aggiungi "Foreign Key Relation" a chat_histories(id)
Aggiungi "On Delete: Cascade"
3. content
Tipo: text
Non nullable
Lunghezza illimitata
4. type
Tipo: text
Non nullable
Aggiungi un vincolo check: check (type in ('user', 'ai'))
5. created_at
Tipo: timestamptz (timestamp with time zone)
Valore default: now()

---------

Note importanti:
* Per i campi timestamptz, quando crei la colonna in Supabase, seleziona semplicemente "timestamp with time zone" dal menu a tendina  
  
* Per il vincolo check sul campo type, puoi aggiungerlo nella sezione "Policies" dopo aver creato la tabella

* Per le foreign key, assicurati di impostare correttamente le relazioni usando l'interfaccia di Supabase nella sezione "Foreign Keys"

* Tutti i campi marcati come "Non nullable" devono avere la casella "Is Nullable" deselezionata nell'interfaccia di Supabase

Questo schema garantisce:
*  Identificatori univoci per chat e messaggi (UUID)
*  Corretta associazione tra utenti e le loro chat
*  Corretta associazione tra chat e i relativi messaggi
*  Tracciamento temporale accurato
*  Distinzione tra messaggi utente e risposte A