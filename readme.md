# Secure Node.js Authentication API (TypeScript)

A production-ready authentication CRUD application built with Node.js, Express, and MongoDB. This project implements modern security standards, including Argon2 password hashing and JWT-based stateless authentication.

## 🚀 Features

* **TypeScript Integration**: Strong typing across the entire application for improved maintainability and developer experience.
* **Argon2 Hashing**: Uses the winner of the Password Hashing Competition (PHC) to provide superior resistance against GPU-based brute-force attacks.
* **JWT Authentication**: Stateless session management using JSON Web Tokens (JWT) with "Bearer" token headers.
* **Security Best Practices**: 
    * Mongoose `select: false` on sensitive fields (passwords).
    * Protected routes via authentication middleware.
    * Environment variable management for secrets.
* **Full CRUD Support**: Endpoints for User Registration, Login, Profile Retrieval, and Account Management (Update/Delete).

---

## 🛠️ Tech Stack

* **Runtime**: Node.js
* **Framework**: Express
* **Database**: MongoDB (via Mongoose)
* **Language**: TypeScript
* **Security**: Argon2, JWT, Dotenv

---

## 📋 Prerequisites

* [Node.js](https://nodejs.org/) (v18+ recommended)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or a local MongoDB instance.

---

## ⚙️ Installation & Setup

1.  **Clone the project** and navigate to the root directory.

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure environment variables**:
    Create a `.env` file in the root directory based on the provided `.env.example`:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_long_random_secret_key
    ```

4.  **Start development mode**:
    This uses `nodemon` and `ts-node` to watch for changes in the `src` directory.
    ```bash
    npm start
    ```

---

## 📡 API Endpoints

### Public Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Create a new user account. |
| `POST` | `/auth/login` | Authenticate and receive a JWT token. |

### Protected Routes (Requires Bearer Token)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/user/profile` | Retrieve the current user's profile data. |
| `PATCH` | `/user/profile` | Update profile information (e.g., username, password). |
| `DELETE` | `/user/profile` | Permanently delete the user account. |

---

## 🔒 Security Implementation Details

* **Data Protection**: User passwords are never stored in plain text. They are hashed using Argon2 before being saved to the database.
* **Middleware**: The `authenticate` middleware intercepts requests to protected routes, verifying the JWT signature before allowing the request to reach the controller.
* **Input Handling**: Uses `body-parser` for secure JSON parsing and `cors` to manage cross-origin resource sharing.

---

## 📄 License

This project is licensed under the MIT License.