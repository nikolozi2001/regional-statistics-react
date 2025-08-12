# Georgian Regional Statistics Portal

A React-based web application for displaying regional statistics of Georgia, similar to the National Statistics Office portal. The application features an interactive map, statistical data visualization, and detailed regional information.

## Project Structure

```
regional-statistics-react/
├── frontend/          # React Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   └── ...
└── backend/           # Node.js Express backend
    ├── server.js      # Main server file
    ├── database.sql   # Database schema
    └── ...
```

## Features

- **Interactive Map**: Clickable Georgian regions map with color-coded visualization
- **Statistics Dashboard**: Key statistics including population, area, GDP growth, unemployment, etc.
- **Regional Details**: Detailed view for each region
- **Responsive Design**: Mobile-friendly interface using Material-UI
- **Bilingual Support**: Georgian and English language support
- **MySQL Database**: Backend with structured regional data

## Technologies Used

### Frontend
- React 18 with Vite
- Material-UI (MUI) for UI components
- React Router for navigation
- Leaflet/React-Leaflet for mapping
- Axios for API calls
- Styled Components for custom styling

### Backend
- Node.js with Express
- MySQL2 for database connectivity
- CORS for cross-origin requests
- dotenv for environment configuration

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL Server
- Git

### Database Setup

1. Install and start MySQL server
2. Create the database and tables:
   ```sql
   -- Run the commands from backend/database.sql
   mysql -u root -p < backend/database.sql
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   # Copy .env file and update with your MySQL credentials
   cp .env.example .env
   # Edit .env file with your database credentials
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## API Endpoints

- `GET /api/test` - Test API connection
- `GET /api/regions` - Get all regions
- `GET /api/regions/:id/statistics` - Get statistics for a specific region
- `GET /api/statistics` - Get all statistics with region names

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=regional_statistics
PORT=5000
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Data Structure

The application displays the following regional statistics:
- Population count
- Area in square kilometers
- GDP growth rate
- Unemployment rate
- Agriculture percentage
- Urban population percentage
- Number of registered enterprises

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Screenshots

The application recreates the visual style of the Georgian National Statistics Office portal with:
- Georgian map visualization
- Statistical indicators in Georgian language
- Government color scheme and branding
- Responsive grid layout for statistics

## Future Enhancements

- Real-time data updates
- Advanced filtering and sorting
- Data export functionality
- Historical data visualization
- Multi-language support expansion
- Advanced mapping features with GeoJSON
