# Activity: Student Management System - CRUD Operations

**Total Points: 30**

## Objective

Create a Student Management System that performs CRUD operations using dictionaries and lists. The system should manage student records with their academic information.

## Requirements

### Data Structure

Use a dictionary to store students where:

- **Key**: Student ID (string)
- **Value**: Dictionary containing student details
  - `name` (string)
  - `course` (string)
  - `year_level` (integer: 1-4)
  - `gpa` (float)
  - `status` (string: "Enrolled", "Graduated", "Dropped")

### Required Operations (30 points total)

#### 1. INSERT/ADD Student (8 points)

- Prompt user for student details (ID, name, course, year level, GPA)
- Add new student to the dictionary
- Validate that student ID doesn't already exist
- Validate year level (1-4) and GPA (0.0-4.0)
- Display success message with student details

#### 2. VIEW/READ Operations (7 points)

- **View All Students**: Display all students in a formatted list
- **Search Student**: Search by student ID and display details
- **Filter by Course**: Display students enrolled in a specific course
- Handle case when student is not found

#### 3. UPDATE Student (7 points)

- Allow updating student information (name, course, year level, GPA, status)
- Validate student ID exists before updating
- Validate new values (year level, GPA ranges)
- Display updated student details

#### 4. REMOVE/DELETE Student (5 points)

- Remove a specific student by ID
- Confirm deletion before removing
- Display success message with removed student name

#### 5. CLEAR ALL Students (3 points)

- Remove all students from the system
- Ask for confirmation before clearing
- Display count of students removed

## Grading Rubric

| Criteria                                   | Points |
| ------------------------------------------ | ------ |
| INSERT operation with validation           | 8      |
| VIEW/READ operations (all, search, filter) | 7      |
| UPDATE operation with validation           | 7      |
| REMOVE single student works                | 5      |
| CLEAR ALL operation implemented            | 3      |
| **Total**                                  | **30** |

## Sample Output

```
=== STUDENT MANAGEMENT SYSTEM ===
1. Add Student
2. View All Students
3. Search Student
4. Filter by Course
5. Update Student
6. Remove Student
7. Clear All Students
8. Exit

Enter choice: 1
Enter Student ID: 2024-001
Enter Name: Maria Santos
Enter Course: Computer Science
Enter Year Level (1-4): 2
Enter GPA (0.0-4.0): 3.75
✓ Student added successfully!

Enter choice: 2
=== ALL STUDENTS ===
ID          Name              Course              Year    GPA     Status
2024-001    Maria Santos      Computer Science    2       3.75    Enrolled
2024-002    Juan Cruz         Engineering         3       3.50    Enrolled

Enter choice: 4
Enter Course: Computer Science
=== STUDENTS IN COMPUTER SCIENCE ===
ID          Name              Year    GPA     Status
2024-001    Maria Santos      2       3.75    Enrolled
```

## Submission Guidelines

- Submit source code file (.py, .java, .cpp, etc.)
- Include input validation for all fields
- Add comments explaining your code logic
- Test all CRUD operations thoroughly
- Due date: [To be announced]
