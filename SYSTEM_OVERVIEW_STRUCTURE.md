# Project Overview

Here is an overview of the developed information system.

## COLLEGE-BASED CENTRALIZED SYSTEM FOR FACULTY AND STUDENT ORGANIZATION MANAGEMENT
System

---

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         DEAN PORTAL                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Dashboard   │  │   Faculty    │  │Organization  │  │  Analytics   │  │     PDS      │  │   Settings   │
│              │  │  Management  │  │  Management  │  │  & Reports   │  │  Management  │  │              │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │                 │                 │                 │
       ▼                 ▼                 ▼                 ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ View Faculty │  │   Manage     │  │   Manage     │  │  Generate    │  │   Manage     │  │    Change    │
│  Analytics   │  │   Faculty    │  │Organization  │  │   Faculty    │  │   Faculty    │  │   Academic   │
│              │  │   Records    │  │   Records    │  │   Reports    │  │     PDS      │  │     Year     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     View     │  │     View     │  │     View     │  │  Generate    │  │   Export     │  │    Manage    │
│Organization  │  │   Faculty    │  │Organization  │  │Organization  │  │   PDS Data   │  │     Dean     │
│  Analytics   │  │ Information  │  │  Activities  │  │   Reports    │  │              │  │   Profile    │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     View     │  │     Track    │  │   Approve    │  │   Download   │  │     Bulk     │  │  Configure   │
│   Summary    │  │   Faculty    │  │Organization  │  │    Excel     │  │     PDS      │  │    System    │
│   of Data    │  │ Credentials  │  │    Events    │  │   Reports    │  │  Operations  │  │   Settings   │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
                  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
                  │   Monitor    │  │   Monitor    │  │     View     │  │   Validate   │  │    Manage    │
                  │   Faculty    │  │Organization  │  │ Performance  │  │     PDS      │  │Notifications │
                  │Requirements  │  │  Compliance  │  │   Metrics    │  │ Information  │  │              │
                  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       FACULTY PORTAL                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Dashboard   │  │   Profile    │  │Requirements  │  │ Credentials  │  │     PDS      │  │  Documents   │
│              │  │  Management  │  │  Management  │  │  Management  │  │  Management  │  │              │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │                 │                 │                 │
       ▼                 ▼                 ▼                 ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     View     │  │    Update    │  │    Submit    │  │    Upload    │  │   Fill PDS   │  │    Upload    │
│   Personal   │  │   Personal   │  │   Required   │  │Certificates  │  │     Form     │  │  Documents   │
│  Analytics   │  │ Information  │  │  Documents   │  │              │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     View     │  │    Manage    │  │     Track    │  │    Manage    │  │    Update    │  │    Manage    │
│Requirements  │  │   Contact    │  │  Submission  │  │   Training   │  │     PDS      │  │   Document   │
│    Status    │  │   Details    │  │    Status    │  │   Records    │  │ Information  │  │  Repository  │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     View     │  │    Upload    │  │     View     │  │     Track    │  │  Submit PDS  │  │     View     │
│Notifications │  │   Profile    │  │   Deadline   │  │ Professional │  │  for Review  │  │   Document   │
│              │  │   Picture    │  │   Reminders  │  │ Development  │  │              │  │   History    │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
                  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
                  │     View     │  │   Download   │  │     View     │  │   Download   │  │   Download   │
                  │   Profile    │  │Requirements  │  │  Credential  │  │   PDS Copy   │  │  Documents   │
                  │   History    │  │     List     │  │    Status    │  │              │  │              │
                  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    ORGANIZATION PORTAL                                           │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Dashboard   │  │   Members    │  │    Events    │  │  Documents   │  │   Activity   │  │  Reports &   │
│              │  │  Management  │  │  Management  │  │  Management  │  │   Tracking   │  │  Analytics   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │                 │                 │                 │
       ▼                 ▼                 ▼                 ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     View     │  │  Add/Edit/   │  │    Create    │  │    Upload    │  │     Log      │  │     View     │
│Organization  │  │    Remove    │  │    Events    │  │Organization  │  │Organization  │  │   Activity   │
│  Analytics   │  │   Members    │  │              │  │  Documents   │  │  Activities  │  │   Reports    │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     View     │  │    Manage    │  │    Manage    │  │    Manage    │  │     Track    │  │   Generate   │
│    Event     │  │    Member    │  │    Event     │  │   Activity   │  │     SDG      │  │    Member    │
│   Calendar   │  │     Roles    │  │   Details    │  │   Reports    │  │  Alignment   │  │   Reports    │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     View     │  │     View     │  │     Track    │  │    Submit    │  │    Record    │  │   Download   │
│    Member    │  │    Member    │  │    Event     │  │  Financial   │  │   Community  │  │    Event     │
│  Statistics  │  │ Information  │  │  Attendance  │  │   Records    │  │   Service    │  │   Reports    │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
                  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
                  │     Track    │  │   Generate   │  │     Track    │  │   Generate   │  │     View     │
                  │    Member    │  │    Event     │  │   Document   │  │   Activity   │  │ Performance  │
                  │    Status    │  │   Reports    │  │    Status    │  │   Reports    │  │   Metrics    │
                  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
                                    ┌──────────────┐                                        
                                    │   Publish    │                                        
                                    │    Event     │                                        
                                    │ Information  │                                        
                                    └──────────────┘                                        
                                    ┌──────────────┐                                        
                                    │     Bulk     │                                        
                                    │    Member    │                                        
                                    │    Upload    │                                        
                                    └──────────────┘                                        


┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   SYSTEM ADMINISTRATION                                          │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐
│    Others    │  │   Settings   │
│              │  │              │
└──────┬───────┘  └──────┬───────┘
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│   Download   │  │    Change    │
│  and Upload  │  │   Academic   │
│  forms/files │  │     Year     │
│ for sharing  │  │              │
└──────────────┘  └──────────────┘
                  ┌──────────────┐
                  │    Create    │
                  │   Database   │
                  │Configuration │
                  │     File     │
                  └──────────────┘
                  ┌──────────────┐
                  │   Sanitize   │
                  │     Data     │
                  │              │
                  └──────────────┘
                  ┌──────────────┐
                  │    Manage    │
                  │     User     │
                  │ Permissions  │
                  └──────────────┘
```

---

*Figure 1. System Structure*

---

## SYSTEM FEATURES BREAKDOWN

### **DEAN PORTAL**
The Dean Portal serves as the central management hub for college administrators, providing comprehensive oversight of faculty and student organizations.

**Key Features:**
- **Dashboard**: Real-time analytics and summary of faculty and organization data
- **Faculty Management**: Complete faculty record management, credential tracking, and requirement monitoring
- **Organization Management**: Oversight of student organizations, event approvals, and compliance monitoring
- **Analytics & Reports**: Generate detailed reports, download Excel exports, and view performance metrics
- **PDS Management**: Manage, export, and validate Personal Data Sheets for faculty and dean
- **Settings**: Configure academic year, manage profile, and system settings

### **FACULTY PORTAL**
The Faculty Portal empowers faculty members to manage their professional information, credentials, and requirements efficiently.

**Key Features:**
- **Dashboard**: Personal analytics, requirements status, and notifications
- **Profile Management**: Update personal information, contact details, and profile picture
- **Requirements Management**: Submit documents, track submission status, and view deadlines
- **Credentials Management**: Upload certificates, manage training records, and track professional development
- **PDS Management**: Fill, update, and submit Personal Data Sheet for review
- **Documents**: Upload, manage, and download documents with version history

### **ORGANIZATION PORTAL**
The Organization Portal enables student organizations to manage members, events, and activities with comprehensive tracking capabilities.

**Key Features:**
- **Dashboard**: Organization analytics, event calendar, and member statistics
- **Members Management**: Add/edit/remove members, manage roles, track status, and bulk upload
- **Events Management**: Create events, manage details, track attendance, generate reports, and publish information
- **Documents Management**: Upload documents, manage activity reports, submit financial records, and track status
- **Activity Tracking**: Log activities, track SDG alignment, record community service, and generate reports
- **Reports & Analytics**: View activity reports, generate member reports, download event reports, and view metrics

### **SYSTEM ADMINISTRATION**
Administrative functions for system configuration and data management.

**Key Features:**
- **Others**: Download and upload forms/files for sharing across the system
- **Settings**: Change academic year, create database configuration, sanitize data, and manage user permissions

---

## TECHNICAL ARCHITECTURE

**Frontend Technologies:**
- HTML5, CSS3, JavaScript, TypeScript
- Angular Framework (v20.3.0)
- Tailwind CSS for responsive design
- Chart.js for data visualization

**Backend Technologies:**
- Node.js with Express.js
- MySQL Database (Sequelize ORM)
- RESTful API Architecture
- JWT Authentication

**Security Features:**
- Password encryption (bcrypt)
- Role-based access control
- Input validation and sanitization
- SQL injection prevention
- XSS protection

---

## SYSTEM WORKFLOW

```
┌─────────────────────────────────────────────────────────────┐
│                        USER LOGIN                            │
│                  (Email & Password)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   Authentication Check      │
        │   (Role Verification)       │
        └────────┬───────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌────────┐  ┌─────────┐  ┌──────────────┐
│  DEAN  │  │ FACULTY │  │ ORGANIZATION │
│ PORTAL │  │ PORTAL  │  │   PORTAL     │
└────────┘  └─────────┘  └──────────────┘
    │            │              │
    ▼            ▼              ▼
┌────────────────────────────────────┐
│      CENTRALIZED DATABASE          │
│  (Faculty, Organizations, Events,  │
│   Documents, Analytics, Reports)   │
└────────────────────────────────────┘
```

---

## DATA FLOW ARCHITECTURE

```
USER INTERFACE (Frontend - Angular)
         ↕
    API LAYER (RESTful Endpoints)
         ↕
BUSINESS LOGIC (Backend - Express.js)
         ↕
DATA ACCESS LAYER (Sequelize Models)
         ↕
   DATABASE (MySQL - 49 Tables)
```

---

## KEY BENEFITS

**For College Administrators (Dean):**
- Centralized oversight of faculty and organizations
- Real-time analytics and reporting
- Streamlined approval workflows
- Data-driven decision making

**For Faculty Members:**
- Simplified document management
- Automated requirement tracking
- Professional development records
- Secure credential storage

**For Student Organizations:**
- Efficient member management
- Event planning and tracking
- Activity documentation
- SDG alignment reporting

**For the Institution:**
- Improved operational efficiency
- Enhanced data accuracy
- Better compliance tracking
- Reduced administrative overhead

---

**Developed by:** Computer Engineering Technology Students  
**Institution:** Batangas State University - Lipa Campus  
**Technologies:** HTML, CSS, JavaScript, TypeScript, Angular, Node.js, Express.js, MySQL  
**Testing:** Functional Testing, Monkey Testing, Compatibility Testing, Security Testing  
**Quality Standard:** ISO 25010 Compliance
