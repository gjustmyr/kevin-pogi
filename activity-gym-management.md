# Activity: Gym Management System - CRUD Operations

**Total Points: 30**

## Objective

Create a Gym Management System that performs CRUD operations using dictionaries and lists. The system should manage gym members with their membership details.

## Requirements

### Data Structure

Use a dictionary to store gym members where:

- **Key**: Member ID (string)
- **Value**: Dictionary containing member details
  - `name` (string)
  - `membership_type` (string: "Basic", "Premium", "VIP")
  - `join_date` (string)
  - `status` (string: "Active", "Inactive")

### Required Operations (30 points total)

#### 1. INSERT/ADD Member (8 points)

- Prompt user for member details (ID, name, membership type, join date)
- Add new member to the dictionary
- Validate that member ID doesn't already exist
- Display success message with member details

#### 2. VIEW/READ Operations (7 points)

- **View All Members**: Display all members in a formatted table
- **Search Member**: Search by member ID and display details
- Handle case when member is not found

#### 3. UPDATE Member (7 points)

- Allow updating member information (name, membership type, status)
- Validate member ID exists before updating
- Display updated member details

#### 4. REMOVE/DELETE Member (5 points)

- Remove a specific member by ID
- Confirm deletion before removing
- Display success message

#### 5. CLEAR ALL Members (3 points)

- Remove all members from the system
- Ask for confirmation before clearing
- Display count of members removed

## Grading Rubric

| Criteria                            | Points |
| ----------------------------------- | ------ |
| INSERT operation works correctly    | 8      |
| VIEW/READ operations implemented    | 7      |
| UPDATE operation functions properly | 7      |
| REMOVE single member works          | 5      |
| CLEAR ALL operation implemented     | 3      |
| **Total**                           | **30** |

## Sample Output

```
=== GYM MANAGEMENT SYSTEM ===
1. Add Member
2. View All Members
3. Search Member
4. Update Member
5. Remove Member
6. Clear All Members
7. Exit

Enter choice: 1
Enter Member ID: M001
Enter Name: John Doe
Enter Membership Type (Basic/Premium/VIP): Premium
Enter Join Date (YYYY-MM-DD): 2024-01-15
✓ Member added successfully!

Enter choice: 2
=== ALL MEMBERS ===
ID      Name            Type        Join Date    Status
M001    John Doe        Premium     2024-01-15   Active
```

## Submission Guidelines

- Submit source code file (.py, .java, .cpp, etc.)
- Include comments explaining your code
- Test all operations before submission
- Due date: [To be announced]
