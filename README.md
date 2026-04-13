# ReceptMester

Ez egy webes receptgyűjtemény, amit a Web Programozás I gyakorlat beadandójához csináltunk. Az alapötlet az volt, hogy legyen egy hely, ahol az ember könnyedén böngészhet recepteket, kereshet közöttük, és ha akar, regisztrálhat is, hogy saját recepteket adjon hozzá.

## Funkciók

- Recept böngészés kategóriák szerint (Levesek, Főételek, Desszertek, Saláták, Reggelik)
- Keresés recept neve vagy leírás alapján
- Szűrés kategória szerint
- Felhasználói fiók létrehozása és bejelentkezés
- Saját receptek hozzáadása (cím, leírás, kép, kategória)
- Hozzávalók és főzési lépések rögzítése
- Képfeltöltés receptekhez
- Reszponzív design - telefonon is jól néz ki

## Technológia

A frontend Bootstrap 5-re épül, a backend PHP-ban van írva, és MySQL adatbázist használ. A jelszavak bcrypt-tel vannak titkosítva. Az egész egyfajta single-page appként működik, tehát az oldal nem töltődik újra böngészés közben, hanem JavaScriptel váltja a tartalmat.

## Lokális futtatás

### Amit telepíteni kell

- **XAMPP** (https://www.apachefriends.org/) - tartalmaz Apache-ot és MySQL-t, ezek kellenek a működéshez

### Lépések

1. **Projekt mappája**: másold be a `Receptgyujtemeny_WebProg_Beadando` mappát a `C:\xampp\htdocs\` alá

2. **XAMPP elindítása**: nyisd meg a XAMPP Control Panel-t és indítsd el az Apache-ot és a MySQL-t

3. **Adatbázis beállítása**:
   - Böngészőben: http://localhost/phpmyadmin
   - Importáld a `database/receptgyűjtemény.sql` fájlt
   - Ez létrehozza az adatbázist, a táblákat, és néhány tesztadatot is

4. **Futtatás**: böngészőben nyisd meg: http://localhost/Receptgyujtemeny_WebProg_Beadando/

### Ha valami nem működik

- Ellenőrizd, hogy az Apache és MySQL zölden világít a XAMPP-ban
- A phpMyAdmin-ban nézd meg, hogy az `receptgyűjtemény` adatbázis létezik-e
- Az `api/db.php`-ban tudod módosítani az adatbázis kapcsolatot (alapból root, üres jelszó)

## Tesztfiókok

Az adatbázisban van néhány előre létrehozott felhasználó, mindegyik jelszava `password123`:

- kockas_pista (pista@lol.hu)
- suteskiraly69 (kiraly@chef.hu)
- tejfol_nindzsa (nindzsa@konyha.hu)
- rantotthus_isten (hus@mennyei.hu)

## Mappa struktúra

```
Receptgyujtemeny_WebProg_Beadando/
├── api/                 # PHP backend
│   ├── api.php          # API endpointok
│   └── db.php          # Adatbázis kapcsolat
├── assets/
│   ├── css/style.css   # Stílusok
│   └── js/             # JavaScript
│       ├── api.js      # API hívások
│       ├── auth.js     # Bejelentkezés
│       ├── router.js   # Oldalváltás
│       └── ui.js       # Felület
├── database/
│   └── receptgyűjtemény.sql  # SQL dump
├── uploads/            # Feltöltött képek
└── index.php           # Főoldal
```

## Adatbázisról

Az adatbázis 6 táblából áll:
- users - felhasználók
- categories - kategóriák (5 fajta)
- recipes - receptek
- ingredients - alapanyagok
- recipe_ingredients - hozzávalók mennyisége receptenként
- steps - főzési lépések

Az SQL fájl mindent tartalmaz, táblákat és az előre megírt recepteket is.

---

Bármi kérdés van, szívesen segítekünk. Jó főzést! :)