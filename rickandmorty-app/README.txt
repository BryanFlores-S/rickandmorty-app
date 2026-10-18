# 🛸 Rick and Morty Character Catalog SPA

A lightweight, high-performance Single Page Application (SPA) built with **Spring Boot** and **Vanilla JavaScript** (Tailwind CSS) that integrates with the external [Rick and Morty API](https://rickandmortyapi.com/).

The project demonstrates front-end asynchronous state management, simulated network delay with real-time feedback, API request cancellation, and clean back-end proxy architecture.

---

## ✨ Features

- **Search with Simulated Latency:** Mandatory 4-second countdown counter and loading GIF animation for all non-empty search queries.
- **Request Abort Control:** Built-in `AbortController` mechanism to cancel pending HTTP requests on rapid user keystrokes, preventing race conditions.
- **Infinite Scrolling:** Smooth dynamic pagination powered by the browser's native `IntersectionObserver` API.
- **Detailed Modal View:** In-depth view for each character displaying status, species, gender, origin, current location, and featured episodes.
- **Spring Boot Proxy Layer:** Backend Spring Boot service utilizing `RestTemplate` to route API requests securely.
- **Fully Responsive UI:** Pinterest-inspired header, sticky search bar, and grid layouts optimized for mobile, tablet, and desktop screens.

---

## 📂 Project Structure

```plaintext
rickandmorty-app/
├── src/
│   ├── main/
│   │   ├── java/com/rickandmorty/app/
│   │   │   ├── RickandmortyAppApplication.java   # Spring Boot Main Application
│   │   │   ├── client/
│   │   │   │   └── RickAndMortyClient.java       # RestTemplate HTTP Client
│   │   │   ├── controller/
│   │   │   │   └── WebController.java            # REST Controller Proxy
│   │   │   └── model/
│   │   │       └── CharacterDto.java             # Data Transfer Objects
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/                           # Static Frontend Directory
│   │           ├── index.html                    # Main Markup File
│   │           ├── css/
│   │           │   └── styles.css                # Custom Styles & Animations
│   │           ├── js/
│   │           │   └── app.js                    # Core SPA Logic (Vanilla JS)
│   │           └── img/
│   │               └── loading.gif               # Loading State Asset
└── pom.xml