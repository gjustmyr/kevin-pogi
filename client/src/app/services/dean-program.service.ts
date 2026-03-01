import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Program {
  program_id: number;
  program_name: string;
  program_acronym?: string;
  department_id: number;
  department?: {
    department_id: number;
    department_name: string;
    department_acronym: string;
  };
}

export interface CreateProgramData {
  program_name: string;
  program_acronym?: string;
}

export interface UpdateProgramData {
  program_name: string;
  program_acronym?: string;
}

export interface ProgramResponse {
  programs: Program[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

@Injectable({
  providedIn: 'root',
})
export class DeanProgramService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dean/programs`;

  getPrograms(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Observable<ProgramResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ProgramResponse>(this.apiUrl, { params });
  }

  createProgram(data: CreateProgramData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateProgram(id: number, data: UpdateProgramData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteProgram(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
