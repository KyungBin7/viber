# 1. System Architecture
Since this project is a portfolio website where dynamic and visual content is crucial, we will adopt a **Static Site Generation (SSG) structure based on a Single Page Application (SPA)**.
* **Client-Side (Frontend):** Handles dynamic animations and interactions within the user's browser. `react-bits` components will play this role.
* **Server-Side (Backend):** Without a complex backend server, all pages will be generated as HTML files at build time. This provides fast loading speeds and stable service.
