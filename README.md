<<<<<<< HEAD
# SecurePass - MERN Password Manager

SecurePass is a full-stack password management application built with the MERN stack (MongoDB, Express, React, Node.js). It provides a secure way for users to store, manage, and retrieve their passwords for various websites.

## Features

- **User Authentication**: Secure registration and login system.
- **Password Encryption**: Passwords are encrypted before being stored in the database.
- **CRUD Operations**: Users can Add, View, Update, and Delete their stored passwords.
- **Protected Routes**: Password management is restricted to authenticated users only using JWT (JSON Web Tokens).
- **Responsive UI**: A modern, clean, and responsive user interface built with React.

## Technology Stack

### Frontend
- React 19 (via Vite)
- React Router DOM for routing
- Axios for API requests
- Lucide React for icons
- Custom CSS for styling

### Backend
- Node.js & Express.js
- MongoDB & Mongoose for database modeling
- bcrypt for hashing user passwords
- jsonwebtoken (JWT) for authentication
- cors & dotenv

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas account)

## Installation & Setup

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd "d:\Projects\WAD"
   ```

2. **Setup the Backend (Server):**
   ```bash
   cd server
   npm install
   ```

3. **Setup the Frontend (Client):**
   ```bash
   cd ../client
   npm install
   ```

## Environment Variables

Create a `.env` file in the `server` directory and add the following configuration:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/password-manager
JWT_SECRET=your_super_secret_jwt_key
```
*(Replace `MONGO_URI` with your MongoDB Atlas connection string if you are using a cloud database).*

## Running the Application

You will need two terminal windows to run the frontend and backend concurrently.

**1. Start the Backend Server:**
```bash
cd server
node server.js
```
The server will start on `http://localhost:5000`.

**2. Start the Frontend Client:**
```bash
cd client
npm run dev
```
The React application will start, usually on `http://localhost:5173`. Open this URL in your browser.

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Authenticate a user and get a token

### Password Routes (`/api/passwords`) - *Requires JWT Auth Header*
- `GET /` - Get all passwords for the logged-in user
- `POST /` - Add a new password entry
- `PUT /:id` - Update an existing password entry
- `DELETE /:id` - Delete a password entry

## Project Structure

```
WAD/
├── client/           # React Frontend
│   ├── src/
│   │   ├── pages/    # React components (Register, Login, Dashboard)
│   │   ├── App.jsx   # Main application component & Routing
│   │   └── ...
│   └── package.json
└── server/           # Express/Node Backend
    ├── models/       # Mongoose schemas (User, Password)
    ├── routes/       # Express routes (auth, passwords)
    ├── middleware/   # Custom middleware (auth.js)
    ├── server.js     # Entry point for backend
    └── package.json
```
=======
**🔐 SecurePass – Password Manager (MERN Stack)**

**SecurePass is a full-stack password management application built using the MERN stack. It allows users to securely store, manage, and retrieve credentials for various websites through an intuitive interface and robust backend.**

**🚀 Features**

**🔑 User Authentication**
Secure signup and login functionality
Password hashing and authentication

**🗄️ Password Management**
Add, view, edit, and delete stored credentials
Store website name, username/email, and password

**🔒 Security Focused**
Encrypted password storage
JWT-based authentication
Protected API routes

**⚡ Responsive UI**
Built with modern React for smooth UX

**🛠️ Tech Stack**

**Frontend:**

React (v19)
Axios
CSS 

**Backend:**

Node.js
Express.js

**Database:**

MongoDB (Mongoose)

**Authentication & Security:**

JSON Web Tokens (JWT)
bcrypt.js
>>>>>>> 0f5ee58a0be13c4c1895489984710bececc08594
