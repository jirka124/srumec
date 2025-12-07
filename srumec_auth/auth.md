# Šrumec - Auth Microservice 🔑

Tato mikroslužba se stará o registraci, přihlášení a správu uživatelů pro aplikaci **Šrumec**. Je postavena na frameworku **FastAPI** a běží v **Dockeru** společně s **PostgreSQL** databází.


## Testovací profily


```
{
    "email": "admin@srumec.com",
    "name": "Super Admin",                        HESLO: srumecpass
    "id": "8b2a9bbd-c9b7-4edd-96bd-8b823d28f60b",
    "role": "admin",
    "banned": false,
    "created_at": "2025-12-06T21:13:10.594130Z"
  },
  {
    "email": "jdostal@srumec.com",
    "name": "Jiří Dostál",                        HESLO: srumec
    "id": "0ec2aa38-7899-4b31-bb0d-624764fcbb38",
    "role": "user",
    "banned": false,
    "created_at": "2025-12-06T21:13:10.875216Z"
  },
  {
    "email": "jzak@srumec.com",
    "name": "Jiří Žák",                           HESLO: srumec
    "id": "8778cd23-c681-4ce5-9057-82d439753753",
    "role": "user",
    "banned": false,
    "created_at": "2025-12-06T21:13:11.131519Z"
  }
```

**2. Vytvoření konfiguračního souboru `.env`** Zkopírujte soubor `.env.example` (pokud ho máte) nebo vytvořte nový soubor s názvem `.env` v kořenovém adresáři projektu a vložte do něj následující obsah.

Ini, TOML

```
# .env

# Připojení k databázi běžící v Dockeru. 'db' je název služby z docker-compose.yml.
DATABASE_URL="postgresql://postgres:password@db:5432/srumec_auth"

# Tento tajný klíč musí být dlouhý, náhodný a bezpečně uložený.
# Slouží k podepisování JWT tokenů.
JWT_SECRET_KEY="tajny_nahodny_retezec_pro_jwt_ktery_je_velmi_dlouhy_a_bezpecny"
```

**3. Spuštění pomocí Docker Compose** Spusťte jediný příkaz, který vše sestaví a spustí na pozadí:

Bash

```
docker compose up --build -d
```

- `--build`: Sestaví Docker image pro API.
    
- `-d`: Spustí kontejnery na pozadí (detached mode).
    

Po chvíli bude vaše služba běžet na adrese `http://localhost:8000`.

---

## Jak Používat Službu (Swagger UI)

FastAPI pro nás automaticky generuje interaktivní API dokumentaci. To je nejlepší způsob, jak službu testovat.

**Otevřete v prohlížeči: [http://localhost:8000/docs](https://www.google.com/search?q=http://localhost:8000/docs)**

Uvidíte **Swagger UI**, kde jsou přehledně vypsané všechny dostupné endpointy.

### Testování registrace a přihlášení:

1. **Registrace nového uživatele:**
    
    - Rozklikněte endpoint `POST /register`.
        
    - Klikněte na tlačítko **"Try it out"**.
        
    - Do pole `Request body` vložte JSON s vaším emailem a heslem:
        
        JSON
        
        ```
        {
          "email": "test@uzivatel.cz",
          "password": "mojeSuperHeslo123"
        }
        ```
        
    - Klikněte na **"Execute"**. Měli byste dostat odpověď `201 Created` s daty o novém uživateli.
        
2. **Přihlášení uživatele:**
    
    - Rozklikněte endpoint `POST /login`.
        
    - Klikněte na **"Try it out"**.
        
    - Vložte stejné přihlašovací údaje, se kterými jste se registrovali.
        
    - Klikněte na **"Execute"**. Měli byste dostat odpověď `200 OK` obsahující váš `access_token`.
        

---

## Princip Fungování a Architektura

### Autentizace a JWT Tokeny

Tato služba používá **JWT (JSON Web Tokens)** pro bezstavovou (stateless) autentizaci.

**Zjednodušeně:** Představte si JWT jako digitální vstupenku. Když se správně přihlásíte (`/login`), naše `Auth Service` (pokladna) vám vystaví tuto vstupenku (token). Vstupenka obsahuje informaci o tom, kdo jste (`sub`) a do kdy platí (`exp`). Celá je digitálně podepsaná tajným klíčem.

Když pak chcete přistoupit k chráněnému zdroji (např. vytvořit událost), prokážete se touto vstupenkou. **API Gateway** (ochranka u brány) zkontroluje podpis a platnost, aniž by se musela ptát pokladny. Pokud je vše v pořádku, pustí vás dál.

#### Důležitost `JWT_SECRET_KEY`

> **Klíč `JWT_SECRET_KEY` definovaný v `.env` souboru je naprosto kritický.** `Auth Service` ho používá k **podepsání** (vytvoření) tokenu. Budoucí **API Gateway** musí používat **ten samý tajný klíč** k **ověření** podpisu. Pokud se tyto klíče neshodují, ověření selže a uživatel nebude autorizován.

### Struktura Projektu

- `/app/api/`: Definuje API endpointy (routy).
    
- `/app/services/`: Obsahuje byznys logiku (vytváření uživatelů, hashování hesel, generování tokenů).
    
- `/app/schemas/`: Pydantic schémata, která definují datové struktury pro API (vstup/výstup).
    
- `/app/models/`: SQLAlchemy modely, které definují strukturu databázových tabulek.
    
- `/app/db/`: Nastavení připojení k databázi.
    
- `/app/core/`: Globální konfigurace.
    
- `/alembic/`: Databázové migrace.
    

## Užitečné Příkazy

Bash

```
# Spustí všechny služby na pozadí
docker compose up -d

# Zastaví a odstraní všechny kontejnery
docker compose down

# Zobrazí logy běžících kontejnerů (např. pro api)
docker compose logs -f api

# Spustí příkaz uvnitř běžícího kontejneru (např. bash)
docker compose exec api bash
```
