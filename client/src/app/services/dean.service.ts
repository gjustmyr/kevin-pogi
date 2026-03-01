import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Dean {
  dean_id: number;
  user_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  contact_number: string;
  department_id?: number;
  created_at: string;
  updated_at: string;
  user: {
    user_id: number;
    email: string;
    role: string;
  };
  department?: {
    department_id: number;
    department_name: string;
  };
}

export interface DeansResponse {
  deans: Dean[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface Department {
  department_id: number;
  department_name: string;
}

export interface CreateDeanData {
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  contact_number: string;
  department_id?: number;
}

@Injectable({
  providedIn: 'root',
})
export class DeanService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/admin/deans';

  getDeans(page: number = 1, limit: number = 10): Observable<DeansResponse> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<DeansResponse>(this.apiUrl, { params });
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments`);
  }

  createDean(data: CreateDeanData): Observable<{ message: string; dean: Dean }> {
    return this.http.post<{ message: string; dean: Dean }>(this.apiUrl, data);
  }

  updateDean(id: number, data: CreateDeanData): Observable<{ message: string; dean: Dean }> {
    return this.http.put<{ message: string; dean: Dean }>(`${this.apiUrl}/${id}`, data);
  }

  deleteDean(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
