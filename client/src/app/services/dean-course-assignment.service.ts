import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface CourseAssignment {
  assignment_id: number;
  faculty_id: number;
  course_id: number;
  section_id: number;
  academic_year_id: number;
  semester: string;
  assigned_by: number;
  assigned_date: string;
  status: string;
  faculty?: {
    faculty_id: number;
    employee_id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
  };
  course?: {
    course_id: number;
    course_code: string;
    course_name: string;
  };
  section?: {
    section_id: number;
    section_name: string;
    year_level: number;
  };
  academic_year?: {
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

export interface BulkCreateAssignmentData {
  assignments: CreateCourseAssignmentData[];
}

export interface BulkCreateResponse {
  message: string;
  created: number;
  errors: number;
  errorDetails: Array<{
    assignment: CreateCourseAssignmentData;
    error: string;
  }>;
}

export interface CourseAssignmentResponse {
  assignments: CourseAssignment[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

@Injectable({
  providedIn: 'root',
})
export class DeanCourseAssignmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dean/course-assignments`;

  getCourseAssignments(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    faculty_id?: number,
    academic_year_id?: number,
    semester?: string,
    status?: string,
  ): Observable<CourseAssignmentResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (faculty_id) {
      params = params.set('faculty_id', faculty_id.toString());
    }

    if (academic_year_id) {
      params = params.set('academic_year_id', academic_year_id.toString());
    }

    if (semester) {
      params = params.set('semester', semester);
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<CourseAssignmentResponse>(this.apiUrl, { params });
  }

  createCourseAssignment(data: CreateCourseAssignmentData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  bulkCreateAssignments(data: BulkCreateAssignmentData): Observable<BulkCreateResponse> {
    return this.http.post<BulkCreateResponse>(`${this.apiUrl}/bulk`, data);
  }

  updateCourseAssignment(id: number, data: Partial<CreateCourseAssignmentData>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteCourseAssignment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getFacultyWorkload(faculty_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/faculty/${faculty_id}/workload`);
  }
}
