# 📘 Laravel Project + User API

This project is a RESTful API built with Laravel for managing users, including mass import functionality, filterable query parameters, and frontend integration (e.g., React).

---

## 📦 Requirements

- PHP >= 8.1
- Composer
- MySQL
- Node.js and NPM (if using React frontend)
- Laravel 10+

---

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/your-username/your-project.git
cd your-project
```

2. Install dependencies:

```bash
composer install
```

3. Configure `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your database information:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=yourdatabase
DB_USERNAME=youruser
DB_PASSWORD=yourpassword
```

4. Generate application key:

```bash
php artisan key:generate
```

5. Run migrations:

```bash
php artisan migrate
```

6. Start local server:

```bash
php artisan serve
```

API will be available at `http://localhost:8000/api`

---

## 📡 API Endpoints

### ▶️ GET /api/users
List all users, with optional filters:

```bash
GET /api/users
GET /api/users?query=joao
GET /api/users?email=joao@example.com
GET /api/users?phoneNumber=11999999999
```

### ▶️ GET /api/users/{_id}
Get a user by ID:
```bash
GET /api/users/user123
```

### ▶️ POST /api/users
Create a new user:
```bash
POST /api/users
Content-Type: application/json

{
  "_id": "user123",
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao@example.com",
  "phoneNumber": "11988887777"
}
```

### ▶️ PUT /api/users/{_id}
Update an existing user:
```bash
PUT /api/users/user123
Content-Type: application/json

{
  "firstName": "João",
  "lastName": "Souza",
  "email": "joao@novo.com",
  "phoneNumber": "11911112222"
}
```

### ▶️ DELETE /api/users/{_id}
Delete a user by ID:
```bash
DELETE /api/users/user123
```

---

## 🔄 Mass Import

Endpoint to import users by merging two arrays:

- `users`: array of users without `phoneNumber`
- `phones`: array of objects with `email` and `phoneNumber`

The backend will **merge the arrays by matching emails**, attach the phone numbers when available, and insert the final list into the database.

```bash
POST /api/users/importMultipleUsers
Content-Type: application/json

{
  "users": [
    {
      "_id": "user1",
      "firstName": "Maria",
      "lastName": "Oliveira",
      "email": "maria@example.com"
    },
    {
      "_id": "user2",
      "firstName": "Carlos",
      "lastName": "Souza",
      "email": "carlos@example.com"
    }
  ],
  "phones": [
    {
      "email": "maria@example.com",
      "phoneNumber": "11955554444"
    },
    {
      "email": "carlos@example.com",
      "phoneNumber": "11933332222"
    }
  ]
}
```

- Only users with unique `_id` will be inserted
- Users without matching `phoneNumber` will still be accepted
- Backend handles the merging and validation

---
# 🧪 Running Tests in Laravel Project
Once your environment is ready, you can run the tests using the following commands:

```bash
php artisan test
```



## ⚠️ Notes

- The `_id` field is **manually provided** and **required**
- Backend validation is handled via `Request::validate()`
- Supports dynamic filters via query string
- `phoneNumber` field is optional

---

## ⚛️ Frontend (React + Vite)

The frontend is already integrated into the Laravel project using **Vite** and **React**. Follow these steps after setting up the backend:

### 1. Install Node dependencies

```bash
npm install
```

### 2. Run the Vite development server

```bash
npm run dev
```

> This will start the React frontend and enable hot reloading at `http://localhost:5173` (or proxied via Laravel).

Once both Laravel (`php artisan serve`) and Vite (`npm run dev`) are running, open:

🔗 [http://localhost:8000](http://localhost:8000) — Laravel serving the React app

You should see the full CRUD interface with Material UI.

---

## 📬 Contact

Created by Thiago Vinhas.
For questions or contributions, feel free to open an issue or pull request.

