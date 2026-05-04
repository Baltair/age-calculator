# ✨ Modern Age Calculator Dashboard

A premium, interactive, and highly customizable Age Calculator built with modern web technologies and deployed on Cloudflare Workers.

![Age Calculator Preview](public/favicon.png)

## 🌟 Features

-   **⏱️ Real-time Exact Age**: Tracks your age down to the second with live updates.
-   **🎂 Birthday Countdown**: Visual progress bar showing exactly how long until your next big day.
-   **📊 Total Life Stats**: See your life summarized in total years, months, days, hours, and even seconds.
-   **🔮 Birth Insights**: Automatically calculates your Western Zodiac, Chinese Zodiac, and Birthstone.
-   **🎨 Dynamic UI**: Beautiful glassmorphism design with animated background blobs and premium typography.
-   **⚙️ Customizable Dashboard**: 
    -   **Toggle Sections**: Show only what matters to you.
    -   **Drag & Drop**: Reorder sections using the integrated `Sortable.js` library.
    -   **Persistence**: Your layout and preferences are saved locally.
-   **🎉 Celebration Mode**: Interactive confetti animations when you reach milestones or interact with the dashboard.
-   **🛰️ Edge Powered**: Built on Cloudflare Workers for lightning-fast delivery and server-side observability.

## 🚀 Tech Stack

-   **Frontend**: Vanilla JavaScript, HTML5, CSS3 (Custom Properties, Flexbox, Grid)
-   **Backend**: Cloudflare Workers (Request handling & Observability)
-   **Libraries**: 
    -   `Sortable.js`: For the drag-and-drop dashboard experience.
    -   `canvas-confetti`: For the celebratory animations.
-   **Observability**: Server-side geolocation logging to track visitor regions and data center performance.

## 🛠️ Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/)
-   [Cloudflare Account](https://dash.cloudflare.com/sign-up) (for deployment)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd age-calculator
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Local Development

Run the development server using Wrangler:

```bash
npm run dev
```

The application will be available at `http://localhost:8787`.

### Deployment

Deploy to Cloudflare Workers with a single command:

```bash
npm run deploy
```

## 📁 Project Structure

```text
├── public/              # Static assets (HTML, CSS, Client-side JS)
│   ├── index.html       # Main entry point
│   ├── style.css        # Premium styling & glassmorphism
│   ├── script.js        # Core logic & interactivity
│   └── ...              # Images and libraries
├── src/                 # Worker source code
│   └── index.js         # Cloudflare Worker entry point & Observability
├── wrangler.toml        # Cloudflare configuration
├── package.json         # Scripts and dependencies
└── .gitignore           # Ignored files for Git
```

## 📈 Observability

The Cloudflare Worker includes built-in logging for:
-   Visitor City & Country
-   Request Path & Method
-   Cloudflare Data Center (Colo) code

Logs can be viewed in real-time using:
```bash
npx wrangler tail
```

## 📄 License

This project is licensed under the ISC License.

---
Built with ❤️ for a better age-tracking experience.