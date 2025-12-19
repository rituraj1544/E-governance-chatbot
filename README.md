# 🏛️ E-Governance Chatbot (React + Node.js + MongoDB)

An AI-powered chatbot platform that helps citizens access government scheme information, FAQs, document requirements, and guidance for services like Aadhaar, PAN, PM-Kisan, Scholarships, etc.  
The system includes:

- A **Chatbot Interface** for citizens.
- An **Admin Dashboard** for managing schemes, FAQs, and monitoring chats.
- A **Backend API** powered by Node.js + Express.
- A **MongoDB Database** for scalable storage.
- A built-in **Rule-Based NLP Engine** for intent detection.

---

## 🚀 Features

### 👤 Citizen-Side (Chatbot)
- Real-time chat interface
- Smart replies based on government schemes & FAQs
- Quick action buttons (Aadhaar, PAN, Ration Card, PM Kisan, Scholarships)
- Multi-language support (English/Hindi)
- Chat history view
- Mobile-friendly UI
- Fallback response when no match found

### 🛠 Admin-Side (Dashboard)
- Secure admin login (JWT Authentication)
- Manage Government Schemes (CRUD)
- Manage FAQs (CRUD)
- View user chat history
- Analytics for:
  - Most searched schemes
  - Popular FAQs
  - User intents
- Fully responsive dashboard design

### ⚙ Backend & NLP
- Node.js + Express REST API
- Rule-based NLP engine:
  - Keyword matching
  - FAQ matching
  - Scheme matching
- Chat history logging
- Full MongoDB integration using Mongoose

---

## 🏗️ Tech Stack

### **Frontend**
- React + Vite
- TailwindCSS (optional)
- Axios
- React Router DOM

### **Backend**
- Node.js
- Express.js
- Mongoose
- JWT
- Bcrypt
- dotenv
- CORS

### **Database**
- MongoDB Atlas

---

## 📁 Project Structure

### **Frontend**
```
/frontend
  /src
    /components
      ChatWindow.jsx
      MessageBubble.jsx
      QuickButtons.jsx
      ChatHeader.jsx
      
      AdminSidebar.jsx
      AdminNavbar.jsx
      Loader.jsx
      ProtectedRoute.jsx
      
      SchemeForm.jsx
      FAQForm.jsx

    /pages
      UserChat.jsx
      AdminLogin.jsx
      AdminDashboard.jsx
      ManageSchemes.jsx
      ManageFAQs.jsx
      ChatHistory.jsx
      Analytics.jsx

    /services
      api.js
      authService.js
      schemeService.js
      faqService.js
      chatbotService.js

    App.jsx
    main.jsx
```

---

### **Backend**
```
/backend
  server.js

  /config
    db.js

  /models
    Admin.js
    Scheme.js
    FAQ.js
    ChatHistory.js

  /controllers
    authController.js
    schemeController.js
    faqController.js
    chatbotController.js

  /routes
    authRoutes.js
    schemeRoutes.js
    faqRoutes.js
    chatbotRoutes.js

  /middleware
    authMiddleware.js

  /utils
    nlpEngine.js

  .env
```

---

## 🌐 API Overview

### **Auth**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login, returns JWT |

### **Schemes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/schemes` | Add new scheme (Admin) |
| GET | `/api/schemes` | Get all schemes |
| GET | `/api/schemes/search` | Search schemes by keyword |
| PUT | `/api/schemes/:id` | Update scheme (Admin) |
| DELETE | `/api/schemes/:id` | Delete scheme (Admin) |

### **FAQs**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/faqs` | Add FAQ (Admin) |
| GET | `/api/faqs` | List FAQs |
| GET | `/api/faqs/search` | Search FAQs |
| PUT | `/api/faqs/:id` | Update FAQ |
| DELETE | `/api/faqs/:id` | Delete FAQ |

### **Chatbot**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chatbot/query` | Sends user query → NLP → response returned |

---

## 🧠 NLP Engine Logic

1. Preprocess user query  
2. Match query with FAQ keywords  
3. If no match → check scheme keywords  
4. If still no match → fallback response  
5. Log chat in database  

This ensures fast, accurate responses without requiring heavy AI models.

---

## 🛠 Installation & Setup

### **1️⃣ Clone the Repository**
```
git clone https://github.com/your-username/e-gov-chatbot.git
cd e-gov-chatbot
```

---

## **2️⃣ Install Frontend**
```
cd frontend
npm install
npm run dev
```

---

## **3️⃣ Install Backend**
```
cd backend
npm install
npm start
```

---

## **4️⃣ Environment Variables**
Create `.env` inside `/backend`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 🚀 Running the Project

### **Run Backend**
```
cd backend
npm start
```

### **Run Frontend**
```
cd frontend
npm run dev
```

Your project will be live at:

- Frontend → http://localhost:5173  
- Backend → http://localhost:5000  

---

## 📊 Future Enhancements
- AI-powered NLP (OpenAI / Gemini / Llama integration)
- WhatsApp chatbot link (Twilio)
- Voice assistant mode
- User login + bookmark schemes
- PDF generation for scheme details
- Multi-state government scheme support

---

## 🤝 Contributing

1. Fork the project  
2. Create a new branch  
3. Commit your changes  
4. Open a pull request  

---

## 📜 License
This project is open-source and free to use for educational and government innovation purposes.

---

## ❤️ Acknowledgements
This project was created to help citizens access government services faster, easier, and smarter through technology.

```  

---


