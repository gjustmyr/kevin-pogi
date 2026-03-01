import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Section {
  section_id: number;
  section_name: string;
  year_level: number;
  semester: '1st Sem' | '2nd Sem' | 'Midterm 1' | 'Midterm 2';
  program_id: number;
  program?: {
    program_id: number;
    program_name: string;
    program_acronym: string;
    department?: {
      department_name: string;
      department_acronym: string;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SectionsResponse {
  sections: Section[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface CreateSectionData {
  section_name: string;
  year_level: number;
  semester: '1st Sem' | '2nd Sem' | 'Midterm 1' | 'Midterm 2';
  program_id: number;
}

export interface UpdateSectionData {
  section_name: string;
  year_level: number;
  semester: '1st Sem' | '2nd Sem' | 'Midterm 1' | 'Midterm 2';
  program_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class SuperadminSectionService {
  private apiUrl = `${environment.apiUrl}/superadmin/sections`;

  constructor(private http: HttpClient) {}

  getSections(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    program_id?: number,
  ): Observable<SectionsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search);

    if (program_id) {
      params = params.set('program_id', program_id.toString());
    }

    return this.http.get<SectionsResponse>(this.apiUrl, { params });
  }

  createSection(data: CreateSectionData): Observable<{ message: string; section: Section }> {
    return this.http.post<{ message: string; section: Section }>(this.apiUrl, data);
  }

  updateSection(
    id: number,
    data: UpdateSectionData,
  ): Observable<{ message: string; section: Section }> {
    return this.http.put<{ message: string; section: Section }>(`${this.apiUrl}/${id}`, data);
  }

  deleteSection(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
