# SkillSwap - Fullstack Skill Exchange Platform

SkillSwap is a web application that enables users to connect, exchange knowledge, and learn skills from one another. Users can showcase what they can teach, specify what they want to learn, discover community members, send swap requests, schedule interactive sessions, and communicate in real-time messages.

---

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Routing**: React Router v7
- **Styling**: Vanilla CSS (modular stylesheets)
- **API Client**: Centralized fetch service ([`src/services/api.js`](file:///c:/Users/Dell/skillswap/src/services/api.js))

### Backend
- **Framework**: Spring Boot (Java 17+)
- **Build Tool**: Apache Maven (bundled Maven wrapper `mvnw` included)
- **Database**: MySQL 8.0 (`skillswap_db`)
- **ORM / Persistence**: Spring Data JPA + Hibernate
- **Security**: Spring Security (BCrypt password encryption, full CORS enabled for Vite)

---

## Project Structure

```
skillswap/
├── backend/                                   # Spring Boot + Maven backend
│   ├── pom.xml                               # Maven project configuration
│   ├── mvnw / mvnw.cmd                       # Maven wrapper executables
│   └── src/main/
│       ├── java/com/skillswap/
│       │   ├── SkillswapBackendApplication.java
│       │   ├── config/                       # Security & DataInitializer
│       │   ├── controller/                   # REST Controllers (Auth, Skills, Requests, Sessions, Messages, Users)
│       │   ├── dto/                          # Data Transfer Objects
│       │   ├── entity/                       # JPA Entities (User, Skill, SwapRequest, Session, Message)
│       │   ├── repository/                   # Spring Data JPA Repositories
│       │   └── service/                      # Business Logic Services
│       └── resources/
│           └── application.properties        # MySQL connection & server config
├── src/                                       # React Frontend
│   ├── components/                           # Navbar, ProtectedRoute
│   ├── pages/                                # Home, Login, Register, Dashboard, FindSkills, MySkills, Requests, Sessions, Messages, Profile, SkillDetails
│   ├── services/                             # API Client (api.js)
│   ├── App.jsx                               # Router configuration
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## Database Configuration

The application connects to MySQL using the following settings in [`backend/src/main/resources/application.properties`](file:///c:/Users/Dell/skillswap/backend/src/main/resources/application.properties):

- **Database URL**: `jdbc:mysql://localhost:3306/skillswap_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
- **Username**: `root`
- **Password**: `govardhanreddy@22`
- **Server Port**: `8081`

Hibernate automatically creates and updates all database tables (`users`, `skills`, `swap_requests`, `sessions`, `messages`).

When the backend starts up, [`DataInitializer`](file:///c:/Users/Dell/skillswap/backend/src/main/java/com/skillswap/config/DataInitializer.java) seeds realistic community members (Arjun Kumar, Priya Sharma, Rahul Verma, Sneha Reddy, Kiran Patel, Ananya Rao) and skills so the platform is populated and ready for immediate testing.

---

## REST API Endpoints

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login with email and password |

### 2. User Profiles (`/api/users`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/{id}` | Get user profile by ID |
| `GET` | `/api/users/profile?email={email}` | Get user profile by email |
| `PUT` | `/api/users/{id}` | Update profile (name, bio, location) |
| `GET` | `/api/users/community` | Get all community member profiles |

### 3. Skills (`/api/skills`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/skills/user/{userId}` | Get skills for a user (TEACH / LEARN) |
| `POST` | `/api/skills?userId={userId}` | Add a new skill |
| `DELETE` | `/api/skills/{id}?userId={userId}` | Delete a skill |
| `GET` | `/api/skills/explore` | Search and filter community skills |
| `GET` | `/api/skills/{id}` | Get skill details by ID |

### 4. Swap Requests (`/api/requests`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/requests` | Send a skill swap request |
| `GET` | `/api/requests/incoming/{userId}` | Get incoming requests for user |
| `GET` | `/api/requests/sent/{userId}` | Get sent requests from user |
| `PUT` | `/api/requests/{id}/status` | Accept or Decline a swap request |

### 5. Sessions (`/api/sessions`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/sessions/user/{userId}` | Get scheduled sessions |
| `POST` | `/api/sessions` | Schedule a new session |
| `PUT` | `/api/sessions/{id}` | Update session |
| `DELETE` | `/api/sessions/{id}` | Cancel/delete session |

### 6. Messages (`/api/messages`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/messages/history?user1={u1}&user2={u2}` | Get chat message thread |
| `POST` | `/api/messages` | Send a chat message |

---

## Running the Application

### 1. Run the Spring Boot Backend
From the project root:
```powershell
npm run backend
```
Or directly from the `backend` directory:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
The backend starts on `http://localhost:8081`.

### 2. Run the React Frontend
In a separate terminal:
```powershell
npm run dev
```
The frontend is available at `http://localhost:5173`.
