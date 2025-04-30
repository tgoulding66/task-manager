# 🗂️ Project & Task Manager (MERN Stack)

A full-featured task management application built with the **MERN** stack — including rich project/task/subtask workflows, dark mode support, and user authentication.

---

## 🧱 Project Structure

<pre> ``` task-manager/ ├── backend/ # Node.js/Express API + MongoDB (Mongoose) │ ├── controllers/ │ ├── models/ │ ├── routes/ │ └── middleware/ ├── frontend/ # React app (Vite + Bootstrap 5) │ ├── pages/ │ ├── components/ │ ├── context/ │ └── services/ ``` </pre>

---

## 📦 Tech Stack

- **Frontend:** React, Vite, React-Bootstrap, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT (login & protected routes)
- **Styling:** Bootstrap 5 + custom dark theme
- **API Testing:** Postman

---

## ✨ Key Features

- 🔐 User registration & login with JWT-based auth
- 🗃️ Create & manage multiple **projects**
- ✅ Add **tasks** with due dates, priorities, and notes
- 🧩 Nested **subtasks** with completion tracking
- 🔁 Inline **task editing**, reordering, and deletion
- 📆 Project due dates
- 🌚 **Dark mode UI** with responsive Bootstrap layout
- 💡 Smart UX:
  - Prompt to mark task "Done" when all subtasks are completed
  - Toast notifications on success/failure

---

## 🚀 Getting Started

### 🔧 Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a .env file in /backend with:
PORT=3000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Access frontend at `http://localhost:5173`  
Access backend API at `http://localhost:3000`

✅ Coming Soon

- Light/dark theme toggle
- User settings page
- Drag-and-drop task reordering
- Global search and filtering

🧪 API Testing

- Use Postman or Thunder Client to test the following routes:
- POST /api/users/register
- POST /api/users/login
- GET /api/projects
- POST /api/tasks
- PUT /api/tasks/:id

Include your JWT in the Authorization: Bearer token header.

🛠️ License
MIT — feel free to fork and build on it
