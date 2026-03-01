import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { RequirementSubmission, Assignment } from './faculty-requirement.service';

export interface RequirementsResponse {
  requirements: RequirementSubmission[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface FacultyAccomplishment {
  faculty: {
    faculty_id: number;
    employee_id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
  };
  assignments: Assignment[];
  statistics: {
    total_courses: number;
    total_requirements: number;
    submitted: number;
    cleared: number;
    pending: number;
    returned: number;
    not_submitted: number;
    completion_rate: string;
  };
}

export interface DepartmentStatistics {
  total_faculty: number;
  total_courses: number;
  total_requirements: number;
  submitted: number;
  cleared: number;
  pending: number;
  returned: number;
  not_submitted: number;
  completion_rate: string;
}

export interface RequirementStatus {
  requirement_number: number;
  requirement_type: string;
  submission: RequirementSubmission | null;
}

export interface AssignmentWithRequirements {
  assignment: Assignment;
  requirements: RequirementStatus[];
}

@Injectable({
  providedIn: 'root',
})
export class DeanRequirementService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dean/requirements`;

  // Get all requirement submissions for dean's department
  getAllRequirements(
    page: number = 1,
    limit: number = 10,
    faculty_id?: number,
    academic_year_id?: number,
    semester?: string,
    status?: string,
    search?: string,
  ): Observable<RequirementsResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

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

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<RequirementsResponse>(this.apiUrl, { params });
  }

  // Get department-wide statistics
  getDepartmentStatistics(
    academic_year_id?: number,
    semester?: string,
  ): Observable<DepartmentStatistics> {
    let params = new HttpParams();

    if (academic_year_id) {
      params = params.set('academic_year_id', academic_year_id.toString());
    }

    if (semester) {
      params = params.set('semester', semester);
    }

    return this.http.get<DepartmentStatistics>(`${this.apiUrl}/statistics`, { params });
  }

  // Get faculty accomplishment summary
  getFacultyAccomplishment(
    faculty_id: number,
    academic_year_id?: number,
    semester?: string,
  ): Observable<FacultyAccomplishment> {
    let params = new HttpParams();

    if (academic_year_id) {
      params = params.set('academic_year_id', academic_year_id.toString());
    }

    if (semester) {
      params = params.set('semester', semester);
    }

    return this.http.get<FacultyAccomplishment>(
      `${this.apiUrl}/faculty/${faculty_id}/accomplishment`,
      { params }
    );
  }

  // Get requirements for a specific assignment
  getAssignmentRequirements(assignment_id: number): Observable<AssignmentWithRequirements> {
    return this.http.get<AssignmentWithRequirements>(
      `${this.apiUrl}/assignments/${assignment_id}/requirements`
    );
  }

  // Clear a requirement (approve)
  clearRequirement(submission_id: number, remarks?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${submission_id}/clear`, { remarks });
  }

  // Return a requirement (needs revision)
  returnRequirement(submission_id: number, remarks: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${submission_id}/return`, { remarks });
  }

  // Get download URL for a requirement
  getDownloadUrl(submission_id: number): string {
    return `${this.apiUrl}/${submission_id}/download`;
  }

  // Download a requirement file
  downloadRequirement(submission_id: number): void {
    window.open(this.getDownloadUrl(submission_id), '_blank');
  }
}
