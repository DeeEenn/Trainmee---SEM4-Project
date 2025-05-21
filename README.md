# Traynmee - Project documentation

## 1. Introduction
Traynmee is training diary developed for managing and watching your activies. Aplication allows user to watch their trainings and progress.
## 2. Architekture

### 2.1 TechStack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Spring Boot, Java
- **Database**: PostgreSQL
- **Autentization**: JWT (JSON Web Tokens)

### 2.2 Project structure

```
project-root/
├── frontend/                   # React application
│   ├── public/                 # Static files
│   └── src/
│       ├── components/         # React components
│       ├── pages/              # Application pages
│       ├── services/           # API services
│       └── config/             # Configurations
│
├── backend/                    # Spring Boot application
│   ├── uploads/                # Uploaded files
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/           # Java source code
│   │   │   └── resources/      # Configuration files
│   │   └── test/               # Tests
│
└── README.md                  
```


## 3. Main features

### 3.1 User features
- User login and regisration
- Managing user profile
- Uploading profile picture
- Watching your bodily measures (weight, % bodyfat)

### 3.2 Training features
- Creating and managing trainings
- Managing exercises in trainings
- Reviewing your proggress

### 3.3 Security features
- JWT auth
- Password encryption
- CORS protection
- API endpoint restrictions

## 4. Implemented endpoints

### 4.1 Auth
- POST `/api/auth/register` - New user regisration
- POST `/api/auth/login` - User login

### 4.2 User profile
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Profile update
- POST `/api/files/profile-picture` - Upload profile picture

### 4.3 Trainings
- GET `/api/trainings` - Trainings list
- POST `/api/trainings` - Create training
- GET `/api/trainings/{id}` - Training detail
- PUT `/api/trainings/{id}` - Training update
- DELETE `/api/trainings/{id}` - Training delete

## 5. Database

### 5.1 Tables
- `users` 
- `trainings`
- `exercises` 
- `progress` 
- `user_measurements` 

## 6. Security measures

### 6.1 Auth and autorization
- JWT token implementation
- Password encryption using Bcrypt
- Verification of users

### 6.2 API security
- CORS config
- API endpoint restrictions
- Input data validation

## 7. Frontend implementation

### 7.1 Components
- Responsive design using TailwindCSS
- Modular component structure
- State management using React

### 7.2 UI
- Intuitivi navigation
- Responzive layout
- Forms with validation
- Loading states and error handling

## 8. Backend implementation

### 8.1 Architecture
- RESTful API
- Service layer pattern
- Repository pattern
- DTO for object transformation

### 8.2 File management
- Profile picture upload
- File type validation
- Safe files saves

## 9. Results
Traynmee is fully functional web application with modern techstack and architecture. Project demonstrates implementation with best practices in area of web app development, security and user interface. 
## 11. Technical details

### 11.1 System requirements
- Java 17+
- Node.js 16+
- PostgreSQL 13+
- Maven 3.6+

### 11.2 Installation and start
1. Clone repository
2. Setup database
3. Backend configuration
4. Install npm dependencies

### 11.3 Configs
- Setup database connection
- Config JWT
- CORS settings
- File upload configs
