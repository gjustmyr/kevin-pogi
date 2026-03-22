-- Create faculty_credentials table
CREATE TABLE IF NOT EXISTS faculty_credentials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  faculty_id INT NOT NULL,
  education VARCHAR(255) NOT NULL,
  education_obtained_where VARCHAR(255) NOT NULL,
  education_obtained_when VARCHAR(255) NOT NULL,
  professional_license VARCHAR(255) NULL,
  specialization VARCHAR(255) NOT NULL,
  subjects_to_teach TEXT NOT NULL,
  appointment_nature VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  tor_file_path VARCHAR(500) NULL,
  pds_file_path VARCHAR(500) NULL,
  diploma_file_path VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id) ON DELETE CASCADE
);

-- Create credential_certificates table
CREATE TABLE IF NOT EXISTS credential_certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  credential_id INT NOT NULL,
  certificate_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (credential_id) REFERENCES faculty_credentials(id) ON DELETE CASCADE
);
