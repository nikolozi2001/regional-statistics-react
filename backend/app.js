const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || '192.168.0.139',
  user: process.env.DB_USER || 'nkachibaia',
  password: process.env.DB_PASSWORD || '123',
  database: process.env.DB_NAME || 'geostat_regions_v2'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Get all regions
app.get('/api/regions', (req, res) => {
  const query = 'SELECT * FROM regions WHERE ID > 0'; // Exclude negative IDs
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching regions:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Get statistics for a specific region
app.get('/api/regions/:id/statistics', (req, res) => {
  const regionId = req.params.id;
  const query = 'SELECT * FROM regions WHERE ID = ?';
  
  db.query(query, [regionId], (err, results) => {
    if (err) {
      console.error('Error fetching statistics:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Get all statistics with formatted data
app.get('/api/statistics', (req, res) => {
  const query = `
    SELECT 
      ID as region_id,
      Name as region_name_ge,
      NameEN as region_name,
      CAST(REPLACE(REPLACE(Population, ' ', ''), '.', '') AS DECIMAL(10,1)) * 1000 as population,
      CAST(REPLACE(REPLACE(Area, ' ', ''), '.', '') AS DECIMAL(10,2)) as area_sq_km,
      CAST(REPLACE(GDP, ' ', '') AS DECIMAL(10,2)) as gdp_million,
      CAST(REPLACE(UnemploymentRate, ' ', '') AS DECIMAL(5,2)) as unemployment_rate,
      CAST(REPLACE(EmploymentRate, ' ', '') AS DECIMAL(5,2)) as employment_rate,
      CAST(REPLACE(RegistredEntities, ' ', '') AS DECIMAL(10,0)) as registered_enterprises
    FROM regions 
    WHERE ID > 0 AND Population != '-' AND Area != '-'
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching all statistics:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at: http://${process.env.DB_HOST}:${PORT}/api/test`);
});
