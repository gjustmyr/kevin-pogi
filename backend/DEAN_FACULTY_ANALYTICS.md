# Dean Faculty Analytics API

## Overview

This API provides analytics data for the dean dashboard, showing faculty involvement in various activities. The data is perfect for creating pie charts showing the distribution of faculty participation.

## Base URL

`/api/dean/faculty-analytics`

## Authentication

All endpoints require:

- Bearer token in Authorization header
- Dean role

## Endpoints

### 1. Research Involvement Statistics

**GET** `/api/dean/faculty-analytics/research-involvement`

Returns faculty involvement in research-related seminars/workshops/trainings/conferences.

**Query Parameters:**

- `academic_year_id` (optional) - Filter by academic year

**Response:**

```json
{
  "title": "Faculty Involvement in Research-related Seminars/Workshops/Trainings/Conferences",
  "subtitle": "(Permanent and Temporary)",
  "data": [
    {
      "faculty_id": 1,
      "faculty_name": "Geneta",
      "count": 15,
      "percentage": "35"
    },
    {
      "faculty_id": 2,
      "faculty_name": "Austria",
      "count": 12,
      "percentage": "27"
    },
    {
      "faculty_id": 3,
      "faculty_name": "Lacbay",
      "count": 6,
      "percentage": "13"
    }
  ],
  "total": 43
}
```

**Use Case:** Create pie chart showing "Faculty Involvement in Research-related Seminars/Workshops/Trainings/Conferences (Permanent and Temporary) FY 2022-2025"

---

### 2. Extension Services Involvement Statistics

**GET** `/api/dean/faculty-analytics/extension-involvement`

Returns faculty involvement in extension services.

**Query Parameters:**

- `academic_year_id` (optional) - Filter by academic year

**Response:**

```json
{
  "title": "Faculty Involvement in Extension Services",
  "subtitle": "(Permanent and Temporary)",
  "data": [
    {
      "faculty_id": 3,
      "faculty_name": "Hernandez",
      "count": 20,
      "percentage": "34"
    },
    {
      "faculty_id": 1,
      "faculty_name": "Austria",
      "count": 10,
      "percentage": "16"
    }
  ],
  "total": 59
}
```

**Use Case:** Create pie chart showing "Faculty Involvement in Extension Services (Permanent and Temporary) FY 2022-2025"

---

### 3. Seminars/Trainings/Conferences Involvement Statistics

**GET** `/api/dean/faculty-analytics/seminars-involvement`

Returns faculty involvement in seminars/workshops/trainings/conferences.

**Query Parameters:**

- `academic_year_id` (optional) - Filter by academic year

**Response:**

```json
{
  "title": "Faculty Involvement in Seminars/Workshops/Trainings/Conferences",
  "subtitle": "(Permanent and Temporary)",
  "data": [
    {
      "faculty_id": 2,
      "faculty_name": "Geneta",
      "count": 18,
      "percentage": "24"
    },
    {
      "faculty_id": 4,
      "faculty_name": "Hernandez",
      "count": 14,
      "percentage": "19"
    }
  ],
  "total": 75
}
```

**Use Case:** Create pie chart showing "Faculty Involvement in Seminars/Workshops/Trainings/Conferences (Permanent and Temporary) FY 2022-2025"

---

### 4. Awards Statistics

**GET** `/api/dean/faculty-analytics/awards`

Returns faculty awards received statistics.

**Query Parameters:**

- `academic_year_id` (optional) - Filter by academic year

**Response:**

```json
{
  "title": "Faculty Awards Received",
  "subtitle": "(Permanent and Temporary)",
  "data": [
    {
      "faculty_id": 1,
      "faculty_name": "Austria",
      "count": 5,
      "percentage": "28"
    },
    {
      "faculty_id": 2,
      "faculty_name": "Geneta",
      "count": 4,
      "percentage": "22"
    }
  ],
  "total": 18
}
```

**Use Case:** Create pie chart showing faculty awards distribution

---

### 5. Professional Membership Statistics

**GET** `/api/dean/faculty-analytics/memberships`

Returns active professional membership statistics.

**Response:**

```json
{
  "title": "Faculty Professional Memberships",
  "subtitle": "(Active Memberships)",
  "data": [
    {
      "faculty_id": 1,
      "faculty_name": "Austria",
      "count": 3,
      "percentage": "25"
    },
    {
      "faculty_id": 2,
      "faculty_name": "Cabael",
      "count": 2,
      "percentage": "17"
    }
  ],
  "total": 12
}
```

**Use Case:** Create pie chart showing professional membership distribution

---

### 6. Comprehensive Dashboard Analytics

**GET** `/api/dean/faculty-analytics/dashboard`

Returns all analytics data in a single call for the complete dashboard.

**Query Parameters:**

- `academic_year_id` (optional) - Filter by academic year

**Response:**

```json
{
  "research_involvement": {
    "title": "Faculty Involvement in Research-related Seminars/Workshops/Trainings/Conferences",
    "data": [...]
  },
  "extension_involvement": {
    "title": "Faculty Involvement in Extension Services",
    "data": [...]
  },
  "seminars_involvement": {
    "title": "Faculty Involvement in Seminars/Workshops/Trainings/Conferences",
    "data": [...]
  },
  "awards": {
    "title": "Faculty Awards Received",
    "data": [...]
  },
  "memberships": {
    "title": "Faculty Professional Memberships",
    "data": [...]
  },
  "total_faculty": 25
}
```

**Use Case:** Load all dashboard charts with a single API call

---

## Data Calculation

### How Percentages are Calculated:

1. Count the number of activities/awards/memberships per faculty
2. Calculate total across all faculty
3. Calculate percentage: `(faculty_count / total) * 100`
4. Sort by count (descending)
5. Filter out faculty with zero count

### Example:

If faculty have the following research activities:

- Geneta: 15 activities
- Austria: 12 activities
- Cabael: 5 activities
- Lacbay: 6 activities
- Hernandez: 5 activities

Total = 43 activities

Percentages:

- Geneta: (15/43) \* 100 = 35%
- Austria: (12/43) \* 100 = 28%
- Lacbay: (6/43) \* 100 = 14%
- Cabael: (5/43) \* 100 = 12%
- Hernandez: (5/43) \* 100 = 12%

---

## Frontend Integration

### Creating Pie Charts

**Example using Chart.js:**

```javascript
// Fetch data
const response = await fetch(
  "/api/dean/faculty-analytics/research-involvement",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);
const data = await response.json();

// Create pie chart
const ctx = document.getElementById("researchChart").getContext("2d");
new Chart(ctx, {
  type: "pie",
  data: {
    labels: data.data.map((item) => item.faculty_name),
    datasets: [
      {
        data: data.data.map((item) => item.percentage),
        backgroundColor: [
          "#FF6B35", // Austria - Orange
          "#4ECDC4", // Cabael - Cyan
          "#95D904", // Geneta - Green
          "#F7B731", // Folienta - Yellow
          "#5F27CD", // Hernandez - Purple
          "#00D2D3", // Lacbay - Teal
        ],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: data.title + "\n" + data.subtitle,
      },
      legend: {
        position: "right",
        labels: {
          generateLabels: function (chart) {
            const data = chart.data;
            return data.labels.map((label, i) => ({
              text: `${label} ${data.datasets[0].data[i]}%`,
              fillStyle: data.datasets[0].backgroundColor[i],
            }));
          },
        },
      },
    },
  },
});
```

---

## Notes

1. **Academic Year Filter**: When `academic_year_id` is provided, only activities within that academic year's date range are counted.

2. **Department Scope**: Dean can only see analytics for faculty in their department.

3. **Active Memberships**: For professional memberships, only active memberships are counted.

4. **Real-time Data**: All data is calculated in real-time from the faculty profile system.

5. **Zero Values**: Faculty with zero activities are excluded from the results to keep charts clean.

6. **Sorting**: Results are sorted by count (highest to lowest) for better visualization.

---

## Error Responses

**404 Not Found:**

```json
{
  "message": "Dean profile not found"
}
```

**500 Internal Server Error:**

```json
{
  "message": "Error fetching research involvement"
}
```

---

## Testing

**Example cURL request:**

```bash
curl -X GET "http://localhost:3000/api/dean/faculty-analytics/research-involvement?academic_year_id=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Example with Postman:**

1. Set method to GET
2. URL: `http://localhost:3000/api/dean/faculty-analytics/research-involvement`
3. Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
4. Optional query param: `academic_year_id=1`
