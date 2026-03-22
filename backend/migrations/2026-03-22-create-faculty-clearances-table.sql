-- Migration: Create faculty_clearances table for per-period clearance tracking
-- Date: 2026-03-22
-- Description: Stores clearance status per faculty per academic year+semester

CREATE TABLE IF NOT EXISTS faculty_clearances (
  clearance_id   INT          NOT NULL AUTO_INCREMENT,
  faculty_id     INT          NOT NULL,
  academic_year_id INT        NOT NULL,
  semester       VARCHAR(50)  NOT NULL,
  clearance_status ENUM('pending', 'cleared', 'withholding') NOT NULL DEFAULT 'pending',
  clearance_remarks TEXT       NULL,
  clearance_date DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  set_by_dean_id INT          NULL,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (clearance_id),
  UNIQUE KEY uq_faculty_period (faculty_id, academic_year_id, semester),
  CONSTRAINT fk_fc_faculty    FOREIGN KEY (faculty_id)       REFERENCES faculties(faculty_id)           ON DELETE CASCADE,
  CONSTRAINT fk_fc_year       FOREIGN KEY (academic_year_id) REFERENCES academic_years(academic_year_id) ON DELETE CASCADE,
  CONSTRAINT fk_fc_dean       FOREIGN KEY (set_by_dean_id)   REFERENCES deans(dean_id)                  ON DELETE SET NULL
);
