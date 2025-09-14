# 🎥 Video Proctoring System
An AI-Powered Video proctoring system that monitors candidate focus during interviews, detects suspicious behavior, and generates integrity reports for administrators.  

## 📦 Features
- **Authentication**
  - Candidate Signup & Login
  - Admin Login
- **Candidate Interview**
  - Face detection
  - Focus monitoring:
    - No face detected for >10s
    - Looking away for >5s
    - Multiple faces detected
  - Detection logs shown live
- **Admin Dashboard**
  - View all candidate sessions
  - Open individual session reports
  - Download proctoring reports as PDF
- **Reporting**
  - Candidate details (name, email)
  - Interview duration
  - Number & type of violations
  - Final Integrity Score = `100 – deductions`

## ⚙️ Tech Stack
- **Frontend**: React (Vite), CSS  
- **Backend**: Node.js, Express.js, JWT Authentication  
- **Database**: MongoDB Atlas (Mongoose)  
- **AI Models**: Mediapipe Face Detection  
- **PDF Reports**: jsPDF + jspdf-autotable  


## 🚀 Installation & Setup

### 1️⃣ Clone Repository
git clone https://github.com/your-username/focus-detection-proctoring.git
cd focus-detection-proctoring

2️⃣ Backend Setup
cd server
npm install

Create .env inside server/:
PORT=5000
MONGO_URI=mongodb+srv://videoproctering:videoproctering123@focusproctoring.qt7mkhc.mongodb.net/?retryWrites=true&w=majority&appName=focusProctoring
JWT_SECRET=8fKz!3R@1sP9uQ^5LwXz#7jBnE$2rT&6hY*0kM!dQv34tfr

Run backend:
npm run dev
👉 Backend will start at: http://localhost:5000

3️⃣ Frontend Setup
cd client
npm install

Run frontend:
npm run dev
👉 Frontend will start at: http://localhost:5173


🧑‍💻 Usage
Candidate Flow
  Signup / Login
  New users → Signup
  Existing users → Login
  ( for candidate - do register )
Start Interview
  Click "Start Interview"
  Camera turns on
  Logs appear in real time
End Interview
  Click "End Interview"
  Session ends
  Report is generated to the admin

Admin Flow
  Login as Admin
  Use admin credentials
  ( for admin - email : admin@test.com, password : admin )
Dashboard
  View all sessions (list of candidates & timings)
Reports
  Open any session
  View violations, duration, and integrity score
  Download PDF report

📑 Sample Proctoring Report
  Generated PDF contains:
    Candidate Name & Email
    Interview Duration
    Start & End Time
    List of Violations (time-stamped)
    Final Integrity Score


  📹 Demo
      🌐 Live link : https://videoproctoring-frontend.onrender.com  ( access webiste from here )
      ⚙️ backend link : https://videoproctoring-system.onrender.com
      👤 Candidate → Register via Signup
      🛡️ Admin → Login with:
            Email: admin@test.com
            Password: admin


  👨‍💻 Author
Developed by Praveen Kumar 🚀
