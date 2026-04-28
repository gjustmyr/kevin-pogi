-- Create organization_events table
CREATE TABLE IF NOT EXISTS organization_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organization_id INT NOT NULL,
  title VARCHAR(300) NOT NULL,
  date_implemented DATE NOT NULL,
  status ENUM('Planned', 'Ongoing', 'Completed', 'Cancelled') DEFAULT 'Planned',
  start_time TIME,
  end_time TIME,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(organization_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create organization_event_sdgs table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS organization_event_sdgs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  sdg_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES organization_events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create organization_event_guests table
CREATE TABLE IF NOT EXISTS organization_event_guests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  guest_name VARCHAR(200) NOT NULL,
  guest_title VARCHAR(200),
  guest_affiliation VARCHAR(300),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES organization_events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create organization_event_attendees table
CREATE TABLE IF NOT EXISTS organization_event_attendees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  sr_code VARCHAR(50) NOT NULL,
  student_name VARCHAR(200) NOT NULL,
  year_level VARCHAR(50),
  section VARCHAR(100),
  program VARCHAR(200),
  department VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES organization_events(id) ON DELETE CASCADE,
  UNIQUE KEY unique_attendee (event_id, sr_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
