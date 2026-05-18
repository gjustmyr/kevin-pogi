# Activity: Employee Management System - CRUD Operations

**Total Points: 30**

## Objective

Create an Employee Management System that performs CRUD operations using dictionaries and lists. The system should manage employee records with their employment information.

## Requirements

### Data Structure

Use a dictionary to store employees where:

- **Key**: Employee ID (string)
- **Value**: Dictionary containing employee details
  - `name` (string)
  - `department` (string)
  - `position` (string)
  - `salary` (float)
  - `hire_date` (string)
  - `status` (string: "Active", "On Leave", "Resigned")

### Required Operations (30 points total)

#### 1. INSERT/ADD Employee (8 points)

- Prompt user for employee details (ID, name, department, position, salary, hire date)
- Add new employee to the dictionary
- Validate that employee ID doesn't already exist
- Validate salary is a positive number
- Display success message with employee details

#### 2. VIEW/READ Operations (7 points)

- **View All Employees**: Display all employees in a formatted table
- **Search Employee**: Search by employee ID and display details
- **Filter by Department**: Display employees in a specific department
- **View Statistics**: Show total employees, average salary
- Handle case when employee is not found

#### 3. UPDATE Employee (7 points)

- Allow updating employee information (name, department, position, salary, status)
- Validate employee ID exists before updating
- Validate salary is positive
- Display updated employee details

#### 4. REMOVE/DELETE Employee (5 points)

- Remove a specific employee by ID
- Confirm deletion before removing
- Display success message with removed employee name and position

#### 5. CLEAR ALL Employees (3 points)

- Remove all employees from the system
- Ask for confirmation with warning message
- Display count of employees removed

## Grading Rubric

| Criteria                                          | Points |
| ------------------------------------------------- | ------ |
| INSERT operation with validation                  | 8      |
| VIEW/READ operations (all, search, filter, stats) | 7      |
| UPDATE operation with validation                  | 7      |
| REMOVE single employee works                      | 5      |
| CLEAR ALL operation implemented                   | 3      |
| **Total**                                         | **30** |

## Sample Output

```
=== EMPLOYEE MANAGEMENT SYSTEM ===
1. Add Employee
2. View All Employees
3. Search Employee
4. Filter by Department
5. View Statistics
6. Update Employee
7. Remove Employee
8. Clear All Employees
9. Exit

Enter choice: 1
Enter Employee ID: EMP-001
Enter Name: Anna Reyes
Enter Department: IT
Enter Position: Software Developer
Enter Salary: 45000.00
Enter Hire Date (YYYY-MM-DD): 2023-06-15
✓ Employee added successfully!

Enter choice: 2
=== ALL EMPLOYEES ===
ID          Name            Department    Position              Salary      Hire Date    Status
EMP-001     Anna Reyes      IT            Software Developer    45000.00    2023-06-15   Active
EMP-002     Carlos Tan      HR            HR Manager            55000.00    2022-03-10   Active

Enter choice: 4
Enter Department: IT
=== EMPLOYEES IN IT DEPARTMENT ===
ID          Name            Position              Salary      Status
EMP-001     Anna Reyes      Software Developer    45000.00    Active

Enter choice: 5
=== EMPLOYEE STATISTICS ===
Total Employees: 2
Average Salary: ₱50,000.00
Active Employees: 2

Enter choice: 7
Enter Employee ID to remove: EMP-001
Employee: Anna Reyes (Software Developer)
Are you sure you want to remove this employee? (yes/no): yes
✓ Employee removed successfully!

Enter choice: 8
⚠ WARNING: This will remove ALL employees from the system!
Are you sure? (yes/no): yes
✓ Cleared 1 employee(s) from the system.
```

## Submission Guidelines

- Submit source code file (.py, .java, .cpp, etc.)
- Include proper input validation for all fields
- Add comments explaining your code
- Implement error handling for invalid inputs
- Test all CRUD operations before submission
- Due date: [To be announced]

## Bonus Challenge (+5 points)

- Export employee list to a text file
- Import employees from a text file
