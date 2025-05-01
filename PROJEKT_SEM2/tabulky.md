## Vsechny tabulky vytvorene v databazi treninkovy_denik

```
CREATE TABLE user (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('USER', 'TRAINER')),
    register_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT true
);
```

```
CREATE TABLE exercise (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    body_part VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('BEGINNER', 'MEDIOCRE', 'ADVANCED')),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

```
CREATE TABLE training_exercise (
    id BIGSERIAL PRIMARY KEY,
    trenink_id BIGINT REFERENCES trenink(id),
    cvik_id BIGINT REFERENCES cvik(id),
    pocet_serii INTEGER,
    pocet_opakovani INTEGER,
    vaha_kg DECIMAL(5,2),
    poznamka TEXT
);
```