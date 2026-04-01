# Monster Quest

Gamified task manager and productivity app where users complete quests (tasks) to defeat monsters, earn XP, and track progress.

## MVP Features
- User registration / login
- Create quests with difficulty
- Monster assigned to each quest
- Complete quest → gain XP / defeat monster
- XP / Level system
- Log of completed quests

## Tech Stack
**Frontend:**  
- React + TypeScript + Vite  
- Tailwind CSS
- React Router  

**Backend:**  
- Java 25 + Spring Boot + Spring Web  
- Spring Security + JWT  
- JPA / Hibernate  
- PostgreSQL  

**Dev Tools:**  
- GitHub (repo + project board)  
- Docker

## How to Run Locally
Run Monster Quest either via **Docker** (easy showcase) or the **Hybrid Way** (faster development).

### Requirements
* Docker Desktop
* Java 25 & Node.js 24+ (only for Hybrid Way)

### Setup
1. Clone or download the repository:
    ```bash
    git clone <repo-url>
    cd monster-quest
    ```
2. Environment Variables (optinal):  
    Create a `.env` file in the root directory. You can use `env.example` as a template.

### Option A: Showcase (Full Docker)

Use this if you just want to see the app running without setting up a local dev environment.

```bash
docker compose down -v
docker compose up --build
```

* PostgreSQL: http://localhost:5432
* Backend API: http://localhost:8080/api
* Frontend: http://localhost:5173
* pgAdmin: http://localhost:5050

### Option B: Development (Hybrid)

Use this for active coding to enjoy Instant Reload.

1. Start the Database  
   Run `.\dev-start.bat` (Windows) or:
   ```bash
   docker compose up -d db pgadmin
   ```

2. Start the Backend  
   Open a new terminal in the `backend` folder:
   ```bash
   .\mvnw clean spring-boot:run
   ```
      
3. Start the Frontend  
   Open a new terminal in the `frontend` folder:
   ```bash
   npm install
   npm run dev
   ```
      