# Specifikace studentského zápočtového projektu

## POŽADAVKY

### URČENÍ APLIKACE
- Aplikace bude sloužit koncovému uživateli.
- Administrátor není považován za koncového uživatele.

### UŽIVATELSKÝ OBSAH
- Koncový uživatel může v aplikaci spravovat uživatelský obsah (data).
- Profil uživatele není považován za uživatelský obsah.
- Správa uživatelského obsahu znamená minimálně možnost provádět CRUD operace.
- Alespoň jeden atribut uživatelského obsahu bude typu obrázek.
- Budou existovat alespoň dva typy uživatelského obsahu (např. nabídka – poptávka, kniha – výpůjčka, vozidlo – jízda).

### PŘÍSTUP K UŽIVATELSKÉMU OBSAHU
- CRUD operace bude možné vykonávat po jednotlivých položkách.
- Mazání, částečné zobrazení a částečná editace bude možná i hromadně.
- Uživatelský obsah lze spravovat pouze po autentizaci a autorizaci (vhodná role, vlastnický vztah).

### ZOBRAZENÍ UŽIVATELSKÉHO OBSAHU
- Obsah bude možné zobrazit po jednotlivých položkách.
- Obsah bude možné zobrazit i v celku po dávkách (stránkovaně).
- Uživatel bude moci obsah prohledávat a filtrovat.
- Aplikace bude zobrazovat souhrnné údaje (dashboard), např. celkový počet položek, nejnovější položky, položky s příznakem atd.
- GUI bude obsahovat oblast s podmíněným vykreslováním obsahu (např. navigace dle přihlášení, role).

### UKLÁDÁNÍ V PROHLÍŽEČI
- Aplikace bude využívat ukládání dat v prohlížeči (např. oblíbené položky, obsah košíku).

### INTERAKCE UŽIVATELŮ
- Uživatelé budou moci interagovat s uživatelským obsahem, např. příspěvek – komentář, inzerát – odpověď, termín zkoušky – zápis na termín.

---

## NÁVRH A IMPLEMENTACE APLIKACE

### ARCHITEKTURA
- Bude použit komponentový přístup.
- Bude implementována MVC architektura.
  - Prezentační vrstva nebude komunikovat přímo s datovou vrstvou.
  - Komunikace bude probíhat výhradně přes aplikační vrstvu (REST API).

### ZABEZPEČENÍ
- Aplikace bude zabezpečena na základní úrovni.
- Veškeré vstupy budou validovány na straně klienta před odesláním na server.

---

## DOKUMENTACE

- Dokumentace bude obsahovat:
  - Požadavky na aplikaci
  - Případy užití
  - Popis použitých endpointů

---

## ZDROJOVÝ KÓD

- Přehledný, logicky uspořádaný.
- Organizace do vhodných podsložek.
- Kód bude smysluplně a přehledně okomentovaný.

---

## OZNAČENÍ A LICENCE

- Webová aplikace bude v patičce označena jako **studentský zápočtový projekt**.
- Projekt bude originálním a výlučným dílem studenta.
- Nebude porušovat autorská práva.

---

## DESIGN A TECHNOLOGIE

- Stylování bude splňovat požadavky na responzivitu a uživatelskou přístupnost.
- Je povoleno použití:
  - Hotových systémů designu (např. Material Design)
  - CSS šablon
  - Frontendových frameworků (např. Bootstrap, React, Vue)
- Výrazně jiné technologie je třeba konzultovat.


## DALŠÍ POŽADAVKY
- Minimálně 4 modelové třídy
- Alespoň jednoduchý frontend
- Připojení na relační databázi s využitím ORM
- Využití jednotkových testů
- Přihlašování uživatelů