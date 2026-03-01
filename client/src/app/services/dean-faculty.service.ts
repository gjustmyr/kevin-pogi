import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Faculty {
  faculty_id: number;
  employee_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  contact_number?: string;
  department_id: number;
  user_id: number;
  department?: {
    department_id: number;
    department_name: string;
    department_acronym: string;
  };
}

export interface CreateFacultyData {
  employee_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  contact_number?: string;
}

export interface UpdateFacultyData {
  employee_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  contact_number?: string;
}

export interface FacultyResponse {
  faculty: Faculty[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

@Injectable({
  providedIn: 'root',
})
export class DeanFacultyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dean/faculty`;

  getFaculty(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Observable<FacultyResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<FacultyResponse>(this.apiUrl, { params });
  }

  createFaculty(data: CreateFacultyData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateFaculty(id: number, data: UpdateFacultyData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteFaculty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
