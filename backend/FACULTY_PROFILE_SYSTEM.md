# Faculty Profile System

## Overview

The Faculty Profile System replaces the old credentials system with a comprehensive profile management system that includes multiple sections for faculty members to maintain their professional information.

## Profile Sections

### 1. Personal Profile

- Profile picture (passport size, 2x2 colored with white background)
- Basic information (name, title, extension)
- Personal details (date of birth, place of birth, gender, civil status)
- Contact information (mobile, telephone, email)
- Address (permanent and current)
- Emergency contact information
- Physical attributes (height, weight, blood type)

### 2. Academic Profile

- Educational background (Elementary to Graduate Studies)
- School name, degree/course
- Year graduated, units earned
- Years attended (from-to)
- Honors received

### 3. Employment Profile

- Position title and company name
- Employment status (Permanent, Temporary, Contractual, Part-time)
- Salary grade and monthly salary
- Employment period (date from - date to)
- Current employment indicator
- Government service indicator

### 4. Professional Membership

- Organization name
- Position held in the organization
- Membership type (Regular, Associate, Fellow, Honorary, Student, Other)
- Membership period (date joined - date ended)
- Active status
- Membership ID number

### 5. Awards Received

- Award title and awarding body
- Date received
- Level (International, National, Regional, Local, Institutional)
- Description
- Certificate file upload

### 6. Seminars/Trainings/Conferences Attended

- Title and type (Seminar, Training, Conference, Workshop, Webinar, Symposium)
- Organizer and venue
- Date period (from - to)
- Number of hours
- Role (Participant, Speaker, Resource Person, Facilitator, Organizer)
- Certificate file upload

### 7. Research-related Activities

- Activity title and type
- Organizer and venue
- Date period
- Role (Participant, Presenter, Researcher, Facilitator, Organizer)
- Research title
- Certificate file upload

### 8. Faculty Involvement in Extension Activities

- Activity title and type
- Beneficiary and venue
- Date period
- Number of hours
- Role (Coordinator, Member, Resource Person, Facilitator, Participant)
- Number of beneficiaries
- Description
- Documentation file upload

## API Endpoints

### Personal Profile

- `GET /api/faculty/profile/personal` - Get personal profile
- `POST /api/faculty/profile/personal` - Create personal profile
- `PUT /api/faculty/profile/personal` - Update personal profile

### Academic Profile

- `GET /api/faculty/profile/academic` - Get all academic profiles
- `POST /api/faculty/profile/academic` - Create academic profile
- `PUT /api/faculty/profile/academic/:id` - Update academic profile
- `DELETE /api/faculty/profile/academic/:id` - Delete academic profile

### Employment Profile

- `GET /api/faculty/profile/employment` - Get all employment profiles
- `POST /api/faculty/profile/employment` - Create employment profile
- `PUT /api/faculty/profile/employment/:id` - Update employment profile
- `DELETE /api/faculty/profile/employment/:id` - Delete employment profile

### Professional Membership

- `GET /api/faculty/profile/membership` - Get all memberships
- `POST /api/faculty/profile/membership` - Create membership
- `PUT /api/faculty/profile/membership/:id` - Update membership
- `DELETE /api/faculty/profile/membership/:id` - Delete membership

### Awards

- `GET /api/faculty/profile/awards` - Get all awards
- `POST /api/faculty/profile/awards` - Create award (with file upload)
- `PUT /api/faculty/profile/awards/:id` - Update award (with file upload)
- `DELETE /api/faculty/profile/awards/:id` - Delete award

### Seminars/Trainings

- `GET /api/faculty/profile/seminars` - Get all seminars/trainings
- `POST /api/faculty/profile/seminars` - Create seminar/training (with file upload)
- `PUT /api/faculty/profile/seminars/:id` - Update seminar/training (with file upload)
- `DELETE /api/faculty/profile/seminars/:id` - Delete seminar/training

### Research Activities

- `GET /api/faculty/profile/research` - Get all research activities
- `POST /api/faculty/profile/research` - Create research activity (with file upload)
- `PUT /api/faculty/profile/research/:id` - Update research activity (with file upload)
- `DELETE /api/faculty/profile/research/:id` - Delete research activity

### Extension Activities

- `GET /api/faculty/profile/extension` - Get all extension activities
- `POST /api/faculty/profile/extension` - Create extension activity (with file upload)
- `PUT /api/faculty/profile/extension/:id` - Update extension activity (with file upload)
- `DELETE /api/faculty/profile/extension/:id` - Delete extension activity

### Complete Profile

- `GET /api/faculty/profile/complete` - Get complete profile (all sections)

## Setup Instructions

### 1. Run Migration

```bash
cd backend
node run-migration.js
```

### 2. Setup Upload Directories

```bash
node setup-uploads.js
```

### 3. Start Server

```bash
npm start
```

## File Upload Specifications

### Profile Picture

- Format: JPG, PNG
- Size: 2x2 inches (passport size)
- Background: White
- Max file size: 5MB

### Certificate/Documentation Files

- Format: PDF, JPG, PNG
- Max file size: 5MB
- Stored in respective directories:
  - Awards: `uploads/awards/`
  - Seminars: `uploads/seminars/`
  - Research: `uploads/research/`
  - Extension: `uploads/extension/`

## Database Tables

- `faculty_personal_profile` - Personal information
- `faculty_academic_profile` - Educational background
- `faculty_employment_profile` - Employment history
- `faculty_professional_membership` - Professional organizations
- `faculty_awards` - Awards and recognitions
- `faculty_seminars_trainings` - Seminars, trainings, conferences
- `faculty_research_activities` - Research-related activities
- `faculty_extension_activities` - Extension and community service

## Notes

- All profile sections are optional except personal profile
- Faculty can have multiple entries for academic, employment, membership, awards, seminars, research, and extension activities
- Personal profile is unique per faculty (one-to-one relationship)
- All other sections support multiple entries (one-to-many relationship)
- File uploads are validated for type and size
- Authentication required for all endpoints (faculty role)
- Faculty can only access and modify their own profile data
