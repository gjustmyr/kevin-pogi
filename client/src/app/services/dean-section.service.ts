import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Section {
  section_id: number;
  section_name: string;
  year_level: number;
  semester: string;
  program_id: number;
  program?: {
    program_id: number;
    program_name: string;
    program_acronym: string;
    department?: {
      department_id: number;
      department_name: string;
      department_acronym: string;
    };
  };
}

export interface CreateSectionData {
  section_name: string;
  year_level: number;
  semester: string;
  program_id: number;
}

export interface UpdateSectionData {
  section_name: string;
  year_level: number;
  semester: string;
  program_id: number;
}

export interface SectionResponse {
  sections: Section[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

@Injectable({
  providedIn: 'root',
})
export class DeanSectionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dean/sections`;

  getSections(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    programId?: number,
  ): Observable<SectionResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (programId) {
      params = params.set('program_id', programId.toString());
    }

    return this.http.get<SectionResponse>(this.apiUrl, { params });
  }

  createSection(data: CreateSectionData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateSection(id: number, data: UpdateSectionData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteSection(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
