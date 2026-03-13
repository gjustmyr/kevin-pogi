-- ============================================
-- SEED DATA FOR ACADEMIC SYSTEM
-- ============================================

-- ============================================
-- 1. INSERT ACADEMIC YEARS (SCHOOL YEARS)
-- ============================================
INSERT INTO academic_years (year_start, year_end, is_active) VALUES
(2023, 2024, 0),
(2024, 2025, 0),
(2025, 2026, 1);

-- ============================================
-- 2. INSERT DEPARTMENTS
-- ============================================
INSERT INTO departments (department_name, department_acronym) VALUES
('College of Computer Studies', 'CCS'),
('College of Engineering', 'COE'),
('College of Business Administration', 'CBA'),
('College of Education', 'COED'),
('College of Arts and Sciences', 'CAS');

-- ============================================
-- 3. INSERT PROGRAMS PER DEPARTMENT
-- ============================================

-- CCS Programs
INSERT INTO programs (program_name, program_acronym, department_id) VALUES
('Bachelor of Science in Computer Science', 'BSCS', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('Bachelor of Science in Information Technology', 'BSIT', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('Bachelor of Science in Information Systems', 'BSIS', (SELECT department_id FROM departments WHERE department_acronym = 'CCS'));

-- COE Programs
INSERT INTO programs (program_name, program_acronym, department_id) VALUES
('Bachelor of Science in Civil Engineering', 'BSCE', (SELECT department_id FROM departments WHERE department_acronym = 'COE')),
('Bachelor of Science in Electrical Engineering', 'BSEE', (SELECT department_id FROM departments WHERE department_acronym = 'COE')),
('Bachelor of Science in Mechanical Engineering', 'BSME', (SELECT department_id FROM departments WHERE department_acronym = 'COE'));

-- CBA Programs
INSERT INTO programs (program_name, program_acronym, department_id) VALUES
('Bachelor of Science in Business Administration', 'BSBA', (SELECT department_id FROM departments WHERE department_acronym = 'CBA')),
('Bachelor of Science in Accountancy', 'BSA', (SELECT department_id FROM departments WHERE department_acronym = 'CBA')),
('Bachelor of Science in Entrepreneurship', 'BSE', (SELECT department_id FROM departments WHERE department_acronym = 'CBA'));

-- COED Programs
INSERT INTO programs (program_name, program_acronym, department_id) VALUES
('Bachelor of Elementary Education', 'BEED', (SELECT department_id FROM departments WHERE department_acronym = 'COED')),
('Bachelor of Secondary Education', 'BSED', (SELECT department_id FROM departments WHERE department_acronym = 'COED'));

-- CAS Programs
INSERT INTO programs (program_name, program_acronym, department_id) VALUES
('Bachelor of Arts in Communication', 'BAC', (SELECT department_id FROM departments WHERE department_acronym = 'CAS')),
('Bachelor of Science in Psychology', 'BSP', (SELECT department_id FROM departments WHERE department_acronym = 'CAS'));

-- ============================================
-- 4. INSERT SECTIONS PER PROGRAM
-- ============================================

-- BSCS Sections (Year 1-4)
INSERT INTO sections (section_name, year_level, semester, program_id) VALUES
('BSCS 1-A', 1, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSCS')),
('BSCS 1-B', 1, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSCS')),
('BSCS 2-A', 2, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSCS')),
('BSCS 2-B', 2, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSCS')),
('BSCS 3-A', 3, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSCS')),
('BSCS 3-B', 3, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSCS')),
('BSCS 4-A', 4, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSCS')),
('BSCS 4-B', 4, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSCS'));

-- BSIT Sections (Year 1-4)
INSERT INTO sections (section_name, year_level, semester, program_id) VALUES
('BSIT 1-A', 1, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSIT')),
('BSIT 1-B', 1, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSIT')),
('BSIT 2-A', 2, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSIT')),
('BSIT 2-B', 2, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSIT')),
('BSIT 3-A', 3, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSIT')),
('BSIT 3-B', 3, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSIT')),
('BSIT 4-A', 4, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSIT')),
('BSIT 4-B', 4, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSIT'));

-- BSIS Sections (Year 1-4)
INSERT INTO sections (section_name, year_level, semester, program_id) VALUES
('BSIS 1-A', 1, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSIS')),
('BSIS 2-A', 2, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSIS')),
('BSIS 3-A', 3, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSIS')),
('BSIS 4-A', 4, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSIS'));

-- BSCE Sections (Year 1-5)
INSERT INTO sections (section_name, year_level, semester, program_id) VALUES
('BSCE 1-A', 1, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSCE')),
('BSCE 2-A', 2, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSCE')),
('BSCE 3-A', 3, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSCE')),
('BSCE 4-A', 4, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSCE')),
('BSCE 5-A', 5, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSCE'));

-- BSEE Sections (Year 1-5)
INSERT INTO sections (section_name, year_level, semester, program_id) VALUES
('BSEE 1-A', 1, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSEE')),
('BSEE 2-A', 2, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSEE')),
('BSEE 3-A', 3, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSEE')),
('BSEE 4-A', 4, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSEE')),
('BSEE 5-A', 5, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSEE'));

-- BSME Sections (Year 1-5)
INSERT INTO sections (section_name, year_level, semester, program_id) VALUES
('BSME 1-A', 1, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSME')),
('BSME 2-A', 2, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSME')),
('BSME 3-A', 3, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSME')),
('BSME 4-A', 4, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSME')),
('BSME 5-A', 5, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSME'));

-- BSBA Sections (Year 1-4)
INSERT INTO sections (section_name, year_level, semester, program_id) VALUES
('BSBA 1-A', 1, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSBA')),
('BSBA 2-A', 2, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSBA')),
('BSBA 3-A', 3, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSBA')),
('BSBA 4-A', 4, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSBA'));

-- BSA Sections (Year 1-4)
INSERT INTO sections (section_name, year_level, semester, program_id) VALUES
('BSA 1-A', 1, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSA')),
('BSA 2-A', 2, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSA')),
('BSA 3-A', 3, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSA')),
('BSA 4-A', 4, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSA'));

-- BSE Sections (Year 1-4)
INSERT INTO sections (section_name, year_level, semester, program_id) VALUES
('BSE 1-A', 1, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSE')),
('BSE 2-A', 2, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSE')),
('BSE 3-A', 3, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSE')),
('BSE 4-A', 4, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSE'));

-- BEED Sections (Year 1-4)
INSERT INTO sections (section_name, year_level, semester, program_id) VALUES
('BEED 1-A', 1, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BEED')),
('BEED 2-A', 2, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BEED')),
('BEED 3-A', 3, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BEED')),
('BEED 4-A', 4, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BEED'));

-- BSED Sections (Year 1-4)
INSERT INTO sections (section_name, year_level, semester, program_id) VALUES
('BSED 1-A', 1, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSED')),
('BSED 2-A', 2, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSED')),
('BSED 3-A', 3, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSED')),
('BSED 4-A', 4, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSED'));

-- BAC Sections (Year 1-4)
INSERT INTO sections (section_name, year_level, semester, program_id) VALUES
('BAC 1-A', 1, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BAC')),
('BAC 2-A', 2, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BAC')),
('BAC 3-A', 3, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BAC')),
('BAC 4-A', 4, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BAC'));

-- BSP Sections (Year 1-4)
INSERT INTO sections (section_name, year_level, semester, program_id) VALUES
('BSP 1-A', 1, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSP')),
('BSP 2-A', 2, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSP')),
('BSP 3-A', 3, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSP')),
('BSP 4-A', 4, '1st Sem', (SELECT program_id FROM programs WHERE program_acronym = 'BSP'));

-- ============================================
-- 5. INSERT COURSES/SUBJECTS
-- ============================================

-- Computer Science Courses
INSERT INTO courses (course_code, course_name, description, department_id) VALUES
('CS101', 'Introduction to Computing', 'Fundamentals of computing and information technology', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('CS102', 'Computer Programming 1', 'Introduction to programming concepts and logic', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('CS103', 'Computer Programming 2', 'Advanced programming techniques and data structures', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('CS201', 'Data Structures and Algorithms', 'Study of data organization and algorithmic problem solving', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('CS202', 'Object-Oriented Programming', 'Object-oriented design and programming principles', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('CS203', 'Database Management Systems', 'Database design, implementation, and management', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('CS301', 'Software Engineering', 'Software development methodologies and practices', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('CS302', 'Web Development', 'Modern web application development', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('CS303', 'Mobile Application Development', 'Mobile app design and development', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('CS401', 'Capstone Project 1', 'First part of capstone project', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('CS402', 'Capstone Project 2', 'Second part of capstone project', (SELECT department_id FROM departments WHERE department_acronym = 'CCS'));

-- Information Technology Courses
INSERT INTO courses (course_code, course_name, description, department_id) VALUES
('IT101', 'Introduction to Information Technology', 'Overview of IT field and technologies', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('IT102', 'Fundamentals of Programming', 'Basic programming concepts and techniques', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('IT201', 'Network Fundamentals', 'Computer networking concepts and protocols', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('IT202', 'System Administration', 'System management and administration', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('IT301', 'IT Project Management', 'Managing IT projects and teams', (SELECT department_id FROM departments WHERE department_acronym = 'CCS')),
('IT302', 'Cybersecurity Fundamentals', 'Information security principles and practices', (SELECT department_id FROM departments WHERE department_acronym = 'CCS'));

-- Engineering Courses
INSERT INTO courses (course_code, course_name, description, department_id) VALUES
('ENGR101', 'Engineering Drawing', 'Technical drawing and CAD fundamentals', (SELECT department_id FROM departments WHERE department_acronym = 'COE')),
('ENGR102', 'Engineering Mechanics', 'Statics and dynamics principles', (SELECT department_id FROM departments WHERE department_acronym = 'COE')),
('CE201', 'Surveying', 'Land surveying techniques and instruments', (SELECT department_id FROM departments WHERE department_acronym = 'COE')),
('CE202', 'Structural Analysis', 'Analysis of structural systems', (SELECT department_id FROM departments WHERE department_acronym = 'COE')),
('EE201', 'Circuit Analysis', 'Electrical circuit theory and analysis', (SELECT department_id FROM departments WHERE department_acronym = 'COE')),
('EE202', 'Electronics Engineering', 'Electronic devices and circuits', (SELECT department_id FROM departments WHERE department_acronym = 'COE')),
('ME201', 'Thermodynamics', 'Heat and energy transfer principles', (SELECT department_id FROM departments WHERE department_acronym = 'COE')),
('ME202', 'Fluid Mechanics', 'Fluid behavior and flow analysis', (SELECT department_id FROM departments WHERE department_acronym = 'COE'));

-- Business Administration Courses
INSERT INTO courses (course_code, course_name, description, department_id) VALUES
('BA101', 'Principles of Management', 'Management theories and practices', (SELECT department_id FROM departments WHERE department_acronym = 'CBA')),
('BA102', 'Business Mathematics', 'Mathematical applications in business', (SELECT department_id FROM departments WHERE department_acronym = 'CBA')),
('BA201', 'Marketing Management', 'Marketing strategies and consumer behavior', (SELECT department_id FROM departments WHERE department_acronym = 'CBA')),
('BA202', 'Financial Management', 'Corporate finance and investment decisions', (SELECT department_id FROM departments WHERE department_acronym = 'CBA')),
('BA301', 'Human Resource Management', 'Managing people and organizations', (SELECT department_id FROM departments WHERE department_acronym = 'CBA')),
('BA302', 'Operations Management', 'Production and operations systems', (SELECT department_id FROM departments WHERE department_acronym = 'CBA'));

-- Accountancy Courses
INSERT INTO courses (course_code, course_name, description, department_id) VALUES
('ACC101', 'Fundamentals of Accounting', 'Basic accounting principles and concepts', (SELECT department_id FROM departments WHERE department_acronym = 'CBA')),
('ACC102', 'Financial Accounting 1', 'Financial statement preparation and analysis', (SELECT department_id FROM departments WHERE department_acronym = 'CBA')),
('ACC201', 'Financial Accounting 2', 'Advanced financial accounting topics', (SELECT department_id FROM departments WHERE department_acronym = 'CBA')),
('ACC202', 'Cost Accounting', 'Cost analysis and management', (SELECT department_id FROM departments WHERE department_acronym = 'CBA')),
('ACC301', 'Auditing Theory', 'Auditing standards and procedures', (SELECT department_id FROM departments WHERE department_acronym = 'CBA')),
('ACC302', 'Taxation', 'Tax laws and compliance', (SELECT department_id FROM departments WHERE department_acronym = 'CBA'));

-- Education Courses
INSERT INTO courses (course_code, course_name, description, department_id) VALUES
('ED101', 'The Teaching Profession', 'Introduction to teaching as a profession', (SELECT department_id FROM departments WHERE department_acronym = 'COED')),
('ED102', 'The Child and Adolescent Learners', 'Understanding learner development', (SELECT department_id FROM departments WHERE department_acronym = 'COED')),
('ED201', 'Facilitating Learner-Centered Teaching', 'Student-centered teaching methods', (SELECT department_id FROM departments WHERE department_acronym = 'COED')),
('ED202', 'Assessment in Learning', 'Educational assessment and evaluation', (SELECT department_id FROM departments WHERE department_acronym = 'COED')),
('ED301', 'Teaching Internship', 'Supervised teaching practice', (SELECT department_id FROM departments WHERE department_acronym = 'COED'));

-- General Education Courses (assigned to CAS)
INSERT INTO courses (course_code, course_name, description, department_id) VALUES
('GE101', 'Understanding the Self', 'Self-awareness and personal development', (SELECT department_id FROM departments WHERE department_acronym = 'CAS')),
('GE102', 'Readings in Philippine History', 'Philippine historical events and contexts', (SELECT department_id FROM departments WHERE department_acronym = 'CAS')),
('GE103', 'Mathematics in the Modern World', 'Mathematical concepts and applications', (SELECT department_id FROM departments WHERE department_acronym = 'CAS')),
('GE104', 'Purposive Communication', 'Effective communication skills', (SELECT department_id FROM departments WHERE department_acronym = 'CAS')),
('GE105', 'Art Appreciation', 'Understanding and appreciating arts', (SELECT department_id FROM departments WHERE department_acronym = 'CAS')),
('GE106', 'Science, Technology and Society', 'Impact of science and technology', (SELECT department_id FROM departments WHERE department_acronym = 'CAS')),
('GE107', 'Ethics', 'Moral philosophy and ethical decision-making', (SELECT department_id FROM departments WHERE department_acronym = 'CAS')),
('GE108', 'The Contemporary World', 'Global issues and perspectives', (SELECT department_id FROM departments WHERE department_acronym = 'CAS')),
('NSTP101', 'National Service Training Program 1', 'Civic welfare and community service', (SELECT department_id FROM departments WHERE department_acronym = 'CAS')),
('NSTP102', 'National Service Training Program 2', 'Advanced civic engagement', (SELECT department_id FROM departments WHERE department_acronym = 'CAS')),
('PE101', 'Physical Education 1', 'Physical fitness and wellness', (SELECT department_id FROM departments WHERE department_acronym = 'CAS')),
('PE102', 'Physical Education 2', 'Sports and physical activities', (SELECT department_id FROM departments WHERE department_acronym = 'CAS')),
('PE103', 'Physical Education 3', 'Advanced physical training', (SELECT department_id FROM departments WHERE department_acronym = 'CAS')),
('PE104', 'Physical Education 4', 'Lifetime fitness and health', (SELECT department_id FROM departments WHERE department_acronym = 'CAS'));

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the data was inserted correctly:

-- SELECT * FROM academic_years ORDER BY year_start;
-- SELECT * FROM departments ORDER BY department_name;
-- SELECT p.*, d.department_name FROM programs p JOIN departments d ON p.department_id = d.department_id ORDER BY d.department_name, p.program_name;
-- SELECT s.*, p.program_acronym FROM sections s JOIN programs p ON s.program_id = p.program_id ORDER BY p.program_acronym, s.year_level, s.section_name;
-- SELECT c.*, d.department_acronym FROM courses c JOIN departments d ON c.department_id = d.department_id ORDER BY d.department_acronym, c.course_code;
