const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

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
  database: process.env.DB_DATABASE || 'geostat_regions_v2'
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

// Get main info with language support
app.get('/api/mainInfo', (req, res) => {
  const lang = req.query.lang || "ge";
  const titleColumn = lang === "en" ? "title_en" : "title_ge";
  
  console.log(`GET /api/mainInfo - Language: ${lang}`);
  
  const query = `SELECT id, title_ge, title_en, data FROM main_info`;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching main info:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    // Transform the data to use the appropriate language title
    const transformedRows = results.map(row => ({
      id: row.id,
      title: row[titleColumn] || row.title_ge || row.title_en || 'No title available',
      title_ge: row.title_ge,
      title_en: row.title_en,
      data: row.data
    }));

    console.log(`Successfully retrieved ${results.length} main_info records for language: ${lang}`);
    
    res.status(200).json({
      success: true,
      language: lang,
      count: transformedRows.length,
      data: transformedRows
    });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at: http://192.168.1.27:${PORT}/api/test`);
});
