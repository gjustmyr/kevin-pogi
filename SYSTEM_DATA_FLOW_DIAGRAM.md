# System Data Flow Diagram (DFD)
## Faculty Management and Organization System

---

## Table of Contents
1. [Context Diagram (Level 0)](#context-diagram-level-0)
2. [Level 1 DFD - Main System Processes](#level-1-dfd---main-system-processes)
3. [Level 2 DFD - Detailed Subsystems](#level-2-dfd---detailed-subsystems)
4. [Data Stores](#data-stores)
5. [External Entities](#external-entities)
6. [Data Flows](#data-flows)

---

## Context Diagram (Level 0)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    EXTERNAL ENTITIES                                    │
│                                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │SuperAdmin│  │   Dean   │  │ Faculty  │  │Organization│             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬──────┘             │
│       │             │              │             │                      │
│       │             │              │             │                      │
│       │  Login      │  Login       │  Login      │  Login              │
│       │  Manage     │  Manage      │  Submit     │  Manage             │
│       │  Users      │  Faculty     │  Docs       │  Members            │
│       │             │  Orgs        │  Profile    │  Events             │
│       │             │  Reqs        │             │  Documents          │
│       ▼             ▼              ▼             ▼                      │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │                                                            │        │
│  │         FACULTY MANAGEMENT & ORGANIZATION SYSTEM          │        │
│  │                                                            │        │
│  │  • Authentication & Authorization                         │        │
│  │  • User Management                                        │        │
│  │  • Faculty Profile Management                             │        │
│  │  • Organization Management                                │        │
│  │  • Requirements & Clearance                               │        │
│  │  • Personal Data Sheet (PDS)                              │        │
│  │  • Events & Activities                                    │        │
│  │  • Analytics & Reporting                                  │        │
│  │                                                            │        │
│  └────────────────────────────────────────────────────────────┘        │
│       │             │              │             │                      │
│       │             │              │             │                      │
│       │  Reports    │  Analytics   │  Status     │  Statistics         │
│       │  Logs       │  Approvals   │  Clearance  │  Reports            │
│       │             │  Credentials │  Docs       │  Member Lists       │
│       ▼             ▼              ▼             ▼                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │SuperAdmin│  │   Dean   │  │ Faculty  │  │Organization│             │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---


## Level 1 DFD - Main System Processes

```
┌─────────────┐
│ SuperAdmin  │
└──────┬──────┘
       │
       │ User Credentials
       │ System Config
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  1.0 USER MANAGEMENT & AUTHENTICATION                            │
│  • Login/Logout                                                  │
│  • Password Reset                                                │
│  • Role-Based Access Control                                     │
│  • Create/Update/Delete Users                                    │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ User Data, Roles, Permissions
       ▼
┌─────────────────┐
│   D1: Users     │
│   D2: Admins    │
│   D3: Deans     │
│   D4: Faculty   │
│   D5: Orgs      │
└─────────────────┘

┌─────────────┐
│    Dean     │
└──────┬──────┘
       │
       │ Faculty Data, Requirements, Approvals
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  2.0 FACULTY MANAGEMENT                                          │
│  • Create/Update Faculty Profiles                                │
│  • Manage Faculty Credentials                                    │
│  • Review Requirements                                           │
│  • Grant Clearances                                              │
│  • View Faculty Analytics                                        │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Faculty Records, Credentials, Clearances
       ▼
┌─────────────────────────────────┐
│   D4: Faculty                   │
│   D6: Faculty Credentials       │
│   D7: Faculty Clearances        │
│   D8: Requirement Submissions   │
└─────────────────────────────────┘

┌─────────────┐
│   Faculty   │
└──────┬──────┘
       │
       │ Profile Data, Documents, Requirements
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  3.0 FACULTY PROFILE & PDS MANAGEMENT                            │
│  • Personal Profile                                              │
│  • Academic Profile                                              │
│  • Employment History                                            │
│  • Professional Memberships                                      │
│  • Awards & Recognition                                          │
│  • Seminars & Trainings                                          │
│  • Research Activities                                           │
│  • Extension Activities                                          │
│  • Personal Data Sheet (PDS)                                     │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Profile Data, PDS Records, Certificates
       ▼
┌─────────────────────────────────────────┐
│   D9: Faculty Personal Profile          │
│   D10: Faculty Academic Profile         │
│   D11: Faculty Employment Profile       │
│   D12: Faculty Awards                   │
│   D13: Faculty Seminars/Trainings       │
│   D14: Faculty Research Activities      │
│   D15: Faculty Extension Activities     │
│   D16: Personal Data Sheet              │
│   D17: PDS Sub-records                  │
└─────────────────────────────────────────┘

┌─────────────┐
│   Faculty   │
└──────┬──────┘
       │
       │ Requirement Files, Submissions
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  4.0 REQUIREMENTS & CLEARANCE MANAGEMENT                         │
│  • Submit Requirements                                           │
│  • Upload Multiple Files                                         │
│  • Track Submission Status                                       │
│  • View Clearance Status                                         │
│  • Download Submitted Files                                      │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Submissions, Files, Status
       ▼
┌─────────────────────────────────┐
│   D8: Requirement Submissions   │
│   D18: Requirement Files        │
│   D7: Faculty Clearances        │
└─────────────────────────────────┘

┌─────────────┐
│    Dean     │
└──────┬──────┘
       │
       │ Organization Data, Advisers
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  5.0 ORGANIZATION MANAGEMENT                                     │
│  • Create/Update Organizations                                   │
│  • Assign Advisers                                               │
│  • View Organization Dashboard                                   │
│  • Monitor Organization Events                                   │
│  • Review Organization Documents                                 │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Organization Records, Advisers
       ▼
┌─────────────────────────────────┐
│   D5: Organizations             │
│   D19: Organization Advisers    │
│   D20: Organization Documents   │
└─────────────────────────────────┘

┌─────────────┐
│Organization │
└──────┬──────┘
       │
       │ Member Data, CSV Files, Department
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  6.0 ORGANIZATION MEMBER MANAGEMENT                              │
│  • Add/Update/Delete Members                                     │
│  • Bulk Upload Members (CSV/Excel)                               │
│  • Assign Departments                                            │
│  • Track Member Hierarchy                                        │
│  • View Demographics                                             │
│  • Search Member History                                         │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Member Records, Upload History
       ▼
┌─────────────────────────────────┐
│   D21: Organization Members     │
│   D22: Bulk Upload History      │
│   D23: Position Templates       │
└─────────────────────────────────┘

┌─────────────┐
│Organization │
└──────┬──────┘
       │
       │ Event Data, Attendees, SDGs
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  7.0 ORGANIZATION EVENT MANAGEMENT                               │
│  • Create/Update/Delete Events                                   │
│  • Upload Event Files                                            │
│  • Manage Attendees                                              │
│  • Bulk Upload Attendees                                         │
│  • Assign SDGs                                                   │
│  • Add Guest Speakers                                            │
│  • View Event Analytics                                          │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Event Records, Attendees, Analytics
       ▼
┌─────────────────────────────────┐
│   D24: Organization Events      │
│   D25: Event Attendees          │
│   D26: Event Guests             │
│   D27: Event SDGs               │
└─────────────────────────────────┘

┌─────────────┐
│    Dean     │
└──────┬──────┘
       │
       │ Announcement Data
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  8.0 ANNOUNCEMENT MANAGEMENT                                     │
│  • Create/Update/Delete Announcements                            │
│  • Target Specific Faculty                                       │
│  • Track Read Status                                             │
│  • View Announcement Analytics                                   │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Announcements, Read Status
       ▼
┌─────────────────────────────────┐
│   D28: Announcements            │
│   D29: Announcement Reads       │
└─────────────────────────────────┘

┌─────────────┐
│ All Users   │
└──────┬──────┘
       │
       │ Query Parameters
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  9.0 ANALYTICS & REPORTING                                       │
│  • Dashboard Statistics                                          │
│  • Faculty Analytics                                             │
│  • Organization Analytics                                        │
│  • Event Analytics                                               │
│  • Clearance Reports                                             │
│  • Export to Excel                                               │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Reports, Charts, Statistics
       ▼
┌─────────────┐
│ All Users   │
└─────────────┘
```

---


## Level 2 DFD - Detailed Subsystems

### 2.1 Authentication & Authorization Subsystem

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       │ Email, Password
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  1.1 LOGIN PROCESS                                               │
│  • Validate Credentials                                          │
│  • Generate JWT Token                                            │
│  • Check Role                                                    │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ User Data
       ▼
┌─────────────────┐
│   D1: Users     │◄──────┐
└─────────────────┘       │
       │                  │
       │ User Record      │ Token
       ▼                  │
┌──────────────────────────────────────────────────────────────────┐
│  1.2 AUTHORIZATION CHECK                                         │
│  • Verify JWT Token                                              │
│  • Check Role Permissions                                        │
│  • Grant/Deny Access                                             │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Access Token, User Info
       ▼
┌─────────────┐
│    User     │
└─────────────┘

┌─────────────┐
│    User     │
└──────┬──────┘
       │
       │ Email
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  1.3 PASSWORD RESET                                              │
│  • Request Reset Token                                           │
│  • Send Email with Token                                         │
│  • Verify Token                                                  │
│  • Update Password                                               │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Reset Token, New Password
       ▼
┌─────────────────┐
│   D1: Users     │
└─────────────────┘
       │
       │ Confirmation
       ▼
┌─────────────┐
│    User     │
└─────────────┘
```

---

### 2.2 Faculty Profile Management Subsystem

```
┌─────────────┐
│   Faculty   │
└──────┬──────┘
       │
       │ Profile Data, Photos
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  3.1 PERSONAL PROFILE MANAGEMENT                                 │
│  • Create/Update Personal Info                                   │
│  • Upload Profile Picture                                        │
│  • Upload Passport Photo                                         │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Personal Data, Photos
       ▼
┌─────────────────────────────────┐
│   D9: Faculty Personal Profile  │
└─────────────────────────────────┘

┌─────────────┐
│   Faculty   │
└──────┬──────┘
       │
       │ Academic Records
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  3.2 ACADEMIC PROFILE MANAGEMENT                                 │
│  • Add Education Records                                         │
│  • Update Degrees                                                │
│  • Track Academic History                                        │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Academic Records
       ▼
┌─────────────────────────────────┐
│   D10: Faculty Academic Profile │
└─────────────────────────────────┘

┌─────────────┐
│   Faculty   │
└──────┬──────┘
       │
       │ Employment Data
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  3.3 EMPLOYMENT PROFILE MANAGEMENT                               │
│  • Add Employment Records                                        │
│  • Update Work History                                           │
│  • Track Positions                                               │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Employment Records
       ▼
┌──────────────────────────────────────┐
│   D11: Faculty Employment Profile   │
└──────────────────────────────────────┘

┌─────────────┐
│   Faculty   │
└──────┬──────┘
       │
       │ Award Data, Certificates
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  3.4 AWARDS & RECOGNITION MANAGEMENT                             │
│  • Add Awards                                                    │
│  • Upload Certificates                                           │
│  • Track Recognition                                             │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Awards, Certificate Files
       ▼
┌─────────────────────────────────┐
│   D12: Faculty Awards           │
└─────────────────────────────────┘

┌─────────────┐
│   Faculty   │
└──────┬──────┘
       │
       │ Seminar Data, Certificates
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  3.5 SEMINARS & TRAININGS MANAGEMENT                             │
│  • Add Seminars/Trainings                                        │
│  • Upload Certificates                                           │
│  • Track Professional Development                                │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Seminar Records, Certificates
       ▼
┌──────────────────────────────────────┐
│   D13: Faculty Seminars/Trainings   │
└──────────────────────────────────────┘

┌─────────────┐
│   Faculty   │
└──────┬──────┘
       │
       │ Research Data, Certificates
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  3.6 RESEARCH ACTIVITIES MANAGEMENT                              │
│  • Add Research Projects                                         │
│  • Upload Certificates                                           │
│  • Track Publications                                            │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Research Records, Certificates
       ▼
┌──────────────────────────────────────┐
│   D14: Faculty Research Activities  │
└──────────────────────────────────────┘

┌─────────────┐
│   Faculty   │
└──────┬──────┘
       │
       │ Extension Data, Documentation
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  3.7 EXTENSION ACTIVITIES MANAGEMENT                             │
│  • Add Extension Projects                                        │
│  • Upload Documentation                                          │
│  • Track Community Service                                       │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Extension Records, Documentation
       ▼
┌──────────────────────────────────────┐
│   D15: Faculty Extension Activities │
└──────────────────────────────────────┘
```

---

### 2.3 Personal Data Sheet (PDS) Subsystem

```
┌─────────────┐
│   Faculty   │
│   or Dean   │
└──────┬──────┘
       │
       │ PDS Data (All Sections)
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  3.8 PDS MANAGEMENT                                              │
│  • Create/Update PDS                                             │
│  • Manage Children Records                                       │
│  • Manage Education Records                                      │
│  • Manage Eligibility Records                                    │
│  • Manage Work Experience                                        │
│  • Manage Voluntary Work                                         │
│  • Manage Training Records                                       │
│  • Manage Other Information                                      │
│  • Manage References                                             │
│  • Export to Excel                                               │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Complete PDS Data
       ▼
┌─────────────────────────────────────┐
│   D16: Personal Data Sheet          │
│   D17: PDS Children                 │
│   D18: PDS Education                │
│   D19: PDS Eligibility              │
│   D20: PDS Work Experience          │
│   D21: PDS Voluntary Work           │
│   D22: PDS Training                 │
│   D23: PDS Other Info               │
│   D24: PDS References               │
└─────────────────────────────────────┘
       │
       │ PDS Report, Excel File
       ▼
┌─────────────┐
│   Faculty   │
│   or Dean   │
└─────────────┘
```

---

### 2.4 Requirements & Clearance Subsystem

```
┌─────────────┐
│   Faculty   │
└──────┬──────┘
       │
       │ Requirement Files (Multiple)
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  4.1 REQUIREMENT SUBMISSION                                      │
│  • Upload Multiple Files (Max 10)                                │
│  • Validate File Types                                           │
│  • Store File Metadata                                           │
│  • Track Submission Status                                       │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Submission Data, Files
       ▼
┌─────────────────────────────────┐
│   D8: Requirement Submissions   │
│   D18: Requirement Files        │
└─────────────────────────────────┘
       │
       │ Submission Info
       ▼
┌─────────────┐
│    Dean     │
└──────┬──────┘
       │
       │ Review, Approval/Rejection
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  4.2 REQUIREMENT REVIEW                                          │
│  • View Submissions                                              │
│  • Download Files                                                │
│  • Approve/Reject                                                │
│  • Add Comments                                                  │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Review Status, Comments
       ▼
┌─────────────────────────────────┐
│   D8: Requirement Submissions   │
└─────────────────────────────────┘
       │
       │ Status Update
       ▼
┌─────────────┐
│   Faculty   │
└──────┬──────┘
       │
       │ Query Clearance Status
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  4.3 CLEARANCE MANAGEMENT                                        │
│  • Check Submission Status                                       │
│  • Calculate Clearance                                           │
│  • Generate Clearance Report                                     │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Clearance Data
       ▼
┌─────────────────────────────────┐
│   D7: Faculty Clearances        │
└─────────────────────────────────┘
       │
       │ Clearance Status
       ▼
┌─────────────┐
│   Faculty   │
└─────────────┘
```

---


### 2.5 Organization Member Management Subsystem

```
┌─────────────┐
│Organization │
└──────┬──────┘
       │
       │ Member Data
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  6.1 INDIVIDUAL MEMBER MANAGEMENT                                │
│  • Add New Member                                                │
│  • Update Member Info                                            │
│  • Delete Member                                                 │
│  • Upload Member Photo                                           │
│  • Search Member History                                         │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Member Records
       ▼
┌─────────────────────────────────┐
│   D21: Organization Members     │
└─────────────────────────────────┘

┌─────────────┐
│Organization │
└──────┬──────┘
       │
       │ CSV/Excel File, Department
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  6.2 BULK UPLOAD PROCESS                                         │
│  • Upload CSV/Excel File                                         │
│  • Validate File Format                                          │
│  • Parse Member Data                                             │
│  • Assign Department to All                                      │
│  • Insert/Update Members                                         │
│  • Track Statistics                                              │
│  • Store Upload Metadata                                         │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Member Records, Upload History
       ▼
┌─────────────────────────────────┐
│   D21: Organization Members     │
│   D22: Bulk Upload History      │
└─────────────────────────────────┘
       │
       │ Upload Results
       ▼
┌─────────────┐
│Organization │
└──────┬──────┘
       │
       │ Query Upload History
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  6.3 UPLOAD HISTORY TRACKING                                     │
│  • View Past Uploads                                             │
│  • See File Names                                                │
│  • Check Departments                                             │
│  • View Statistics                                               │
│  • Monitor Upload Status                                         │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Upload Records
       ▼
┌─────────────────────────────────┐
│   D22: Bulk Upload History      │
└─────────────────────────────────┘
       │
       │ History Data
       ▼
┌─────────────┐
│Organization │
└──────┬──────┘
       │
       │ Query Demographics
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  6.4 MEMBER ANALYTICS                                            │
│  • Calculate Gender Distribution                                 │
│  • Analyze Program Distribution                                  │
│  • Generate Demographics Report                                  │
│  • View Member Hierarchy                                         │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Analytics Data
       ▼
┌─────────────┐
│Organization │
└─────────────┘
```

---

### 2.6 Organization Event Management Subsystem

```
┌─────────────┐
│Organization │
└──────┬──────┘
       │
       │ Event Data, Files
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  7.1 EVENT CREATION & MANAGEMENT                                 │
│  • Create Event                                                  │
│  • Upload Event Files                                            │
│  • Set Event Details                                             │
│  • Update Event Info                                             │
│  • Delete Event                                                  │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Event Records, Files
       ▼
┌─────────────────────────────────┐
│   D24: Organization Events      │
└─────────────────────────────────┘

┌─────────────┐
│Organization │
└──────┬──────┘
       │
       │ Attendee Data or CSV File
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  7.2 ATTENDEE MANAGEMENT                                         │
│  • Add Individual Attendee                                       │
│  • Bulk Upload Attendees (CSV)                                   │
│  • Update Attendee Info                                          │
│  • Delete Attendee                                               │
│  • Track Attendance                                              │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Attendee Records
       ▼
┌─────────────────────────────────┐
│   D25: Event Attendees          │
└─────────────────────────────────┘

┌─────────────┐
│Organization │
└──────┬──────┘
       │
       │ Guest Speaker Data
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  7.3 GUEST SPEAKER MANAGEMENT                                    │
│  • Add Guest Speakers                                            │
│  • Update Guest Info                                             │
│  • Delete Guest                                                  │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Guest Records
       ▼
┌─────────────────────────────────┐
│   D26: Event Guests             │
└─────────────────────────────────┘

┌─────────────┐
│Organization │
└──────┬──────┘
       │
       │ SDG Assignments
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  7.4 SDG ASSIGNMENT                                              │
│  • Assign SDGs to Event                                          │
│  • Track SDG Alignment                                           │
│  • Generate SDG Reports                                          │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ SDG Records
       ▼
┌─────────────────────────────────┐
│   D27: Event SDGs               │
└─────────────────────────────────┘

┌─────────────┐
│Organization │
│   or Dean   │
└──────┬──────┘
       │
       │ Query Event Analytics
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  7.5 EVENT ANALYTICS                                             │
│  • Calculate Attendance Statistics                               │
│  • Analyze Event Trends                                          │
│  • Generate Event Reports                                        │
│  • Track SDG Impact                                              │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Analytics Data
       ▼
┌─────────────┐
│Organization │
│   or Dean   │
└─────────────┘
```

---

### 2.7 Organization Document Management Subsystem

```
┌─────────────┐
│Organization │
└──────┬──────┘
       │
       │ Document Files, Metadata
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  5.1 DOCUMENT SUBMISSION                                         │
│  • Upload Documents                                              │
│  • Select Document Type                                          │
│  • Add Description                                               │
│  • Track Submission Status                                       │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Document Records, Files
       ▼
┌─────────────────────────────────┐
│   D20: Organization Documents   │
│   D30: Document Types           │
└─────────────────────────────────┘
       │
       │ Document Info
       ▼
┌─────────────┐
│    Dean     │
└──────┬──────┘
       │
       │ Review, Approval
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  5.2 DOCUMENT REVIEW                                             │
│  • View Submitted Documents                                      │
│  • Download Documents                                            │
│  • Approve/Reject                                                │
│  • Add Review Comments                                           │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Review Status, Comments
       ▼
┌─────────────────────────────────┐
│   D20: Organization Documents   │
└─────────────────────────────────┘
       │
       │ Status Update
       ▼
┌─────────────┐
│Organization │
└──────┬──────┘
       │
       │ Query Checklist
       ▼
┌──────────────────────────────────────────────────────────────────┐
│  5.3 SUBMISSION CHECKLIST                                        │
│  • Get Required Document Types                                   │
│  • Check Submission Status                                       │
│  • Calculate Completion %                                        │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Checklist Data
       ▼
┌─────────────┐
│Organization │
└─────────────┘
```

---


## Data Stores

### Complete List of Data Stores

| ID | Data Store | Description |
|----|------------|-------------|
| **D1** | Users | User accounts with authentication credentials |
| **D2** | Admins | Superadmin profiles |
| **D3** | Deans | Dean profiles and department information |
| **D4** | Faculty | Faculty profiles and basic information |
| **D5** | Organizations | Organization profiles and details |
| **D6** | Faculty Credentials | Faculty credential records (TOR, Diploma, etc.) |
| **D7** | Faculty Clearances | Faculty clearance status per academic period |
| **D8** | Requirement Submissions | Faculty requirement submissions |
| **D9** | Faculty Personal Profile | Personal information of faculty |
| **D10** | Faculty Academic Profile | Academic qualifications and education |
| **D11** | Faculty Employment Profile | Employment history and positions |
| **D12** | Faculty Awards | Awards and recognitions received |
| **D13** | Faculty Seminars/Trainings | Seminars and training attended |
| **D14** | Faculty Research Activities | Research projects and publications |
| **D15** | Faculty Extension Activities | Community extension activities |
| **D16** | Personal Data Sheet | Complete PDS records |
| **D17** | PDS Sub-records | Children, Education, Eligibility, etc. |
| **D18** | Requirement Files | Uploaded requirement files |
| **D19** | Organization Advisers | Faculty advisers assigned to organizations |
| **D20** | Organization Documents | Documents submitted by organizations |
| **D21** | Organization Members | Members of organizations |
| **D22** | Bulk Upload History | History of bulk member uploads |
| **D23** | Position Templates | Organization position templates |
| **D24** | Organization Events | Events organized by organizations |
| **D25** | Event Attendees | Attendees of organization events |
| **D26** | Event Guests | Guest speakers at events |
| **D27** | Event SDGs | SDGs aligned with events |
| **D28** | Announcements | Announcements created by deans |
| **D29** | Announcement Reads | Read status of announcements |
| **D30** | Document Types | Types of documents required |
| **D31** | Academic Years | Academic year and semester records |
| **D32** | Credential Certificates | Certificate files for credentials |

---

## External Entities

### 1. SuperAdmin
**Role:** System Administrator
**Responsibilities:**
- Manage all users (Deans, Faculty, Organizations)
- Create and manage academic years
- View system-wide statistics
- Monitor system health

**Inputs to System:**
- User credentials
- Academic year data
- System configurations

**Outputs from System:**
- Dashboard statistics
- User lists
- System reports

---

### 2. Dean
**Role:** Department Head
**Responsibilities:**
- Manage faculty in their department
- Review and approve requirements
- Grant clearances
- Create and manage organizations
- Assign advisers
- Create announcements
- View analytics

**Inputs to System:**
- Faculty data
- Organization data
- Requirement reviews
- Clearance approvals
- Announcements
- Adviser assignments

**Outputs from System:**
- Faculty lists and profiles
- Requirement submissions
- Analytics reports
- Organization dashboards
- Clearance reports

---

### 3. Faculty
**Role:** Teaching Staff
**Responsibilities:**
- Manage personal profile
- Submit requirements
- Maintain PDS
- Update credentials
- View clearance status
- Serve as organization adviser (if assigned)

**Inputs to System:**
- Profile data
- Requirement files
- PDS information
- Credential documents
- Academic records
- Professional activities

**Outputs from System:**
- Profile summary
- Clearance status
- Requirement status
- PDS reports
- Credential verification

---

### 4. Organization
**Role:** Student Organization
**Responsibilities:**
- Manage organization members
- Organize events
- Submit documents
- Track activities
- Maintain member records

**Inputs to System:**
- Member data
- Bulk upload files
- Event information
- Attendee lists
- Document submissions
- SDG alignments

**Outputs from System:**
- Member lists
- Event analytics
- Demographics reports
- Document status
- Upload history

---

## Data Flows

### Major Data Flows in the System

#### 1. Authentication Flow
```
User → Login Credentials → System → JWT Token → User
```

#### 2. Faculty Profile Flow
```
Faculty → Profile Data → System → Validation → Database
Database → Profile Info → System → Display → Faculty
```

#### 3. Requirement Submission Flow
```
Faculty → Files + Metadata → System → Storage → Database
Dean → Review Request → System → Retrieve Files → Dean
Dean → Approval/Rejection → System → Update Status → Database
Database → Status Update → System → Notification → Faculty
```

#### 4. Bulk Upload Flow
```
Organization → CSV File + Department → System → Parse Data
System → Validate Records → System → Insert/Update Members
System → Generate Statistics → System → Store Upload Record
System → Upload Results → Organization
```

#### 5. Event Management Flow
```
Organization → Event Data → System → Create Event → Database
Organization → Attendee CSV → System → Parse → Database
Organization → SDG Selection → System → Link SDGs → Database
System → Event Analytics → Organization/Dean
```

#### 6. Clearance Flow
```
Faculty → Submit Requirements → System → Store Submissions
Dean → Review Submissions → System → Update Status
System → Calculate Clearance → System → Generate Report
System → Clearance Status → Faculty
```

#### 7. PDS Management Flow
```
Faculty/Dean → PDS Data → System → Validate → Database
System → PDS Sections → Database → Store Records
Faculty/Dean → Export Request → System → Generate Excel
System → Excel File → Faculty/Dean
```

#### 8. Organization Document Flow
```
Organization → Document + Type → System → Store File
Dean → Review Request → System → Retrieve Document
Dean → Approval → System → Update Status
System → Checklist → Organization
```

#### 9. Announcement Flow
```
Dean → Announcement + Target → System → Create Record
System → Notification → Faculty (Targeted)
Faculty → Read Announcement → System → Mark as Read
System → Read Statistics → Dean
```

#### 10. Analytics Flow
```
User → Query Parameters → System → Aggregate Data
System → Calculate Statistics → System → Generate Charts
System → Analytics Report → User
```

---


## Detailed Data Flow Descriptions

### 1. User Authentication & Authorization

**Process:** User Login
- **Input:** Email, Password
- **Processing:**
  1. Validate email format
  2. Check if user exists in database
  3. Verify password hash
  4. Generate JWT token with user role
  5. Return token and user information
- **Output:** JWT Token, User Profile
- **Data Stores:** D1 (Users), D2-D5 (Role-specific tables)

**Process:** Password Reset
- **Input:** Email address
- **Processing:**
  1. Verify email exists
  2. Generate reset token
  3. Send email with reset link
  4. Validate token on reset page
  5. Update password hash
- **Output:** Password reset confirmation
- **Data Stores:** D1 (Users)

---

### 2. Faculty Management (Dean Perspective)

**Process:** Create Faculty Account
- **Input:** Faculty details, email
- **Processing:**
  1. Validate faculty data
  2. Generate secure password
  3. Create user account
  4. Create faculty profile
  5. Send credentials via email
- **Output:** Faculty account, credentials email
- **Data Stores:** D1 (Users), D4 (Faculty)

**Process:** Review Requirements
- **Input:** Submission ID, review decision
- **Processing:**
  1. Retrieve submission details
  2. View uploaded files
  3. Add review comments
  4. Update submission status
  5. Notify faculty
- **Output:** Updated submission status
- **Data Stores:** D8 (Requirement Submissions), D18 (Requirement Files)

**Process:** Grant Clearance
- **Input:** Faculty ID, academic period
- **Processing:**
  1. Check all requirement submissions
  2. Verify completion status
  3. Calculate clearance eligibility
  4. Create clearance record
- **Output:** Clearance certificate
- **Data Stores:** D7 (Faculty Clearances), D8 (Requirement Submissions)

---

### 3. Faculty Profile & PDS Management

**Process:** Update Personal Profile
- **Input:** Personal data, photos
- **Processing:**
  1. Validate input data
  2. Upload photos to storage
  3. Update or create profile record
  4. Generate profile URL
- **Output:** Updated profile
- **Data Stores:** D9 (Faculty Personal Profile)

**Process:** Manage Academic Profile
- **Input:** Education records
- **Processing:**
  1. Validate academic data
  2. Create/update education records
  3. Sort by date
  4. Link to faculty profile
- **Output:** Academic history
- **Data Stores:** D10 (Faculty Academic Profile)

**Process:** Manage Professional Activities
- **Input:** Activity data, certificates
- **Processing:**
  1. Validate activity information
  2. Upload certificate files
  3. Store activity records
  4. Link to faculty profile
- **Output:** Activity records
- **Data Stores:** D12-D15 (Awards, Seminars, Research, Extension)

**Process:** Create/Update PDS
- **Input:** Complete PDS data (all sections)
- **Processing:**
  1. Validate PDS data
  2. Create/update main PDS record
  3. Create/update sub-records (children, education, etc.)
  4. Link all records to PDS
  5. Calculate completeness
- **Output:** Complete PDS record
- **Data Stores:** D16 (Personal Data Sheet), D17 (PDS Sub-records)

**Process:** Export PDS to Excel
- **Input:** Faculty ID or Dean ID
- **Processing:**
  1. Retrieve complete PDS data
  2. Retrieve all sub-records
  3. Format data for Excel
  4. Generate Excel file using template
  5. Return file for download
- **Output:** Excel file (CS Form 212)
- **Data Stores:** D16, D17

---

### 4. Requirements & Clearance

**Process:** Submit Requirement
- **Input:** Multiple files (max 10), metadata
- **Processing:**
  1. Validate file types and sizes
  2. Upload files to storage
  3. Create submission record
  4. Create file records for each file
  5. Link files to submission
  6. Set status to "pending"
- **Output:** Submission confirmation
- **Data Stores:** D8 (Requirement Submissions), D18 (Requirement Files)

**Process:** Add Files to Submission
- **Input:** Submission ID, additional files
- **Processing:**
  1. Verify submission exists
  2. Check file count limit
  3. Upload new files
  4. Create file records
  5. Link to existing submission
- **Output:** Updated submission
- **Data Stores:** D8, D18

**Process:** Check Clearance Status
- **Input:** Faculty ID, academic period
- **Processing:**
  1. Retrieve all requirements for period
  2. Check submission status for each
  3. Calculate completion percentage
  4. Determine clearance eligibility
  5. Generate status report
- **Output:** Clearance status report
- **Data Stores:** D7 (Faculty Clearances), D8 (Requirement Submissions)

---

### 5. Organization Management

**Process:** Create Organization
- **Input:** Organization details, advisers
- **Processing:**
  1. Validate organization data
  2. Generate credentials
  3. Create user account
  4. Create organization profile
  5. Assign advisers
  6. Send credentials email
- **Output:** Organization account
- **Data Stores:** D1 (Users), D5 (Organizations), D19 (Organization Advisers)

**Process:** Assign Advisers
- **Input:** Organization ID, faculty IDs
- **Processing:**
  1. Validate faculty exist
  2. Check faculty availability
  3. Create adviser assignments
  4. Set assignment dates
  5. Mark as active
- **Output:** Adviser assignments
- **Data Stores:** D19 (Organization Advisers)

---

### 6. Organization Member Management

**Process:** Add Individual Member
- **Input:** Member details, photo
- **Processing:**
  1. Validate member data
  2. Check for duplicates
  3. Upload photo (if provided)
  4. Create member record
  5. Set as active
- **Output:** Member record
- **Data Stores:** D21 (Organization Members)

**Process:** Bulk Upload Members
- **Input:** CSV/Excel file, department, academic year, term date
- **Processing:**
  1. Validate file format
  2. Parse CSV/Excel data
  3. For each row:
     - Validate required fields
     - Parse student name
     - Check for existing member
     - Insert or update member record
     - Assign department from form
  4. Track statistics (inserted, updated, skipped)
  5. Determine upload status
  6. Create bulk upload record (file name only)
  7. Delete temporary file
- **Output:** Upload results, statistics
- **Data Stores:** D21 (Organization Members), D22 (Bulk Upload History)

**Process:** View Upload History
- **Input:** Organization ID, pagination
- **Processing:**
  1. Retrieve bulk upload records
  2. Include academic year info
  3. Include uploader info
  4. Sort by date (newest first)
  5. Paginate results
- **Output:** Upload history list
- **Data Stores:** D22 (Bulk Upload History)

**Process:** Calculate Demographics
- **Input:** Organization ID
- **Processing:**
  1. Retrieve all active members
  2. Calculate gender distribution
  3. Calculate program distribution
  4. Generate percentages
  5. Create charts data
- **Output:** Demographics report
- **Data Stores:** D21 (Organization Members)

---

### 7. Organization Event Management

**Process:** Create Event
- **Input:** Event details, file
- **Processing:**
  1. Validate event data
  2. Upload event file (if provided)
  3. Create event record
  4. Store file metadata
  5. Set initial status
- **Output:** Event record
- **Data Stores:** D24 (Organization Events)

**Process:** Manage Attendees
- **Input:** Attendee data or CSV file
- **Processing:**
  1. If CSV: Parse file and extract attendees
  2. If individual: Validate attendee data
  3. Create attendee records
  4. Link to event
  5. Track attendance count
- **Output:** Attendee list
- **Data Stores:** D25 (Event Attendees)

**Process:** Assign SDGs
- **Input:** Event ID, SDG selections
- **Processing:**
  1. Validate SDG numbers
  2. Create SDG assignment records
  3. Link to event
  4. Track SDG alignment
- **Output:** SDG assignments
- **Data Stores:** D27 (Event SDGs)

**Process:** Add Guest Speakers
- **Input:** Guest details
- **Processing:**
  1. Validate guest data
  2. Create guest record
  3. Link to event
  4. Store affiliation info
- **Output:** Guest list
- **Data Stores:** D26 (Event Guests)

**Process:** Calculate Event Analytics
- **Input:** Organization ID or Event ID
- **Processing:**
  1. Retrieve event data
  2. Count attendees
  3. Analyze SDG distribution
  4. Calculate trends
  5. Generate charts
- **Output:** Event analytics report
- **Data Stores:** D24, D25, D26, D27

---

### 8. Organization Document Management

**Process:** Submit Document
- **Input:** Document file, type, metadata
- **Processing:**
  1. Validate document type
  2. Upload file to storage
  3. Create document record
  4. Link to organization
  5. Set status to "pending"
- **Output:** Document submission
- **Data Stores:** D20 (Organization Documents), D30 (Document Types)

**Process:** Review Document
- **Input:** Document ID, review decision
- **Processing:**
  1. Retrieve document
  2. Download for review
  3. Add review comments
  4. Update status (approved/rejected)
  5. Record reviewer
- **Output:** Updated document status
- **Data Stores:** D20 (Organization Documents)

**Process:** Get Submission Checklist
- **Input:** Organization ID, academic year
- **Processing:**
  1. Retrieve required document types
  2. Check submission status for each
  3. Calculate completion percentage
  4. Identify missing documents
- **Output:** Checklist with status
- **Data Stores:** D20, D30

---

### 9. Announcement Management

**Process:** Create Announcement
- **Input:** Announcement content, target faculty
- **Processing:**
  1. Validate announcement data
  2. Create announcement record
  3. Link to dean
  4. Set target audience
  5. Set publish date
- **Output:** Announcement record
- **Data Stores:** D28 (Announcements)

**Process:** Mark as Read
- **Input:** Announcement ID, faculty ID
- **Processing:**
  1. Verify announcement exists
  2. Create read record
  3. Set read timestamp
  4. Link to faculty
- **Output:** Read confirmation
- **Data Stores:** D29 (Announcement Reads)

**Process:** Get Read Statistics
- **Input:** Announcement ID
- **Processing:**
  1. Count total target faculty
  2. Count read records
  3. Calculate read percentage
  4. Identify unread faculty
- **Output:** Read statistics
- **Data Stores:** D28, D29

---

### 10. Analytics & Reporting

**Process:** Generate Dashboard Statistics
- **Input:** User role, filters
- **Processing:**
  1. Based on role, aggregate relevant data
  2. Count users, submissions, events, etc.
  3. Calculate percentages
  4. Generate trend data
  5. Create chart data
- **Output:** Dashboard statistics
- **Data Stores:** All relevant data stores

**Process:** Faculty Analytics
- **Input:** Dean ID, filters
- **Processing:**
  1. Retrieve faculty in department
  2. Calculate clearance rates
  3. Analyze requirement submissions
  4. Track credential status
  5. Generate reports
- **Output:** Faculty analytics report
- **Data Stores:** D4, D7, D8, D6

**Process:** Organization Analytics
- **Input:** Dean ID or Organization ID
- **Processing:**
  1. Retrieve organization data
  2. Count members by status
  3. Analyze event participation
  4. Track document submissions
  5. Calculate SDG alignment
- **Output:** Organization analytics
- **Data Stores:** D5, D21, D24, D20, D27

**Process:** Export to Excel
- **Input:** Data type, filters
- **Processing:**
  1. Retrieve filtered data
  2. Format for Excel
  3. Apply styling
  4. Generate Excel file
  5. Return for download
- **Output:** Excel file
- **Data Stores:** Various based on export type

---

