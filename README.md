# Traynmee

A comprehensive web application for managing personal training sessions, tracking progress, and connecting with trainers.

## Table of Contents
1. [Project Architecture](#project-architecture)
2. [Backend](#backend)
   - [Main Classes](#main-classes)
   - [Models](#models)
   - [Controllers](#controllers)
   - [Services](#services)
   - [Repositories](#repositories)
   - [Security](#security)
3. [Frontend](#frontend)
   - [Components](#components)
   - [Services](#frontend-services)
   - [Configuration](#configuration)
   - [Browser Storage](#browser-storage)
4. [Database](#database)
5. [API Endpoints](#api-endpoints)
6. [Glossary](#glossary)

## Project Architecture

The project is built on a modern architecture with separated frontend and backend:

- **Backend**: Java Spring Boot
- **Frontend**: React + TailwindCSS
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## Backend

### Main Classes

#### TreninkovyDenikApplication
```java
@SpringBootApplication
@EnableScheduling
public class TreninkovyDenikApplication
```
- Spring Boot application entry point
- `@SpringBootApplication` combines:
  - `@Configuration`: Defines configuration class
  - `@EnableAutoConfiguration`: Spring Boot auto-configuration
  - `@ComponentScan`: Automatic component scanning
- `@EnableScheduling`: Enables scheduled tasks

### Models

#### User
```java
@Entity
public class User
```
- Basic user entity
- Attributes:
  - `id`: Primary key
  - `name`: User's name
  - `surname`: User's surname
  - `email`: Email (unique)
  - `password`: Password (hashed)
  - `role`: User role (USER/TRAINER)
  - `description`: Description (trainers only)
  - `bodyFatPercentage`: Body fat percentage
  - `weight`: Weight
  - `height`: Height
  - `profilePictureUrl`: Profile picture URL

#### Training
```java
@Entity
public class Training
```
- Represents a training session
- Attributes:
  - `id`: Primary key
  - `name`: Training name
  - `date`: Training date
  - `user`: User relationship
  - `exercises`: List of exercises

#### Exercise
```java
@Entity
public class Exercise
```
- Represents an exercise
- Attributes:
  - `id`: Primary key
  - `name`: Exercise name
  - `sets`: Number of sets
  - `reps`: Number of repetitions
  - `weight`: Weight used
  - `training`: Training relationship

#### Progress
```java
@Entity
public class Progress
```
- Tracks user progress
- Attributes:
  - `id`: Primary key
  - `user`: User relationship
  - `date`: Measurement date
  - `weight`: Weight
  - `bodyFatPercentage`: Body fat percentage
  - `measurements`: Measurements (JSON)

#### TrainerReview
```java
@Entity
public class TrainerReview
```
- Trainer review
- Attributes:
  - `id`: Primary key
  - `trainer`: Trainer relationship
  - `user`: User relationship
  - `rating`: Rating (1-5)
  - `comment`: Comment
  - `createdAt`: Creation date

#### Message
```java
@Entity
public class Message
```
- User messages
- Attributes:
  - `id`: Primary key
  - `sender`: Sender
  - `receiver`: Receiver
  - `content`: Message content
  - `createdAt`: Send date
  - `read`: Read status

### Controllers

#### AuthController
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController
```
- Handles authentication and registration
- Endpoints:
  - `POST /register`: Register new user
  - `POST /login`: User login

#### TrainerController
```java
@RestController
@RequestMapping("/api/trainers")
public class TrainerController
```
- Trainer management
- Endpoints:
  - `GET /`: List all trainers
  - `GET /{id}`: Trainer details
  - `GET /{id}/reviews`: Trainer reviews
  - `POST /{id}/reviews`: Add review
  - `GET /{id}/messages`: Messages with trainer
  - `POST /{id}/messages`: Send message
  - `GET /conversations`: List conversations
  - `PUT /profile`: Update trainer profile

#### TrainingController
```java
@RestController
@RequestMapping("/api/trainings")
public class TrainingController
```
- Training management
- Endpoints:
  - `GET /`: List trainings
  - `POST /`: Create training
  - `GET /{id}`: Training details
  - `PUT /{id}`: Update training
  - `DELETE /{id}`: Delete training

#### ProgressController
```java
@RestController
@RequestMapping("/api/progress")
public class ProgressController
```
- Progress management
- Endpoints:
  - `GET /`: List measurements
  - `POST /`: Add measurement
  - `GET /stats`: Progress statistics

### Services

#### AuthService
```java
@Service
public class AuthService
```
- Authentication processing
- Methods:
  - `register()`: User registration
  - `login()`: User login
  - `validateToken()`: JWT token validation

#### TrainerService
```java
@Service
public class TrainerService
```
- Trainer business logic
- Methods:
  - `getAllTrainers()`: List trainers
  - `getTrainerById()`: Get trainer details
  - `addReview()`: Add review
  - `getTrainerReviews()`: List reviews
  - `sendMessage()`: Send message
  - `getConversation()`: Get user conversation

#### TrainingService
```java
@Service
public class TrainingService
```
- Training business logic
- Methods:
  - `createTraining()`: Create training
  - `updateTraining()`: Update training
  - `deleteTraining()`: Delete training
  - `getUserTrainings()`: Get user trainings

#### ProgressService
```java
@Service
public class ProgressService
```
- Progress business logic
- Methods:
  - `addMeasurement()`: Add measurement
  - `getUserProgress()`: Get user progress
  - `calculateStats()`: Calculate statistics

### Repositories

All repositories extend `JpaRepository` and provide basic CRUD operations:

- `UserRepository`
- `TrainingRepository`
- `ExerciseRepository`
- `ProgressRepository`
- `TrainerReviewRepository`
- `MessageRepository`

### Security

#### JwtTokenProvider
```java
@Component
public class JwtTokenProvider
```
- JWT token generation and validation
- Methods:
  - `createToken()`: Create token
  - `validateToken()`: Validate token
  - `getUsername()`: Get username from token

Detailed description:
- Uses `jjwt` library for JWT operations
- Token contains:
  - Subject (username)
  - Creation date
  - Expiration date (1 hour)
  - HS256 algorithm signature
- Token validation checks:
  - Signature validity
  - Token expiration
  - Correct format
- Detailed logging for debugging

#### JwtAuthenticationFilter
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter
```
- Filters incoming HTTP requests
- JWT token processing:
  1. Extract token from Authorization header
  2. Validate token
  3. Load user data
  4. Set authentication in SecurityContext

Detailed description:
- Extends `OncePerRequestFilter` for single request processing
- Authentication process:
  1. Get token from "Bearer" header
  2. Validate using `JwtTokenProvider`
  3. Load `UserDetails` from `UserDetailsService`
  4. Create `Authentication` object
  5. Set in `SecurityContext`
- Includes detailed logging
- Exception handling for application stability

#### SecurityConfig
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig
```
- Main Spring Security configuration
- Settings:
  - CORS
  - CSRF
  - Authentication
  - Authorization
  - JWT filters

Detailed description:
- Security rules configuration:
  - `/api/auth/**` - public endpoints
  - `/api/trainers/**` - public endpoints
  - `/api/files/**` - requires authentication
  - `/uploads/**` - public files
  - `/api/users/profile` - requires authentication
  - `/api/trainers/profile` - requires authentication
  - `/api/trainings/**` - requires authentication
  - `/api/progress/**` - requires authentication
- CORS configuration:
  - Allowed origin: `http://localhost:3000`
  - Allowed methods: GET, POST, PUT, DELETE, OPTIONS
  - Allowed headers: all
  - Allowed credentials
- Security settings:
  - Disabled CSRF (not needed for REST API)
  - Stateless session management
  - BCrypt password hashing
  - JWT authentication

#### Authentication Process
1. User logs in via `/api/auth/login`
2. Server creates JWT token using `JwtTokenProvider`
3. Token is sent to client
4. Client stores token in localStorage
5. For each request:
   - Token is sent in Authorization header
   - `JwtAuthenticationFilter` processes token
   - If valid, request is processed
   - If invalid, returns 401 Unauthorized

#### Security Measures
- Passwords hashed using BCrypt
- Tokens expire after 1 hour
- CORS configured only for frontend application
- All sensitive endpoints require authentication
- Stateless authentication for better scalability
- Detailed logging for security monitoring

## Frontend

### Components

#### App
```javascript
function App()
```
- Main application component
- Contains:
  - Router
  - Authentication
  - Navigation
  - Main layout

#### AuthForm
```javascript
const AuthForm = ({ onAuthSuccess })
```
- Login/registration form
- Functions:
  - Toggle between login and registration
  - Form validation
  - API request submission

#### TrainerDashboard
```javascript
const TrainerDashboard = () => {
```
- Trainer dashboard
- Functions:
  - Profile management
  - Review display
  - Conversation management
  - Message sending

#### TrainerDetail
```javascript
const TrainerDetail = () => {
```
- Trainer details for users
- Functions:
  - Display trainer information
  - Add review
  - Display reviews
  - Send message

#### TrainingList
```javascript
const TrainingList = ({ trainings, onDeleteTraining, onUpdateTraining })
```
- Training list
- Functions:
  - Display trainings
  - Edit training
  - Delete training
  - Filter and sort

#### TrainingStats
```javascript
const TrainingStats = ({ userId })
```
- Training statistics
- Functions:
  - Display progress
  - Graphs and statistics
  - Period filtering

#### MessageList
```javascript
const MessageList = ({ messages, onSendMessage })
```
- Message list
- Functions:
  - Display conversation
  - Send message
  - Auto-load new messages

#### TrainerList
```javascript
const TrainerList = () => {
```
- Trainer list with favorites functionality
- Features:
  - Display all trainers
  - Add/remove trainers to favorites
  - User-specific favorites storage
  - Responsive grid layout
  - Loading states
  - Error handling

### Frontend Services

#### api.js
```javascript
export const api = axios.create({...})
```
- Axios configuration
- Interceptors for:
  - JWT token addition
  - Error handling
  - Token refresh

#### trainerService
```javascript
export const trainerService = {...}
```
- Trainer service
- Methods:
  - `getAll()`
  - `getById()`
  - `getReviews()`
  - `addReview()`
  - `sendMessage()`

#### trainingService
```javascript
export const trainingService = {...}
```
- Training service
- Methods:
  - `getAll()`
  - `create()`
  - `update()`
  - `delete()`

### Configuration

#### api.js
```javascript
const API_CONFIG = {...}
```
- API endpoint configuration
- Settings for:
  - Development
  - Production
  - Test

### Browser Storage

The application uses browser storage for various purposes:

#### LocalStorage
- **JWT Token**: Authentication token
- **User ID**: Current user identification
- **Favorite Trainers**: User-specific list of favorite trainers
  - Stored with user-specific key: `favoriteTrainers_${userId}`
  - Persists across sessions
  - Automatically loads on component mount
  - Updates in real-time when toggling favorites

#### SessionStorage
- **Temporary Data**: Session-specific information
- **Form Data**: Temporary form state

## Database

### Schema

- **users**
  - id (PK)
  - name
  - surname
  - email
  - password
  - role
  - description
  - body_fat_percentage
  - weight
  - height
  - profile_picture_url

- **trainings**
  - id (PK)
  - name
  - date
  - user_id (FK)

- **exercises**
  - id (PK)
  - name
  - sets
  - reps
  - weight
  - training_id (FK)

- **progress**
  - id (PK)
  - user_id (FK)
  - date
  - weight
  - body_fat_percentage
  - measurements

- **trainer_reviews**
  - id (PK)
  - trainer_id (FK)
  - user_id (FK)
  - rating
  - comment
  - created_at

- **messages**
  - id (PK)
  - sender_id (FK)
  - receiver_id (FK)
  - content
  - created_at
  - read

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Trainers
- `GET /api/trainers`
- `GET /api/trainers/{id}`
- `GET /api/trainers/{id}/reviews`
- `POST /api/trainers/{id}/reviews`
- `GET /api/trainers/{id}/messages`
- `POST /api/trainers/{id}/messages`
- `GET /api/trainers/conversations`
- `PUT /api/trainers/profile`

### Trainings
- `GET /api/trainings`
- `POST /api/trainings`
- `GET /api/trainings/{id}`
- `PUT /api/trainings/{id}`
- `DELETE /api/trainings/{id}`

### Progress
- `GET /api/progress`
- `POST /api/progress`
- `GET /api/progress/stats`

## Glossary

### Backend
- **Spring Boot**: Java application development framework, simplifies configuration and deployment
- **JPA (Java Persistence API)**: Specification for database operations in Java
- **Hibernate**: JPA implementation, ORM (Object-Relational Mapping) framework
- **REST API**: Architecture for client-server communication
- **JWT (JSON Web Token)**: Standard for secure data transmission
- **BCrypt**: Password hashing algorithm
- **CORS (Cross-Origin Resource Sharing)**: Mechanism for sharing resources between domains
- **CSRF (Cross-Site Request Forgery)**: Type of web application attack

### Frontend
- **React**: JavaScript library for building user interfaces
- **TailwindCSS**: Utility-first CSS framework
- **Axios**: HTTP client for browser and Node.js
- **LocalStorage**: Web Storage API for browser data storage
- **JWT Token**: Security token for authentication
- **State Management**: Application state management
- **Component**: Reusable user interface part
- **Props**: Component properties in React
- **Hooks**: Functions for state and lifecycle management in React

### Database
- **PostgreSQL**: Relational database system
- **ORM (Object-Relational Mapping)**: Technique for mapping objects to database tables
- **Entity**: Class mapped to database table
- **Repository**: Interface for database operations
- **Primary Key (PK)**: Unique record identifier
- **Foreign Key (FK)**: Reference to another table's primary key
- **Transaction**: Set of database operations performed as a unit

### Security
- **Authentication**: Process of verifying user identity
- **Authorization**: Process of determining user permissions
- **JWT Token**: Security token containing user information
- **Bearer Token**: Type of authentication scheme
- **Hash**: One-way data transformation
- **Salt**: Random data added to password before hashing
- **CORS**: Mechanism for controlling API access from different domains
- **CSRF**: Type of web application attack
- **XSS (Cross-Site Scripting)**: Type of attack injecting malicious code

### Architecture
- **MVC (Model-View-Controller)**: Architectural pattern
- **REST (Representational State Transfer)**: Architectural style for distributed systems
- **API (Application Programming Interface)**: Interface for application communication
- **Endpoint**: URL address for API access
- **DTO (Data Transfer Object)**: Object for data transfer between layers
- **Service Layer**: Layer containing business logic
- **Controller Layer**: Layer processing HTTP requests
- **Repository Layer**: Layer for database operations

### Development
- **Git**: Version control system
- **Maven**: Dependency management and build tool for Java
- **npm**: Package manager for Node.js
- **Dependency Injection**: Pattern for dependency management
- **Logging**: Recording application events
- **Exception Handling**: Error processing
- **Unit Testing**: Testing individual code parts
- **Integration Testing**: Testing system part interactions

### Browser Storage
- **LocalStorage**: Persistent browser storage
- **SessionStorage**: Session-based browser storage
- **JWT Token**: Authentication token storage
- **User Preferences**: User-specific settings storage
- **Favorite Items**: User-specific favorites storage
