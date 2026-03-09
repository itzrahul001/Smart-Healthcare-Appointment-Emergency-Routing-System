🏥 Smart Healthcare Appointment + Emergency Routing System

A full-stack intelligent healthcare platform built using Spring Boot and React that enables smart appointment booking, real-time hospital bed tracking, emergency routing, medical record storage, and AI-powered prescription scanning.

🚀 Problem Statement

In emergency situations, patients struggle to:

Find hospitals with available beds

Book doctors quickly

Navigate to the nearest facility

Store and manage medical records

Digitize handwritten prescriptions

This system solves these real-world healthcare challenges with a scalable and intelligent solution.

🌟 Key Features
🔐 1. Secure Authentication

Role-based login (Patient / Doctor / Admin)

JWT-based authentication

Protected routes & API security

🏥 2. Hospital & Bed Management

Live hospital bed availability

Admin can update total & available beds

Location stored using latitude & longitude

Real-time bed tracking

👨‍⚕️ 3. Doctor Management

Add doctors by specialization

Assign doctors to hospitals

Manage availability slots

Filter doctors by expertise

📅 4. Appointment Booking System

View available doctors

Book / Cancel appointments

View appointment history

Appointment status tracking

🚑 5. Emergency Routing System

Detect user location

Calculate nearest hospital with available beds

Route visualization using Google Maps

Optimized nearest-hospital algorithm (Haversine Formula)

📁 6. Medical Record Storage

Upload medical reports

Secure cloud file storage

Maintain patient record history

🧠 7. AI-Powered Prescription Scanner

Upload handwritten prescription image

OCR text extraction using Tesseract

Store extracted prescription data in database

🛠 Tech Stack
🔙 Backend

Java 21

Spring Boot

Spring Security (JWT)

Spring Data JPA (Hibernate)

MySQL

Maven

🎨 Frontend

React (Vite)

Axios

React Router

Material UI / Tailwind CSS

☁️ Integrations

Google Maps API

Cloudinary (File Storage)

Tesseract OCR (Prescription Scanning)

🏗 Architecture

The backend follows a clean layered architecture:

Controller
   ↓
Service
   ↓
Repository
   ↓
Database


Includes:

DTO layer

Global Exception Handling

Role-based Authorization

Clean code principles

🗂 Database Schema
User

id

name

email

password

role (PATIENT / DOCTOR / ADMIN)

Hospital

id

name

location

latitude

longitude

totalBeds

availableBeds

Doctor

id

name

specialization

hospital_id

Appointment

id

patient_id

doctor_id

date

time

status

MedicalRecord

id

patient_id

fileUrl

extractedText

uploadDate

📸 System Flow

User registers/logs in

Patient books appointment

Admin manages hospitals & bed availability

Emergency button finds nearest hospital

Route displayed on map

Prescription scanned & digitized

Medical history stored securely

⚡ Installation Guide
Backend Setup
git clone <repo-url>
cd backend
mvn clean install
mvn spring-boot:run


Configure application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/healthcare_db
spring.datasource.username=root
spring.datasource.password=yourpassword
jwt.secret=yourSecretKey

Frontend Setup
cd frontend
npm install
npm run dev

🌍 Deployment

Backend → Railway / Render

Frontend → Netlify / Vercel

Use environment variables for:

JWT secret

Database credentials

Google Maps API key

Cloudinary credentials

📊 Why This Project Stands Out

✔ Real-world healthcare problem
✔ Emergency optimization algorithm
✔ AI-powered OCR integration
✔ Secure JWT authentication
✔ Role-based access control
✔ Scalable architecture
✔ Cloud deployment ready

This is not just a CRUD app — it is a real-world intelligent healthcare system.

🎯 Future Enhancements

AI Symptom Checker

SMS notifications for appointments

Email reminders

Hospital load prediction

Payment integration

Microservices architecture

Docker containerization

👨‍💻 Author

Rahul Yadav
Java Full Stack Developer | Aspiring AI Engineer

⭐ If You Like This Project

Give it a ⭐ on GitHub and feel free to contribute!