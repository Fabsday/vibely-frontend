# Vibely 🚀

A full-stack social platform that allows users to share their thoughts, post updates, and interact in a clean, responsive environment. Built with modern web technologies to ensure a seamless and authenticated user experience.

🔗 **Live Demo:** [vibely-frontend-henna.vercel.app](https://vibely-frontend-henna.vercel.app/)

## ✨ Key Features
* **User Authentication:** Secure login and registration system using JWT (JSON Web Tokens).
* **CRUD Operations:** Users can create, read, update, and delete their own posts.
* **Media Uploads:** Integrated image uploading functionality for posts.
* **Responsive Design:** Optimized for both mobile and desktop views.
* **Protected Routes:** Dashboard and specific actions are protected by authentication middleware.

## 🛠️ Tech Stack
**Frontend:**
* React.js (Vite)
* Tailwind CSS (for styling)
* Axios (for API requests)
* React Router DOM (for routing)
* Deployed on **Vercel**

**Backend:**
* Node.js & Express.js
* JSON Web Token (JWT) for secure auth
* Multer (for handling multipart/form-data)
* Deployed on **Render**

**Database:**
* PostgreSQL (Hosted securely on **Aiven**)

## 🚀 How to Run Locally

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/YourUsername/vibely-frontend.git
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add your backend API URL:
\`\`\`env
VITE_API_URL=http://localhost:5000
\`\`\`

### 4. Start the development server
\`\`\`bash
npm run dev
\`\`\`
