# 🚨 PulstriX: Intelligent Emergency Response System

**Live Website**: [https://pulstrix.vercel.app](https://pulstrix.vercel.app)
**For Responder Login**: Use RESPONDER2025 as the access code

![PulstriX Banner](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![Python](https://img.shields.io/badge/Python-3.9+-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb)

**PulstriX** is a next-generation emergency incident management platform designed to bridge the gap between citizens and emergency response teams. It leverages **Artificial Intelligence** to automate incident verification, deduplication, and priority classification, ensuring that help reaches where it's needed most, faster.

---

## 📚 Table of Contents

- [🌟 Key Features](#-key-features)
- [🏗️ System Architecture](#-system-architecture)
- [🔄 Data Flow & Logic](#-data-flow--logic)
- [🛠️ Technology Stack](#-technology-stack)
- [🚀 Getting Started](#-getting-started)
- [📂 Project Structure](#-project-structure)
- [🤖 AI & ML Pipeline](#-ai--ml-pipeline)
- [👥 Contributors](#-contributors)

---

## 🌟 Key Features

### 1. **For Citizens (Reporters)**
- **Instant Reporting**: Report incidents with location, description, and images.
- **Real-time Tracking**: Track the status of your report from "Unverified" to "Resolved".
- **Anonymous Reporting**: Option to report without revealing identity.
- **Live Map**: View active incidents in your vicinity.

### 2. **For Responders (Emergency Services)**
- **Smart Dashboard**: View incidents assigned specifically to your unit.
- **AI Verification**: Auto-detection of duplicate reports (text & image) to reduce noise.
- **Priority Tagging**: AI-driven severity classification (High/Medium/Low).
- **Resource Management**: Assign tasks to idle employees or forward reports to nearby responders if overloaded.
- **Route Optimization**: Integration with LocationIQ for travel time estimation.

### 3. **For Employees (Field Units)**
- **Task Management**: Accept or reject assigned tasks.
- **Status Updates**: Real-time status changes (Idle/Busy).
- **Navigation**: Location-based task details.

---

## 🏗️ System Architecture

PulstriX follows a **Microservices-inspired Architecture** where the main application handles the UI and business logic, while specialized Python services handle heavy AI/ML computations.

\`\`\`mermaid
graph TD
    subgraph "Client Layer"
        User[Citizen]
        Resp[Responder]
        Emp[Employee]
    end

    subgraph "Application Layer (Next.js)"
        API[Next.js API Routes]
        Auth[Auth System]
        Socket[Web Push Notifications]
    end

    subgraph "Data Layer"
        DB[(MongoDB)]
        Cloud[Cloudinary Storage]
    end

    subgraph "Intelligence Layer (Python Microservices)"
        ML1[Priority Classifier (LLM)]
        ML2[Text Deduplication]
        ML3[Image Deduplication]
    end

    User -->|Submit Report| API
    Resp -->|Manage Incidents| API
    Emp -->|Update Status| API
    
    API -->|Store Data| DB
    API -->|Upload Media| Cloud
    
    API -->|Verify & Classify| ML1
    API -->|Check Duplicates| ML2
    API -->|Check Image Duplicates| ML3
    
    API -->|Notify| Socket
    Socket -->|Push Alert| Resp
    Socket -->|Push Alert| Emp
    Socket -->|Status Update| User
\`\`\`

---

## 🔄 Data Flow & Logic

### 1. Incident Reporting Lifecycle

\`\`\`mermaid
sequenceDiagram
    participant User
    participant System
    participant AI_Engine
    participant Database
    participant Responder

    User->>System: Submits Report (Text + Image + Loc)
    System->>Database: Save Initial Report (Status: Unverified)
    
    par AI Verification
        System->>AI_Engine: Check Text Similarity
        System->>AI_Engine: Check Image Similarity
        System->>AI_Engine: Classify Severity (LLM)
    end
    
    AI_Engine-->>System: Verification Results
    
    alt Is Duplicate
        System->>Database: Mark as Resolved (Duplicate)
        System->>Database: Increment Counter on Original
    else Is Unique
        System->>Database: Update Severity & Status
        System->>System: Find Nearest Responder
        System->>Database: Assign Responder
        System->>Responder: Send Push Notification
    end
\`\`\`

### 2. Resource Allocation Flow

\`\`\`mermaid
flowchart TD
    A[Responder Receives Incident] --> B{Available Employees?}
    B -- Yes --> C[Select Idle Employee]
    C --> D[Assign Task]
    D --> E[Notify Employee]
    
    B -- No --> F[Check Nearby Responders]
    F --> G{Responders Found?}
    G -- Yes --> H[Calculate Travel Times]
    H --> I[Forward to Best Match]
    I --> J[Notify New Responder]
    
    G -- No --> K[Queue Incident / Alert Admin]
\`\`\`

---

## 🛠️ Technology Stack

### **Frontend & Backend (Fullstack)**
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Maps**: Leaflet / React-Leaflet
- **State Management**: React Context API
- **Notifications**: Web Push (VAPID)

### **Database & Storage**
- **Database**: MongoDB (Mongoose ODM)
- **Image Storage**: Cloudinary

### **AI & Machine Learning (Python Services)**
- **Framework**: FastAPI
- **Libraries**: 
  - \`PyTorch\` & \`Torchvision\` (Image Embeddings)
  - \`Transformers\` (Hugging Face)
  - \`Scikit-learn\` (Similarity Metrics)
  - \`Pandas\` & \`NumPy\` (Data Processing)

### **External APIs**
- **LocationIQ**: Geocoding, Reverse Geocoding, and Travel Time Matrix.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB Instance
- Cloudinary Account
- LocationIQ API Key

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/apurbahalderr/PulstriX.git
cd PulstriX
\`\`\`

### 2. Environment Setup
Create a \`.env\` file in the root directory:
\`\`\`env
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/pulstrix

# Authentication
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
ACCESS_CODE=responder_access_code_123

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Location Services
NEXT_PUBLIC_LOCATIONIQ_API_KEY=your_locationiq_key
LOCATIONIQ_API_KEY=your_locationiq_key

# ML Service URLs (Local)
PRIORITY_ML_URL=http://localhost:8002
TEXT_DEDUP_ML_URL=http://localhost:8003
IMAGE_DEDUP_ML_URL=http://localhost:8001
\`\`\`

### 3. Install Dependencies

**Frontend/Backend:**
\`\`\`bash
npm install
\`\`\`

**Python Microservices:**
Navigate to each service folder and install requirements.

*Incident Dedup (Image):*
\`\`\`bash
cd incident_dedup
pip install -r requirements.txt
\`\`\`

*Priority Classification:*
\`\`\`bash
cd ../priority_classification
pip install -r requirements.txt
\`\`\`

### 4. Run the Application

**Start Python Services (in separate terminals):**
\`\`\`bash
# Terminal 1
cd incident_dedup
python app.py

# Terminal 2
cd priority_classification
python app.py
\`\`\`

**Start Next.js App:**
\`\`\`bash
# Terminal 3
npm run dev
\`\`\`

Visit \`http://localhost:3000\` to access the platform.

---

## 📂 Project Structure

\`\`\`
PulstriX/
├── app/                        # Next.js App Router Pages & API
│   ├── api/                    # Backend API Routes
│   ├── dashboard/              # User Dashboard
│   ├── responder/              # Responder Dashboard
│   └── ...
├── components/                 # Reusable React Components
│   ├── map/                    # Map Components
│   ├── incidents/              # Incident Cards & Forms
│   └── ...
├── context/                    # React Context (Auth)
├── models/                     # Mongoose Schemas (User, Report, etc.)
├── utils/                      # Helper Functions (DB Connect, ML Client)
├── incident_dedup/             # Python Service: Image Deduplication
├── priority_classification/    # Python Service: LLM Priority Classifier
├── text_dedup/                 # Python Service: Text Deduplication
└── public/                     # Static Assets
\`\`\`

---

## 🤖 AI & ML Pipeline

### **1. Priority Classification**
- **Input**: Incident Description, Type.
- **Model**: Uses a lightweight LLM or Zero-shot classifier via Hugging Face API.
- **Output**: Severity Score (High, Medium, Low).

### **2. Text Deduplication**
- **Technique**: TF-IDF / Cosine Similarity.
- **Logic**: Compares new report description with active reports within a 2km radius.
- **Threshold**: > 0.8 similarity triggers a duplicate flag.

### **3. Image Deduplication**
- **Technique**: CNN-based Feature Extraction (ResNet/EfficientNet).
- **Logic**: Generates embeddings for uploaded images and calculates Euclidean distance against recent report images.

---

## 👥 Contributors

Built with ❤️ by **Team HackerEyes**

- **Apurba Halder** - Full Stack & System Architecture
- **Anshu Kumar** - Backend & ML Integration
- **Rashika Shah** - Frontend & UI/UX
- **Ayush Kumar Anand** - ML Services & Data Logic
- **Dristi Singh** - Research & Documentation

---

*PulstriX - Saving seconds, saving lives.*
