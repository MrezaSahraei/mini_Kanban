# Task Management Backend (Django + Django REST Framework)

This project provides a backend service for managing tasks based on an attached Figma design.  
It supports listing tasks, creating new ones, and updating their progress and status.  
Task status and progress values automatically affect each other according to defined rules.

---

## ✨ Features

- List user-specific tasks
- Create and edit tasks
- Automatic progress update based on status and vice-versa
- Assign multiple users to a task
- Token-based authentication
- View available users for assignment

---

## 📌 Status and Progress Rules

| Status (`status` field) | Progress (`progress_percent`) |
|-------------------------|-------------------------------|
| `TO_DO`                | `0%`                          |
| `IN_PROGRESS`          | `1% - 99%`                    |
| `COMPLETED`            | `100%`                        |

### Behavior
- Newly created tasks always start with `status=TO_DO` and `progress_percent=0`.
- Moving a task to `IN_PROGRESS` sets its progress to at least `1`.
- Moving a task to `COMPLETED` sets its progress to `100`.
- If progress is manually set to `100`, the task automatically becomes `COMPLETED`.
- If progress is within `1–99`, the task automatically becomes `IN_PROGRESS`.

---

## 🧱 Models

### `Task`
| Field | Description |
|--------|------------|
| `title` | Task title |
| `description` | Description |
| `creator` | User who created the task |
| `assigned_to` | Users responsible for the task |
| `status` | Task status |
| `progress_percent` | Task progress percentage |
| `created_at` | Creation timestamp |
| `updated_at` | Last update timestamp |

---

## 🔐 Authentication

This project uses Django REST Framework Token Authentication.

### Obtain Token
```bash
POST tasks/login
{
  "username": "your_username",
  "password": "your_password"
}
```
## ▶️ Backend Setup (Django)
```bash
git clone []
cd project
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

ALLOWED_HOSTS = [
'127.0.0.1', 'localhost'
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]
```
## ▶️ Frontend Setup (React)
```bash
install nodejs
cd frontend
npx create-react-app .
npm run dev  
```

Screenshots
<img width="1919" height="945" alt="image" src="https://github.com/user-attachments/assets/6901f3fe-f3f8-4872-a480-bfcdcd3f42d1" />
<img width="1919" height="943" alt="image" src="https://github.com/user-attachments/assets/ccb47a8e-bb1a-4752-9d15-68b1d25b5a3e" />
<img width="1918" height="988" alt="image" src="https://github.com/user-attachments/assets/25508cef-5bd9-4d6b-918b-c40a4f13ab21" />


