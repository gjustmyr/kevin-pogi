import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Program {
  program_id: number;
  program_name: string;
  program_acronym: string;
  department_id: number;
  status?: 'enabled' | 'disabled';
  department?: {
    department_id: number;
    department_name: string;
    department_acronym: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgramsResponse {
  programs: Program[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface CreateProgramData {
  program_name: string;
  program_acronym: string;
  department_id: number;
  status?: 'enabled' | 'disabled';
}

export interface UpdateProgramData {
  program_name: string;
  program_acronym: string;
  department_id: number;
  status?: 'enabled' | 'disabled';
}

@Injectable({
  providedIn: 'root',
})
export class SuperadminProgramService {
  private apiUrl = `${environment.apiUrl}/superadmin/programs`;

  constructor(private http: HttpClient) {}

  getPrograms(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    department_id?: number,
  ): Observable<ProgramsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search);

    if (department_id) {
      params = params.set('department_id', department_id.toString());
    }

    return this.http.get<ProgramsResponse>(this.apiUrl, { params });
  }

  createProgram(data: CreateProgramData): Observable<{ message: string; program: Program }> {
    return this.http.post<{ message: string; program: Program }>(this.apiUrl, data);
  }

  updateProgram(
    id: number,
    data: UpdateProgramData,
  ): Observable<{ message: string; program: Program }> {
    return this.http.put<{ message: string; program: Program }>(`${this.apiUrl}/${id}`, data);
  }

  deleteProgram(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
