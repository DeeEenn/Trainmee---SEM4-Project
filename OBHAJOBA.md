# Základní pojmy, architektura a anotace v projektu

## Frontend vs Backend
- **Frontend** je část aplikace, se kterou uživatel přímo interaguje (např. webové stránky, mobilní aplikace). Zajišťuje vizuální prezentaci a uživatelské rozhraní.
- **Backend** je část aplikace, která běží na serveru, zpracovává data, logiku, autentizaci a poskytuje API pro frontend.

## Klient-server model
- **Klient** (např. webový prohlížeč) odesílá požadavky na **server**.
- **Server** požadavky zpracuje a vrací odpovědi (např. data ve formátu JSON).
- Tento model umožňuje oddělení prezentace (frontend) a logiky/dat (backend).

## HTTP metody
- **GET** – načtení dat ze serveru
- **POST** – odeslání nových dat na server
- **PUT** – aktualizace existujících dat
- **DELETE** – smazání dat

## Java EE (Jakarta EE)
- Platforma pro vývoj podnikových aplikací v Javě, obsahuje rozmanité API pro různé aplikace (servlety, EJB, JPA, atd.).

## JavaBeans
- Opakovaně použitelné komponenty v Javě, používané pro sestavování aplikací. Mají gettery, settery a bezparametrický konstruktor.

## EJB (Enterprise JavaBeans)
- Komponenty pro vytváření distribuovaných, transakčních aplikací v Javě.

## ORM (Object-Relational Mapping)
- Technika mapování objektů na databázové tabulky. V projektu používáme JPA/Hibernate.

## JNDI (Java Naming and Directory Interface)
- Rozhraní pro přístup k jmenným a adresářovým službám v Javě.

## JPA (Java Persistence API)
- API pro správu a přístup k relačním datům v aplikacích Java.

## Spring Framework
- Framework pro vývoj aplikací v Javě, podporuje IoC (Inversion of Control), DI (Dependency Injection), AOP (Aspect-Oriented Programming), transakce, MVC, integraci s dalšími technologiemi.

## Docker
- Nástroj pro automatizaci nasazení aplikací v kontejnerech. Umožňuje snadné škálování a přenositelnost aplikací.

## Aplikační servery (Tomcat, WildFly, ...)
- Prostředí pro nasazení a správu webových aplikací (např. Tomcat implementuje Java Servlet a JSP technologie).

## Servlet
- Třída v Java EE, která rozšiřuje možnosti serveru a zpracovává požadavky klientů, generuje dynamický obsah a vrací odpovědi.

## JSP (JavaServer Pages)
- Technologie pro vytváření dynamického obsahu ve webových stránkách s využitím Java kódu vloženého do HTML.

## JSTL (JSP Standard Tag Library)
- Knihovna značek pro běžné úlohy v JSP (iterace, podmínky, práce s XML).

## JDBC
- Vrstva mezi Java aplikací a databází, umožňuje nezávislý přístup k databázím pomocí SQL dotazů.
- **JDBC Driver**: Překládá Java volání do SQL pro konkrétní databázi.

## MVC (Model-View-Controller)
- Návrhový vzor pro strukturování aplikací:
  - **Model**: data, business logika, stav aplikace
  - **View**: vizuální prezentace dat
  - **Controller**: zpracovává uživatelské vstupy, aktualizuje model a view
- Výhody: oddělení zodpovědností, lepší udržovatelnost, možnost znovupoužití komponent

## Inversion of Control (IoC)
- Princip, kdy framework (např. Spring) řídí vytváření a správu objektů místo samotné aplikace.

## Dependency Injection (DI)
- Technika využívaná v IoC, která umožňuje injektovat (poskytnout) závislosti objektu zvenčí (konstruktor, setter, pole).
- Snižuje pevné vazby mezi komponentami, usnadňuje testování a údržbu.

## Bean
- **Bean** je objekt, který je spravovaný Spring kontejnerem. Každá třída označená anotací jako `@Component`, `@Service`, `@Repository`, `@Controller` nebo metoda s `@Bean` je bean.
- Spring vytváří, spravuje a injektuje beany podle potřeby.
- Výhoda: aplikace nemusí sama vytvářet instance, vše řídí Spring.

## Aspect-Oriented Programming (AOP)
- Odděluje opakující se logiku (např. logování, transakce) od hlavního kódu.

## REST
- Architektonický styl pro návrh síťových aplikací. Pracuje s HTTP metodami (GET, POST, PUT, DELETE), je bezstavový, odděluje klienta a server.

## Mikroslužby
- Architektura, kde je aplikace rozdělena na malé, nezávislé služby komunikující přes API.
- Výhody: modularita, škálovatelnost, odolnost.

## Testování
- **Jednotkové testy**: testují jednotlivé komponenty/třídy
- **Integrační testy**: ověřují spolupráci více komponent
- **Systémové testy**: testují celý systém
- **Akceptační testy**: ověřují splnění obchodních požadavků
- **JUnit**: framework pro jednotkové testování v Javě, používá anotace jako `@Test`, `@Before`, `@After`

---

## Nejčastější anotace v projektu a jejich význam

| Anotace                | Význam                                                                                   |
|------------------------|-----------------------------------------------------------------------------------------|
| `@RestController`      | Označuje třídu jako REST controller (zpracovává HTTP požadavky a vrací JSON odpovědi)   |
| `@Controller`          | Označuje třídu jako web controller (pro MVC, může vracet HTML stránky)                  |
| `@Service`             | Označuje třídu jako servisní vrstvu (business logika)                                   |
| `@Repository`          | Označuje třídu jako repozitář (přístup k databázi)                                      |
| `@Autowired`           | Spring automaticky vloží závislost (field/constructor injection)                        |
| `@Component`           | Obecná anotace pro bean spravovaný Springem                                              |
| `@Configuration`       | Označuje konfigurační třídu (definuje beany)                                            |
| `@Bean`                | Označuje metodu, která vrací bean spravovaný Springem                                   |
| `@RequestMapping`      | Mapuje HTTP požadavky na třídu nebo metodu                                              |
| `@GetMapping`          | Mapuje HTTP GET požadavek na metodu                                                     |
| `@PostMapping`         | Mapuje HTTP POST požadavek na metodu                                                    |
| `@PutMapping`          | Mapuje HTTP PUT požadavek na metodu                                                     |
| `@DeleteMapping`       | Mapuje HTTP DELETE požadavek na metodu                                                  |
| `@RequestBody`         | Označuje, že argument metody má být naplněn z těla HTTP požadavku (JSON)                |
| `@PathVariable`        | Označuje proměnnou z URL cesty                                                          |
| `@RequestParam`        | Označuje parametr z query stringu nebo formuláře                                        |
| `@Entity`              | Označuje třídu jako JPA entitu (mapuje na DB tabulku)                                   |
| `@Table`               | Definuje název tabulky v DB pro entitu                                                  |
| `@Id`                  | Označuje primární klíč v entitě                                                         |
| `@GeneratedValue`      | Označuje automaticky generovanou hodnotu (např. ID)                                     |
| `@Column`              | Definuje sloupec v DB tabulce                                                           |
| `@OneToMany`, `@ManyToOne`, `@ManyToMany`, `@OneToOne` | Definují vztahy mezi entitami v databázi                |
| `@Transactional`       | Označuje, že metoda/třída má běžet v rámci transakce                                    |
| `@Valid`               | Spouští validaci vstupních dat podle anotací (např. `@NotNull`, `@Email`)               |
| `@NotNull`, `@NotBlank`, `@Email` | Validace polí v DTO nebo entitách                                            |
| `@Slf4j`, `@Log4j2`    | Přidává logger do třídy                                                                 |
| `@Test`                | Označuje testovací metodu v JUnit                                                       |

---

## Co je to bean?
- **Bean** je objekt, který je spravovaný Spring kontejnerem.
- Každá třída označená anotací `@Component`, `@Service`, `@Repository`, `@Controller` nebo metoda s `@Bean` je bean.
- Spring vytváří, spravuje a injektuje beany podle potřeby.
- Výhoda: aplikace nemusí sama vytvářet instance, vše řídí Spring.

---

# Otázky a odpovědi pro obhajobu projektu

## 0. Základní koncepty

### Co je ORM a jak ho používáte v projektu?
- ORM (Object-Relational Mapping) je technika mapování objektů na databázové tabulky
- V projektu používáme Hibernate jako ORM framework
- Entity třídy jsou mapovány na databázové tabulky pomocí JPA anotací
- Příklady: `@Entity`, `@Table`, `@Column`, `@OneToMany`, `@ManyToOne`

### Co je CVM a jak ho používáte?
- CVM (Container-View-Model) je architektonický pattern
- V projektu používáme React komponenty jako View
- Container komponenty (`TrainerDashboard`, `TrainingList`) obsahují business logiku
- Presentational komponenty (`TrainerCard`, `ExerciseItem`) zobrazují data

### Kde a jak používáte dependency injection?
- Používáme `@Autowired` pro injekci závislostí v Spring komponentách
- Injekce se používá v:
  - Controllerech (`@RestController`)
  - Services (`@Service`)
  - Repositories (`@Repository`)
- Příklad: `@Autowired private UserService userService;`

### Co je Thymeleaf a proč ho nepoužíváte?
- Thymeleaf je template engine pro server-side rendering
- V projektu ho nepoužíváme, protože:
  - Máme SPA (Single Page Application) s Reactem
  - Frontend je oddělený od backendu
  - Komunikujeme přes REST API

### Co je to dependency injection?
- Dependency injection je design pattern pro předávání závislostí
- Spring kontejner automaticky vytváří a spravuje objekty
- Umožňuje volné propojení komponent
- Usnadňuje testování a údržbu kódu

## 1. Architektura a Design

### Proč jste zvolil právě tuto architekturu (MVC pattern)?
MVC (Model-View-Controller) pattern jsem zvolil, protože poskytuje jasné oddělení zodpovědností v aplikaci:
- Model: reprezentuje data a business logiku
- View: zobrazuje data uživateli (v našem případě React komponenty)
- Controller: zpracovává uživatelské požadavky

Toto rozdělení zajišťuje:
- Lepší udržovatelnost kódu
- Snadnější testování
- Jasnou strukturu projektu
- Oddělení business logiky od prezentace

### Proč jste zvolil Spring Boot pro backend a React pro frontend?
**Spring Boot:**
- Poskytuje hotovou konfiguraci a automatické nastavení
- Má vestavěnou podporu pro REST API
- Nabízí dependency injection
- Má širokou ekosystém knihoven
- Byl to požadavek zadání

**React:**
- Moderní komponentový framework
- Velká komunita a mnoho dostupných knihoven
- Efektivní virtuální DOM pro rychlé renderování
- Jednoduchá správa stavu aplikace
- Mám s ním předchozí zkušenosti

### Jak jste řešil komunikaci mezi frontendem a backendem?
- REST API s JSON formátem pro výměnu dat
- Axios knihovna pro HTTP požadavky na frontendu
- CORS konfigurace pro bezpečnou komunikaci mezi doménami
- JWT tokeny pro autentizaci požadavků
- Strukturované API endpointy pro jednotlivé funkcionality

## 2. Bezpečnost

### Jak funguje JWT autentizace ve vašem projektu?

**Odpověď:**
JWT (JSON Web Token) je bezpečný způsob, jak předávat informace o uživateli mezi klientem a serverem. Po přihlášení nebo registraci server vygeneruje token, který klient posílá v každém dalším požadavku. Server token ověří a podle něj pozná, kdo je uživatel a jaká má práva.

**Podrobný flow a ukázka kódu:**

1. **Registrace uživatele**
   - Uživatel odešle registrační formulář (jméno, email, heslo, role).
   - Backend zkontroluje, zda email už existuje.
   - Heslo se zašifruje pomocí `PasswordEncoder` (viz další otázka).
   - Uživatel se uloží do databáze.
   - Backend vytvoří JWT token a pošle ho klientovi.

```java
public Map<String, Object> register(RegisterRequest request) {
    if (userRepository.findByEmail(request.email).isPresent()) {
        throw new RuntimeException("Email already in use");
    }
    User user = new User();
    user.setName(request.name);
    user.setSurname(request.surname);
    user.setEmail(request.email);
    user.setPassword(passwordEncoder.encode(request.password)); // Šifrování hesla
    String role = (request.role != null) ? request.role.toUpperCase() : "USER";
    user.setRole(role);
    user = userRepository.save(user);

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.email, request.password)
    );
    String token = jwtTokenProvider.createToken(authentication); // Vytvoření JWT
    Map<String, Object> response = new HashMap<>();
    response.put("token", token);
    response.put("userId", user.getId());
    return response;
}
```

2. **Přihlášení uživatele**
   - Uživatel odešle email a heslo.
   - Backend ověří údaje (`authenticationManager.authenticate`).
   - Pokud jsou správné, vygeneruje nový JWT token a pošle ho klientovi.

```java
public Map<String, Object> login(LoginRequest request) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.email, request.password)
    );
    User user = userRepository.findByEmail(request.email)
        .orElseThrow(() -> new RuntimeException("User not found"));
    String token = jwtTokenProvider.createToken(authentication); // Vytvoření JWT
    Map<String, Object> response = new HashMap<>();
    response.put("token", token);
    response.put("userId", user.getId());
    response.put("role", user.getRole());
    return response;
}
```

3. **Ověření JWT v dalších požadavcích**
   - Klient posílá JWT v hlavičce každého požadavku.
   - Backend má JWT filter, který token ověří a nastaví uživatele do kontextu.

```java
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = getJwtFromRequest(request);
        if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
            String username = jwtTokenProvider.getUsernameFromJWT(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }
}
```

4. **Vytváření a ověřování JWT**

```java
public String createToken(Authentication authentication) {
    String username = authentication.getName();
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION_MS);
    return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
            .compact();
}

public boolean validateToken(String token) {
    try {
        Jwts.parser().setSigningKey(JWT_SECRET).parseClaimsJws(token);
        return true;
    } catch (Exception ex) {
        return false;
    }
}
```

**Jak bych to řekl u obhajoby:**
> „JWT tokeny používám pro autentizaci. Po přihlášení nebo registraci server vygeneruje token, který klient ukládá a posílá v každém požadavku. Backend token ověří, a pokud je platný, povolí přístup k chráněným zdrojům. Vše je řešeno pomocí Spring Security a vlastních tříd pro generování a validaci tokenů.“

---

### Jak funguje šifrování hesel ve vašem projektu?

**Odpověď:**
Hesla nikdy neukládám v čitelné podobě, ale hashují se pomocí algoritmu BCrypt. Při registraci se heslo zašifruje a uloží do databáze. Při přihlášení se zadané heslo porovná s uloženým hashem.

**Podrobný flow a ukázka kódu:**

1. **Při registraci**
   - Heslo se zašifruje pomocí `passwordEncoder.encode(...)` ještě před uložením do databáze.

```java
user.setPassword(passwordEncoder.encode(request.password));
```

2. **Při přihlášení**
   - Backend vezme hash z DB a pomocí `passwordEncoder.matches(zadaneHeslo, hashZDb)` ověří, zda zadané heslo odpovídá uloženému hashi.

3. **Kde se bere PasswordEncoder?**
   - Je to bean definovaná v konfigurační třídě:

```java
@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```
- Spring ji automaticky injektuje do AuthService.

**Jak bych to řekl u obhajoby:**
> „Hesla nikdy neukládám v čitelné podobě, ale hashují se pomocí BCrypt. Při registraci se heslo zašifruje a uloží do databáze. Při přihlášení se zadané heslo ověří proti uloženému hashi. O vše se stará Spring Security a bean PasswordEncoder, kterou mám definovanou v konfiguraci.“

---

## 3. Databáze

### Proč jste zvolil PostgreSQL?
- Mám s ním předchozí zkušenosti
- Podporuje ACID transakce
- Má silnou konzistenci dat
- Dobrá podpora JSON dat
- Výkonné fulltextové vyhledávání
- Robustní systém oprávnění

### Jak jste navrhl databázový model?
- Normalizovaná struktura pro minimalizaci redundance
- Efektivní vztahy mezi tabulkami
- Indexy pro optimalizaci dotazů
- Jasně definované primární a cizí klíče
- Logické seskupení souvisejících dat

### Jak jste řešil vztahy mezi tabulkami?
Implementoval jsem následující typy vztahů:
- One-to-Many: User -> Trainings (jeden uživatel má více tréninků)
- Many-to-Many: Users -> Messages (uživatelé si mohou vyměňovat zprávy)
- One-to-One: User -> Profile (jeden uživatel má jeden profil)

## 4. Funkcionalita

### Jak funguje systém tréninkových plánů?
Tréninkové plány byly z projektu odstraněny, protože:
- Nebyly součástí původních požadavků
- Zkomplikovaly by architekturu
- Nebyly prioritou pro první verzi

### Jak jste implementoval sledování pokroku uživatele?
- Ukládání měření do tabulky `user_measurements`
- Grafické zobrazení pomocí Chart.js
- Možnost filtrování a porovnávání dat
- Automatické výpočty statistik
- Export dat do CSV

### Jak funguje komunikace mezi trenéry a uživateli?
- Real-time chat pomocí WebSocket
- Ukládání zpráv do databáze
- Notifikace o nových zprávách
- Historie konverzací
- Možnost sdílení souborů

## 5. Technické detaily

### Jak jste řešil validaci vstupních dat?
- Anotace `@Valid` na modelech
- Custom validátory pro specifické požadavky
- Validace na frontendu i backendu
- Jasné chybové hlášky
- Sanitizace vstupů

### Jak jste implementoval error handling?
- Globalní exception handler
- Custom exception třídy
- Logování chyb
- Try-catch bloky pro ošetření výjimek
- Strukturované chybové odpovědi

### Jak jste řešil CORS a bezpečnost API?
- Konfigurace povolených originů
- Rate limiting pro prevenci DDoS
- CSRF ochrana
- Validace vstupních dat
- Bezpečné HTTP hlavičky

## 6. Rozšiřitelnost

### Jak byste rozšířil aplikaci o nové funkce?
- Modulární architektura umožňuje snadné přidávání nových funkcí
- Dependency injection pro volné propojení komponent
- Clean code principy pro udržitelnost
- Dokumentace API pro budoucí rozšíření
- Testovací pokrytí pro zachování kvality

### Jak jste připravil aplikaci na případné škálování?
- Horizontální škálování pomocí Docker kontejnerů
- Cachování pomocí Redis
- Optimalizované databázové dotazy
- Asynchronní zpracování dlouhých operací
- Load balancing

### Jak byste řešil zvýšení počtu uživatelů?
- Implementace cachování
- Optimalizace databázových dotazů
- Horizontální škálování
- Monitoring výkonu
- Load balancing

## 7. Testování

### Jak jste testoval aplikaci?
- Unit testy pro services
- Integration testy pro API
- End-to-end testy pro kritické cesty
- Testování bezpečnosti
- Performance testy

### Jaké typy testů jste implementoval?
- Unit testy pomocí JUnit
- Integration testy pomocí Spring Test
- End-to-end testy pomocí Selenium
- Security testy
- Load testy

### Jak jste řešil testování bezpečnosti?
- Penetrační testy
- Testování JWT tokenů
- Validace vstupních dat
- Testování oprávnění
- Audit bezpečnosti

## 8. Výkon

### Jak jste optimalizoval výkon aplikace?
- Cachování pomocí Redis
- Optimalizované SQL dotazy
- Lazy loading vztahů
- Minifikace frontend assets
- Komprese HTTP odpovědí

### Jak jste řešil cachování?
- Redis pro cachování dat
- Browser caching
- CDN pro statické soubory
- Cache invalidation
- Cache strategie

### Jak jste optimalizoval databázové dotazy?
- Indexy pro často používané sloupce
- Optimalizované JOIN operace
- Pagination pro velké výsledky
- Query caching
- Regular maintenance

## 9. UX/UI

### Proč jste zvolil TailwindCSS?
- Rychlý vývoj UI
- Konzistentní design
- Malá velikost bundle
- Snadná customizace
- Moderní přístup k CSS

### Jak jste řešil responzivní design?
- Mobile-first přístup
- Flexbox a Grid layout
- Breakpointy pro různé velikosti obrazovky
- Responzivní obrázky
- Touch-friendly interakce

### Jak jste zajistil přístupnost aplikace?
- Semantický HTML
- ARIA atributy
- Keyboard navigation
- Kontrastní barvy
- Screen reader support

## 10. Deployment

### Jak jste řešil deployment aplikace?
- Docker kontejnery
- CI/CD pipeline
- Automatické testy
- Blue-green deployment
- Rollback strategie

### Jak jste konfiguroval produkční prostředí?
- Environment proměnné
- Logging
- Monitoring
- Backup strategie
- Security hardening

### Jak jste řešil monitoring a logování?
- Prometheus pro monitoring
- ELK stack pro logování
- Alerting systém
- Performance metrics
- Error tracking

## Dependency Injection (Vkládání závislostí) v projektu

### 1. Co je Dependency Injection (DI) a proč se používá?

**Odpověď:**
Dependency Injection (vkládání závislostí) je návrhový vzor, který umožňuje předávat závislosti (například služby nebo repozitáře) třídám zvenčí, místo aby si třída vytvářela sama. V Spring Bootu je to základní princip, který zajišťuje přehlednost, testovatelnost a snadnou údržbu kódu.

**Výhody:**
- Oddělení odpovědností
- Snadná testovatelnost (možnost mockování závislostí)
- Přehlednost a jasně definované závislosti

---

### 2. Kde v projektu používáme Dependency Injection?

**Odpověď:**
Dependency injection používáme hlavně v controller a service třídách:
- **Controller třídy:** Zpracovávají HTTP požadavky a potřebují přístup k service vrstvě.
- **Service třídy:** Obsahují business logiku a potřebují přístup k repository vrstvě.

Repository třídy dependency injection nepotřebují, protože je spravuje Spring automaticky.

---

### 3. Jak vypadá Dependency Injection v controller třídě? (Ukázka z mého kódu)

```java
@RestController
@RequestMapping("/api/trainers")
public class TrainerController {
    private final TrainerService trainerService;
    private final UserService userService;

    // Dependency injection přes konstruktor
    public TrainerController(TrainerService trainerService, UserService userService) {
        this.trainerService = trainerService;
        this.userService = userService;
    }
    // ... další metody ...
}
```

**Vysvětlení:**
- `@RestController` označuje třídu jako REST controller.
- Závislosti jsou předány přes konstruktor a označeny jako `final`.
- Tento způsob je doporučený v Springu.

---

### 4. Jak vypadá Dependency Injection v service třídě? (Ukázka z mého kódu)

```java
@Service
public class TrainerService {
    private final UserRepository userRepository;
    private final TrainerReviewRepository trainerReviewRepository;
    private final MessageRepository messageRepository;

    // Dependency injection přes konstruktor
    public TrainerService(
        UserRepository userRepository,
        TrainerReviewRepository trainerReviewRepository,
        MessageRepository messageRepository
    ) {
        this.userRepository = userRepository;
        this.trainerReviewRepository = trainerReviewRepository;
        this.messageRepository = messageRepository;
    }
    // ... další metody ...
}
```

**Vysvětlení:**
- `@Service` označuje třídu jako servisní vrstvu.
- Všechny závislosti jsou předány přes konstruktor a označeny jako `final`.
- Třída tak nemá žádné skryté závislosti a je snadno testovatelná.

---

### 5. Proč nepoužíváme field injection (`@Autowired` na poli)?

**Odpověď:**
Dříve se používalo:
```java
@Autowired
private TrainerService trainerService;
```

**Nevýhody:**
- Závislosti nejsou viditelné v konstruktoru.
- Hůře se testuje.
- Nelze označit jako `final`.

Proto používáme **constructor injection**.

---

### 6. Jaké jsou hlavní výhody constructor injection?

- Immutabilita: Závislosti jsou `final` a nemohou být změněny po vytvoření objektu.
- Přehlednost: Všechny závislosti jsou jasně viditelné v konstruktoru.
- Testovatelnost: Lze snadno předat mockované závislosti při testování.
- Bezpečnost: Spring zajistí, že všechny závislosti budou k dispozici při vytváření beanu.

---

### 7. Ukázka z dalších tříd v projektu

#### AuthService
```java
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtTokenProvider jwtTokenProvider
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    // ...
}
```

#### UserController
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    // ...
}
```

#### FileService
```java
@Service
public class FileService {
    private final UserService userService;
    public FileService(UserService userService) {
        this.userService = userService;
    }
    // ...
}
```

---

### 8. Shrnutí

- Dependency injection je základní princip v architektuře Spring Boot aplikací.
- Všechny controller a service třídy mají závislosti předávány přes konstruktor.
- Tento přístup zajišťuje přehlednost, bezpečnost a snadnou testovatelnost kódu.
- V projektu je DI použito konzistentně a v souladu s best practices. 