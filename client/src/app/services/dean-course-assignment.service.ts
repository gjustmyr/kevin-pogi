import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CourseAssignment {
  assignment_id: number;
  faculty_id: number;
  course_id: number;
  section_id: number;
  academic_year_id: number;
  semester: string;
  created_at: string;
  updated_at: string;
  Faculty?: {
    faculty_id: number;
    employee_id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
  };
  Course?: {
    course_id: number;
    course_code: string;
    course_name: string;
    year_level: number;
  };
  Section?: {
    section_id: number;
    section_name: string;
    year_level: number;
    semester: string;
  };
  AcademicYear?: {
    academic_year_id: number;
    year_start: number;
    year_end: number;
  };
}

export interface CreateCourseAssignmentData {
  faculty_id: number;
  course_id: number;
  section_id: number;
  academic_year_id: number;
  semester: string;
}

export interface BulkCreateAssignmentsData {
  assignments: CreateCourseAssignmentData[];
}

export interface BulkCreateResponse {
  created: number;
  errors: number;
  results: Array<{
    success: boolean;
    assignment?: CourseAssignment;
    error?: string;
  }>;
}

export interface GetAssignmentsResponse {
  assignments: CourseAssignment[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface FacultyWorkload {
  faculty_id: number;
  employee_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  total_assignments: number;
  assignments_by_semester: Array<{
    semester: string;
    count: number;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class DeanCourseAssignmentService {
  private apiUrl = 'http://localhost:3000/api/dean/course-assignments';

  constructor(private http: HttpClient) {}

  getAssignments(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    facultyId?: number,
    academicYearId?: number,
    semester?: string,
  ): Observable<GetAssignmentsResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (facultyId) {
      params = params.set('faculty_id', facultyId.toString());
    }
    if (academicYearId) {
      params = params.set('academic_year_id', academicYearId.toString());
    }
    if (semester) {
      params = params.set('semester', semester);
    }

    return this.http.get<GetAssignmentsResponse>(this.apiUrl, { params });
  }

  getAssignmentById(assignmentId: number): Observable<CourseAssignment> {
    return this.http.get<CourseAssignment>(`${this.apiUrl}/${assignmentId}`);
  }

  createAssignment(data: CreateCourseAssignmentData): Observable<CourseAssignment> {
    return this.http.post<CourseAssignment>(this.apiUrl, data);
  }

  bulkCreateAssignments(data: BulkCreateAssignmentsData): Observable<BulkCreateResponse> {
    return this.http.post<BulkCreateResponse>(`${this.apiUrl}/bulk`, data);
  }

  updateAssignment(
    assignmentId: number,
    data: Partial<CreateCourseAssignmentData>,
  ): Observable<CourseAssignment> {
    return this.http.put<CourseAssignment>(`${this.apiUrl}/${assignmentId}`, data);
  }

  deleteAssignment(assignmentId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${assignmentId}`);
  }

  getFacultyWorkload(facultyId: number): Observable<{
    faculty: {
      faculty_id: number;
      employee_id: string;
      name: string;
    };
    workload: {
      totalCourses: number;
      bySemester: { [key: string]: number };
      byAcademicYear: { [key: string]: number };
    };
    assignments: CourseAssignment[];
  }> {
    return this.http.get<any>(`${this.apiUrl}/faculty/${facultyId}/workload`);
  }
}
