# 🏥 Smart Healthcare Appointment + Emergency Routing System

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![JavaVersion](https://img.shields.io/badge/Java-21-orange.svg)
![SpringBoot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)

A full-stack, intelligent healthcare platform built using **Java 21, Spring Boot, and React**. It enables smart appointment booking, real-time hospital bed tracking, emergency routing via Google Maps, secure medical record storage on Cloudinary, and AI-powered handwritten prescription scanning using OCR.

## 🚀 Problem Statement

In emergency situations, patients struggle to:
- Find hospitals with available beds
- Book doctors quickly
- Navigate to the nearest facility
- Digitize handwritten prescriptions
- Store and manage medical records securely

This system solves these real-world healthcare challenges with a scalable, modern, and intelligent solution.

---

## 🌟 Key Features

### 🔐 1. Secure Role-Based Authentication
- Dedicated portals for **Patients, Doctors, and Admins**.
- Secured using **JSON Web Tokens (JWT)**.
- Protected API routes and role-based access control.

### 🏥 2. Hospital & Bed Management
- **Live tracking** of hospital bed availability.
- Admin dashboard to update total & available beds in real-time.
- Location coordinates (latitude & longitude) stored for emergency routing.

### 👨‍⚕️ 3. Doctor Management
- Admins can add doctors by specialization and assign them to hospitals.
- Patients can filter doctors by expertise and view their availability slots.

### 📅 4. Appointment Booking System
- Seamlessly book or cancel appointments.
- Real-time appointment status tracking.
- View comprehensive appointment history.

### 🚑 5. Emergency Routing System
- Accurately detects user location.
- Calculates the **nearest hospital with available beds** using the **Haversine Formula**.
- Visualizes the optimized route directly on **Google Maps**.

### 📁 6. Medical Record Storage
- Secure cloud storage for medical reports using **Cloudinary**.
- Patients can upload and maintain a complete medical history.

### 🧠 7. AI-Powered Prescription Scanner
- Upload images of handwritten prescriptions.
- Extracts text automatically using **Tesseract OCR (Tess4J)**.
- Extracted prescription data is stored securely in the database.

---

## 🛠 Tech Stack

### 🔙 Backend
- **Java 21**, **Spring Boot 3.2.3**
- **Spring Security** & **JJWT 0.11.5** (Authentication & Authorization)
- **Spring Data JPA** & **Hibernate** (ORM)
- **MySQL** (Database)
- **Tess4J** (Tesseract OCR for Java)
- **Cloudinary HTTP44** (Cloud Storage)
- **Spring Dotenv** (Environment Variable Management)

### 🎨 Frontend
- **React 18** (Vite ^5.2.0)
- **React Router DOM** (Routing)
- **Tailwind CSS v4** & **Material UI** (Styling & Components)
- **Axios** (API Requests)
- **Lucide React** (Icons)
- **React Toastify** (Notifications)

---

## 🏗 Architecture

The backend follows a clean, industry-standard **Layered Architecture**:

```
Controller (API Endpoints)
   ↓
Service (Business Logic)
   ↓
Repository (Data Access Layer)
   ↓
Database (MySQL)
```

**Includes:**
- DTO (Data Transfer Object) layer for secure responses using ModelMapper.
- Global Exception Handling using `@ControllerAdvice`.
- Adherence to clean code and SOLID principles.

---

## 📸 System Flow

1. Patient/Doctor registers and logs in securely.
2. Patient searches for a doctor and books an appointment.
3. Doctor/Admin manages operations.
4. **Emergency:** Patient clicks the emergency button → System finds nearest hospital → Route is displayed on Google Maps.
5. Patient uploads a handwritten prescription → OCR digitizes it → Saved to Medical Records.

---

## ⚡ Installation Guide

### Prerequisites
- JDK 21
- Node.js & npm
- MySQL Server
- Tesseract OCR installed on your system
- Cloudinary Account
- Google Maps API Key

### 1️⃣ Backend Setup
```bash
git clone <repo-url>
cd backend
mvn clean install
```

Create a `.env` file in the `backend/` directory root and add the following properties:
```env
DB_URL=jdbc:mysql://localhost:3306/smart_healthcare
DB_USERNAME=root
DB_PASSWORD=your_db_password
JWT_SECRET=YourSuperSecretKeyForJWTThatIsLongEnough
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the application:
```bash
mvn spring-boot:run
```

### 2️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Why This Project Stands Out

- ✔ **Solves a Real-World Healthcare Problem**
- ✔ **Emergency Optimization Algorithms** (Haversine Formula)
- ✔ **AI Integration** (Tesseract OCR)
- ✔ **Cloud Storage Integration** (Cloudinary)
- ✔ **Modern Full-Stack Paradigm** (Java 21 / React 18 / Tailwind v4)

---

## 👨‍💻 Author

**Rahul Yadav**  
Java Full Stack Developer | Aspiring AI Engineer

⭐ If you found this project helpful, give it a **⭐ on GitHub**!