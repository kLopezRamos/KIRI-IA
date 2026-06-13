# Kiri AI

<p align="center">
  <strong>An intelligent mobile application for object detection and language learning through image analysis.</strong>
</p>

<p align="center">
  <img src="./assets/kiri-demo.gif" alt="Kiri AI Demo" width="300" />
</p>

---



**Kiri AI** is a mobile application designed to bridge the gap between computer vision and language learning. Unlike traditional AI applications that rely on heavy cloud infrastructure, Kiri AI performs **100% local inference**. By processing everything directly on the device, the application guarantees absolute user privacy, zero server latency, and offline functionality, making cutting-edge AI accessible anytime, anywhere.

### Key Features
*  **Local Object Detection:** Instantly identifies objects in real-time or from gallery images.
*  **Contextual Language Learning:** Generates vocabulary, translations, and contextual language exercises based on the detected objects.
*  **Privacy-First Architecture:** No user data, images, or prompts ever leave the device.
*  **High Performance & Low Latency:** Optimized local model execution for quick response times without API dependencies.

---

##  Tech Stack

* **Frontend & Mobile Framework:** React Native / Expo (TypeScript)
* **Local AI Inference:** Microsoft Florence-2 (Optimized for edge devices)
* **Data Extraction:** Structured data parsing directly from local model outputs.

---

##   Highlights

* **Edge AI Integration:** Integrated the **Microsoft Florence-2** vision-language model to run directly on-device, bypassing external API bottlenecks and usage fees.
* **Structured Data Parsing:** Implemented custom post-processing to transform raw local model text outputs into clean, structured JSON data to dynamically render the UI and learning modules.

---

##  Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
* Node.js (v18 or higher recommended)
* Expo CLI (`npm install -g expo-cli`)
* A physical device with the Expo Go app or an emulator (Android/iOS)

### Step-by-Step Guide

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/kiri-ai.git](https://github.com/your-username/kiri-ai.git)
   cd kiri-ai

2. Install dependencies:
   ```bash
   npm install
3. Start the development server:
   ```bash
   npx expo start
   
