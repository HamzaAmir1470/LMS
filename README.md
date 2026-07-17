# DevLearn - Full-Stack Learning Management System (LMS)

DevLearn is a modern, full-stack Learning Management System built using **Next.js** and **TypeScript**. The application features two distinct, role-based workflows: an optimized student learning experience and a centralized, real-time control panel for administrators.

## 🚀 Live Demo & Repository
* **Live Application:** [https://lms-frontend-hazel-xi.vercel.app/](https://lms-frontend-hazel-xi.vercel.app)

---

## 🔥 Key Features

### 🎓 Student Experience (User Dashboard)
* **Personalized Account Tracking:** Dedicated user profiles to monitor enrolled courses and individual milestones.
* **Dynamic Course Directories:** Richly categorized course lists with fluid client-side navigation.
* **Performance Optimized:** Localized asset caching and static structural generation for exceptionally fast load times.

### 🛠️ Administrative Control Center (Admin Dashboard)
* **Role-Based Access Control (RBAC):** Strict permissions dividing student access from administrative privileges.
* **Centralized Data Management:** Full CRUD capabilities for managing courses, enrollments, user statuses, and reviews.
* **Real-Time Operation Suite:** Powered by **Socket.io** to bridge client-server boundaries instantly.

### ⚡ Real-Time Notification Engine
* **Bi-directional WebSockets:** Persistent socket connection listening for platform events.
* **Instant Audio-Visual Alerts:** When a student places a new order, posts a query, or submits a review, the Admin Dashboard receives an immediate visual push notice accompanied by an audible ring notification sound.

---

## 🛠️ Technical Stack

* **Frontend Framework:** Next.js (React)
* **Language:** TypeScript (Strict type-safety across structural components and socket event payloads)
* **Real-Time Layer:** Socket.io-client / Socket.io
* **Deployment Platform:** Vercel

---

## ⚙️ Installation & Local Setup

Follow these steps to set up and run the development server locally:

### 1. Clone the Repository
```bash
git clone https://github.com/HamzaAmir1470/LMS
cd devlearn
