-- Regional Statistics Database Schema

CREATE DATABASE IF NOT EXISTS regional_statistics;
USE regional_statistics;

-- Regions table
CREATE TABLE IF NOT EXISTS regions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    name_ge VARCHAR(100) NOT NULL, -- Georgian name
    code VARCHAR(10) UNIQUE NOT NULL,
    color VARCHAR(7) NOT NULL, -- Hex color for map
    coordinates JSON, -- GeoJSON coordinates
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Statistics table
CREATE TABLE IF NOT EXISTS statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    population INT,
    area_sq_km DECIMAL(10,2),
    gdp_growth_rate DECIMAL(5,2),
    unemployment_rate DECIMAL(5,2),
    agriculture_percentage DECIMAL(5,2),
    urban_population_percentage DECIMAL(5,2),
    registered_enterprises INT,
    year INT NOT NULL DEFAULT 2023,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
);

-- Insert sample regions (based on Georgian regions)
INSERT INTO regions (name, name_ge, code, color) VALUES
('Tbilisi', 'თბილისი', 'TB', '#FF6B6B'),
('Adjara', 'აჭარა', 'AJ', '#4ECDC4'),
('Guria', 'გურია', 'GU', '#45B7D1'),
('Imereti', 'იმერეთი', 'IM', '#96CEB4'),
('Kakheti', 'კახეთი', 'KA', '#FFEAA7'),
('Mtskheta-Mtianeti', 'მცხეთა-მთიანეთი', 'MM', '#DDA0DD'),
('Racha-Lechkhumi', 'რაჭა-ლეჩხუმი', 'RL', '#98D8C8'),
('Samtskhe-Javakheti', 'სამცხე-ჯავახეთი', 'SJ', '#F7DC6F'),
('Kvemo Kartli', 'ქვემო ქართლი', 'KK', '#BB8FCE'),
('Shida Kartli', 'შიდა ქართლი', 'SK', '#85C1E9'),
('Samegrelo-Zemo Svaneti', 'სამეგრელო-ზემო სვანეთი', 'SZ', '#F8C471');

-- Insert sample statistics
INSERT INTO statistics (region_id, population, area_sq_km, gdp_growth_rate, unemployment_rate, agriculture_percentage, urban_population_percentage, registered_enterprises, year) VALUES
(1, 1200000, 726, 5.2, 12.5, 2.1, 98.5, 85000, 2023), -- Tbilisi
(2, 350000, 2880, 4.8, 15.2, 8.5, 65.3, 12000, 2023), -- Adjara
(3, 110000, 2033, 3.2, 18.5, 25.6, 45.8, 3500, 2023), -- Guria
(4, 480000, 6552, 4.1, 16.8, 18.2, 58.9, 15000, 2023), -- Imereti
(5, 290000, 11311, 3.8, 14.6, 35.8, 42.1, 8500, 2023), -- Kakheti
(6, 95000, 6785, 2.9, 19.2, 22.4, 38.7, 2800, 2023), -- Mtskheta-Mtianeti
(7, 28000, 4954, 2.1, 22.5, 28.9, 25.3, 800, 2023), -- Racha-Lechkhumi
(8, 160000, 15016, 3.5, 17.8, 31.2, 41.2, 4200, 2023), -- Samtskhe-Javakheti
(9, 420000, 6072, 3.7, 16.4, 28.7, 48.6, 9800, 2023), -- Kvemo Kartli
(10, 260000, 5729, 3.4, 18.9, 24.1, 44.3, 6200, 2023), -- Shida Kartli
(11, 330000, 7468, 4.0, 17.2, 19.8, 52.4, 8900, 2023); -- Samegrelo-Zemo Svaneti
