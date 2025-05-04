## Tabulka user
```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('USER', 'TRAINER'))
);
```
## Tabulka training
```
CREATE TABLE training (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date TIMESTAMP NOT NULL,
    description TEXT,
    user_id INTEGER REFERENCES users(id)
);
```

```
CREATE TABLE exercise (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    body_part VARCHAR(50) NOT NULL,
    sets INTEGER,
    reps INTEGER,
    training_id INTEGER REFERENCES training(id)
);
```

```
CREATE TABLE progress (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    description TEXT,
    user_id INTEGER REFERENCES users(id),
    exercise_id INTEGER REFERENCES exercise(id)
);
```

```
CREATE TABLE trainer (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

```
CREATE TABLE user_trainer (
    user_id INTEGER REFERENCES users(id),
    trainer_id INTEGER REFERENCES trainer(id),
    PRIMARY KEY (user_id, trainer_id)
);
```




