import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Department {
  department_id: number;
  department_name: string;
  status: 'enabled' | 'disabled';
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentsResponse {
  departments: Department[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface CreateDepartmentData {
  department_name: string;
  status: 'enabled' | 'disabled';
}

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/admin/departments';

  getDepartments(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Observable<DepartmentsResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<DepartmentsResponse>(this.apiUrl, { params });
  }

  getActiveDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/active`);
  }

  createDepartment(
    data: CreateDepartmentData,
  ): Observable<{ message: string; department: Department }> {
    return this.http.post<{ message: string; department: Department }>(this.apiUrl, data);
  }

  updateDepartment(
    id: number,
    data: CreateDepartmentData,
  ): Observable<{ message: string; department: Department }> {
    return this.http.put<{ message: string; department: Department }>(`${this.apiUrl}/${id}`, data);
  }

  deleteDepartment(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
