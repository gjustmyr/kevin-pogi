import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Assignment {
  assignment_id: number;
  faculty_id: number;
  course_id: number;
  section_id: number;
  academic_year_id: number;
  semester: string;
  assigned_date: string;
  status: string;
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
  requirement_submissions?: RequirementSubmission[];
}

export interface RequirementSubmission {
  submission_id: number;
  assignment_id: number;
  requirement_type: string;
  file_path: string;
  file_name: string;
  file_size: number;
  submission_date: string;
  status: 'pending' | 'cleared' | 'returned';
  dean_remarks?: string;
  validated_by?: number;
  validated_date?: string;
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

export interface AssignmentsResponse {
  assignments: Assignment[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

@Injectable({
  providedIn: 'root',
})
export class FacultyRequirementService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/faculty/requirements`;

  // Get faculty's course assignments
  getMyAssignments(
    page: number = 1,
    limit: number = 10,
    academic_year_id?: number,
    semester?: string,
  ): Observable<AssignmentsResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (academic_year_id) {
      params = params.set('academic_year_id', academic_year_id.toString());
    }

    if (semester) {
      params = params.set('semester', semester);
    }

    return this.http.get<AssignmentsResponse>(`${this.apiUrl}/assignments`, { params });
  }

  // Get requirements for a specific assignment
  getRequirementsByAssignment(assignment_id: number): Observable<AssignmentWithRequirements> {
    return this.http.get<AssignmentWithRequirements>(
      `${this.apiUrl}/assignments/${assignment_id}/requirements`,
    );
  }

  // Submit a requirement with file
  submitRequirement(assignment_id: number, requirement_type: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('assignment_id', assignment_id.toString());
    formData.append('requirement_type', requirement_type);
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/submit`, formData);
  }

  // Delete a requirement submission
  deleteRequirement(submission_id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${submission_id}`);
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
