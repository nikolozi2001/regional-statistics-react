# Regional Statistics React Application

A modern web application for displaying statistical information about Georgia's regions and municipalities, featuring a bilingual interface (Georgian/English) and interactive data visualization.

## 🌟 Features

- **Multilingual Support**: Seamless switching between Georgian and English
- **URL-based Language Routing**: Clean URLs with language prefixes (`/ge`, `/en`)
- **Responsive Design**: Mobile-first approach with SCSS styling
- **Modern React Architecture**: Built with React 19, Vite, and modern hooks
- **Professional UI/UX**: Material-UI components with custom styling
- **Interactive Components**: Maps, charts, and data visualizations
- **Backend API**: Node.js/Express server with MySQL integration

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Material-UI** - Component library
- **SCSS/Sass** - Advanced CSS preprocessing
- **Axios** - HTTP client for API calls
- **Leaflet** - Interactive maps
- **Recharts** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **Winston** - Logging

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MySQL (for backend)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/regional-statistics-react.git
   cd regional-statistics-react
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database credentials
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173/`
   - Backend API: `http://localhost:3001/`

### Individual Setup

#### Frontend Only
```bash
cd frontend
npm install
npm run dev
```

#### Backend Only
```bash
cd backend
npm install
npm run dev
```

## 🌐 Language System

The application supports Georgian and English with automatic URL routing:

- **Georgian (Default)**: `/ge/` - ქართული ინტერფეისი
- **English**: `/en/` - English interface

### Language Context Usage

```jsx
import { useLanguage } from './hooks/useLanguage';

function Component() {
  const { language, changeLanguage, isEnglish } = useLanguage();
  
  return (
    <div>
      <p>{isEnglish ? 'Hello' : 'გამარჯობა'}</p>
      <button onClick={() => changeLanguage('EN')}>
        Switch to English
      </button>
    </div>
  );
}
```

## 📁 Project Structure

```
regional-statistics-react/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Header.jsx   # Main header with language switcher
│   │   │   └── Header.scss  # Header styling
│   │   ├── contexts/        # React contexts
│   │   │   ├── LanguageContext.js   # Context definition
│   │   │   └── LanguageContext.jsx  # Provider component
│   │   ├── hooks/           # Custom hooks
│   │   │   └── useLanguage.js       # Language hook
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   └── Dashboard.scss       # Dashboard styling
│   │   └── services/        # API services
│   │       └── api.js       # API client
│   ├── public/              # Static assets
│   │   └── geostat-logo.svg # GEOSTAT logo
│   └── package.json
├── backend/                  # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Express middleware
│   ├── routes/              # API routes
│   └── package.json
└── package.json             # Root package.json
```

## 🎨 Styling & Design

### SCSS Architecture
- **Component-based styling**: Each component has its own SCSS file
- **Responsive design**: Mobile-first approach with breakpoints
- **Typography**: Georgian (Noto Sans Georgian) and English (Inter) fonts
- **Color scheme**: Professional blue gradient with Material Design principles

### Header Design
- **Left**: GEOSTAT logo
- **Center**: Bilingual title
- **Right**: Language switcher (ქარ | ENG)

## 🔧 Available Scripts

### Root Level
- `npm run install-all` - Install all dependencies
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm run frontend` - Start frontend only
- `npm run backend` - Start backend only

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start with nodemon
- `npm start` - Start production server

## 🌍 Deployment

### Frontend (Netlify/Vercel)
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

### Backend (Railway/Render)
```bash
cd backend
# Set environment variables
# Deploy with your preferred service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🔮 Roadmap

- [ ] Interactive map with region selection
- [ ] Data visualization charts
- [ ] Export functionality (PDF, Excel)
- [ ] User authentication
- [ ] Admin dashboard
- [ ] API documentation
- [ ] Unit and integration tests
- [ ] Docker containerization

---

**Built with ❤️ for Georgia's digital transformation**
