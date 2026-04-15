# Data Flow Diagram - Faculty Profile to Dean Analytics

## Visual Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FACULTY FILLS PROFILE                             │
│                                                                      │
│  Faculty Login → My Profile → Add Activities:                       │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Research Activities:                                          │  │
│  │ - "Attended Research Conference on AI" (Jan 2024)           │  │
│  │ - "Presented Paper at IEEE Conference" (Mar 2024)           │  │
│  │ - "Research Workshop on Machine Learning" (May 2024)        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                       │
│                    Saved to Database                                 │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE TABLES                                 │
│                                                                      │
│  faculty_research_activities:                                        │
│  ┌────────┬──────────────┬─────────────────────────────────────┐   │
│  │ id     │ faculty_id   │ activity_title                      │   │
│  ├────────┼──────────────┼─────────────────────────────────────┤   │
│  │ 1      │ 1 (Austria)  │ Research Conference on AI           │   │
│  │ 2      │ 1 (Austria)  │ Presented Paper at IEEE             │   │
│  │ 3      │ 2 (Geneta)   │ ML Workshop                         │   │
│  │ 4      │ 2 (Geneta)   │ Data Science Seminar                │   │
│  │ 5      │ 3 (Cabael)   │ Research Methods Training           │   │
│  └────────┴──────────────┴─────────────────────────────────────┘   │
│                                                                      │
│  faculty_extension_activities:                                       │
│  ┌────────┬──────────────┬─────────────────────────────────────┐   │
│  │ id     │ faculty_id   │ activity_title                      │   │
│  ├────────┼──────────────┼─────────────────────────────────────┤   │
│  │ 1      │ 1 (Austria)  │ Community Outreach Program          │   │
│  │ 2      │ 2 (Geneta)   │ Tech Training for Teachers          │   │
│  │ 3      │ 3 (Cabael)   │ Free Coding Workshop                │   │
│  └────────┴──────────────┴─────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    DEAN VIEWS ANALYTICS                              │
│                                                                      │
│  Dean Login → Dashboard → Analytics                                  │
│                              ↓                                       │
│  Backend Process:                                                    │
│  1. Get dean_id from JWT token                                      │
│  2. Find dean's department: "Computer Science"                      │
│  3. Query: SELECT * FROM faculty WHERE department = "CS"            │
│  4. Count activities per faculty                                    │
│  5. Calculate percentages                                           │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      API RESPONSE                                    │
│                                                                      │
│  {                                                                   │
│    "title": "Faculty Involvement in Research...",                   │
│    "data": [                                                         │
│      {                                                               │
│        "faculty_name": "Austria",                                   │
│        "count": 2,                                                  │
│        "percentage": "40"  ← 2 out of 5 total = 40%                │
│      },                                                              │
│      {                                                               │
│        "faculty_name": "Geneta",                                    │
│        "count": 2,                                                  │
│        "percentage": "40"  ← 2 out of 5 total = 40%                │
│      },                                                              │
│      {                                                               │
│        "faculty_name": "Cabael",                                    │
│        "count": 1,                                                  │
│        "percentage": "20"  ← 1 out of 5 total = 20%                │
│      }                                                               │
│    ],                                                                │
│    "total": 5                                                        │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      CHART DISPLAYS                                  │
│                                                                      │
│   Faculty Involvement in Research-related Activities                │
│   (Permanent and Temporary) FY 2022-2025                           │
│                                                                      │
│              ╭─────────────────╮                                    │
│             ╱                   ╲                                   │
│            │   Austria 40%      │  ← Orange slice                  │
│            │   Geneta 40%       │  ← Green slice                   │
│            │   Cabael 20%       │  ← Blue slice                    │
│             ╲                   ╱                                   │
│              ╰─────────────────╯                                    │
│                                                                      │
│   Legend:                                                            │
│   🟠 Austria 40%                                                    │
│   🟢 Geneta 40%                                                     │
│   🔵 Cabael 20%                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Department Filtering Example

### Scenario: Two Departments

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPUTER SCIENCE DEPARTMENT                   │
│                                                                  │
│  Dean: dean.cs@batstate-u.edu.ph                                │
│                                                                  │
│  Faculty:                                                        │
│  ├─ Austria (CS) → 5 research activities                        │
│  ├─ Geneta (CS) → 8 research activities                         │
│  └─ Cabael (CS) → 3 research activities                         │
│                                                                  │
│  Dean's Chart Shows:                                             │
│  - Geneta: 50% (8/16)                                           │
│  - Austria: 31% (5/16)                                           │
│  - Cabael: 19% (3/16)                                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ENGINEERING DEPARTMENT                        │
│                                                                  │
│  Dean: dean.eng@batstate-u.edu.ph                               │
│                                                                  │
│  Faculty:                                                        │
│  ├─ Santos (ENG) → 10 research activities                       │
│  ├─ Reyes (ENG) → 6 research activities                         │
│  └─ Cruz (ENG) → 4 research activities                          │
│                                                                  │
│  Dean's Chart Shows:                                             │
│  - Santos: 50% (10/20)                                          │
│  - Reyes: 30% (6/20)                                            │
│  - Cruz: 20% (4/20)                                             │
└─────────────────────────────────────────────────────────────────┘

Each dean ONLY sees their own department's data!
```

## Code Flow

### 1. Faculty Adds Activity

```javascript
// Frontend (Faculty)
POST /api/faculty/profile/research
{
  "activity_title": "AI Research Conference",
  "activity_type": "Research Conference",
  "organizer": "IEEE",
  "date_from": "2024-01-15",
  "date_to": "2024-01-17",
  "role": "Presenter"
}

// Backend saves to database
INSERT INTO faculty_research_activities
(faculty_id, activity_title, ...)
VALUES (1, 'AI Research Conference', ...)
```

### 2. Dean Views Analytics

```javascript
// Frontend (Dean)
GET /api/dean/faculty-analytics/research-involvement

// Backend processes
const dean = await Dean.findOne({
  where: { user_id: req.user.user_id }
});
// dean.department = "Computer Science"

const faculty = await Faculty.findAll({
  where: { department: "Computer Science" },
  include: [{ model: FacultyResearchActivities }]
});

// Count activities per faculty
Austria: 5 activities
Geneta: 8 activities
Cabael: 3 activities
Total: 16 activities

// Calculate percentages
Austria: (5/16) * 100 = 31%
Geneta: (8/16) * 100 = 50%
Cabael: (3/16) * 100 = 19%

// Return data
{
  data: [
    { faculty_name: "Geneta", percentage: "50" },
    { faculty_name: "Austria", percentage: "31" },
    { faculty_name: "Cabael", percentage: "19" }
  ]
}
```

### 3. Chart Displays

```javascript
// Frontend (Chart.js)
const labels = ["Geneta", "Austria", "Cabael"];
const data = [50, 31, 19];
const colors = ["#27AE60", "#E67E22", "#3498DB"];

new Chart(ctx, {
  type: "pie",
  data: {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: colors,
      },
    ],
  },
});
```

## Real Example with Numbers

### Faculty Activities in Database:

```
Computer Science Department:

Austria:
- Research: 12 activities
- Extension: 10 activities
- Seminars: 15 activities

Geneta:
- Research: 15 activities
- Extension: 6 activities
- Seminars: 18 activities

Cabael:
- Research: 5 activities
- Extension: 8 activities
- Seminars: 12 activities

Hernandez:
- Research: 6 activities
- Extension: 20 activities
- Seminars: 14 activities

Lacbay:
- Research: 7 activities
- Extension: 10 activities
- Seminars: 8 activities

Folienta:
- Research: 2 activities
- Extension: 5 activities
- Seminars: 10 activities
```

### Dean's Charts Show:

**Research Chart:**

- Total: 47 activities
- Geneta: 32% (15/47)
- Austria: 26% (12/47)
- Lacbay: 15% (7/47)
- Hernandez: 13% (6/47)
- Cabael: 11% (5/47)
- Folienta: 4% (2/47)

**Extension Chart:**

- Total: 59 activities
- Hernandez: 34% (20/59)
- Austria: 17% (10/59)
- Lacbay: 17% (10/59)
- Cabael: 14% (8/59)
- Geneta: 10% (6/59)
- Folienta: 8% (5/59)

**Seminars Chart:**

- Total: 77 activities
- Geneta: 23% (18/77)
- Austria: 19% (15/77)
- Hernandez: 18% (14/77)
- Cabael: 16% (12/77)
- Folienta: 13% (10/77)
- Lacbay: 10% (8/77)

## Summary

✅ **Data Source**: Faculty profile system (8 sections)
✅ **Data Storage**: Database tables (faculty_research_activities, etc.)
✅ **Data Filtering**: Automatic by dean's department
✅ **Data Processing**: Count activities, calculate percentages
✅ **Data Display**: Chart.js pie charts
✅ **Real-time**: Updates when faculty adds new activities

**The system is fully integrated and working!** 🎉
