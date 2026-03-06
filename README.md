<div align="center">
  <img src="public/favicon.ico" alt="Logo" width="80" height="80">
  <h1 align="center">Cinematic 3D DevOps Portfolio</h1>
  <p align="center">
    <strong>Architecting high-availability cloud systems and automating the future of deployment.</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture">Architecture</a>
  </p>
</div>

---

## 🌌 Overview

A premium, interactive developer portfolio engineered to break the mold of static websites. Built entirely with **React Three Fiber** and **GSAP**, this portfolio delivers a cinematic, 3D-first experience tailored for Cloud Architects, DevOps Engineers, and Full Stack Developers.

This isn't just a resume—it's an interactive data center right in the browser.

## ✨ The 3D Cinematic Experience

* **Interactive Server Racks:** Hover over physical 3D server blades to engage cooling fans and dynamic LED status lights.
* **Animated CI/CD Pipeline:** A highly detailed 3D tube system visually simulating cloning, testing, building, and deploying code packets with a synchronized CRT terminal stream.
* **Cinematic Lighting & Post-Processing:** Advanced volumetric lighting, depth-of-field, and ambient glows create an immersive, dark "hacker" aesthetic.
* **Living Bento Grid:** A responsive, glassmorphic layout system that houses your trajectory, system health, and tech stack in a sleek, frosted UI.

## 🛠️ Tech Stack

This project leverages the bleeding edge of modern web development natively integrated with WebGL:

* **Framework:** React 19 + Vite
* **3D Engine:** Three.js + React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
* **Animations:** GSAP (GreenSock) & Framer Motion for buttery smooth DOM and WebGL transitions.
* **Styling:** Tailwind CSS v4 for absolute utility-first control over the frosted glass and lighting aesthetic.
* **Icons:** Lucide React

## 🚀 Getting Started

To run this data center locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/Harshb234/devops-portfolio.git
cd devops-portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📁 Repository Structure

```text
src/
├── components/
│   ├── Hero3D.jsx             # The cinematic top-level 3D container
│   ├── DeploymentPipeline3D.jsx # The 3D CI/CD animation card
│   ├── ServerRack.jsx         # Interactive 3D server models
│   ├── BentoCard.jsx          # Glassmorphic layout wrapper
│   └── ...
├── App.jsx                    # Main application assembly and Bento layout routing
├── index.css                  # Tailored utility classes and critical animations
└── main.jsx                   # React DOM Entry
```

## 📜 License

Created by Harsh Bambatkar. Open for inspiration, but please make it your own!
