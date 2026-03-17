-- Create announcements table for dean to send announcements to faculty
CREATE TABLE IF NOT EXISTS announcements (
    announcement_id INT PRIMARY KEY AUTO_INCREMENT,
    dean_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dean_id) REFERENCES deans(dean_id) ON DELETE CASCADE,
    INDEX idx_dean_id (dean_id),
    INDEX idx_target_department (target_department),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create announcement_reads table to track which faculty members have read announcements
CREATE TABLE IF NOT EXISTS announcement_reads (
    read_id INT PRIMARY KEY AUTO_INCREMENT,
    announcement_id INT NOT NULL,
    faculty_id INT NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (announcement_id) REFERENCES announcements(announcement_id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id) ON DELETE CASCADE,
    UNIQUE KEY unique_read (announcement_id, faculty_id),
    INDEX idx_announcement_id (announcement_id),
    INDEX idx_faculty_id (faculty_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
