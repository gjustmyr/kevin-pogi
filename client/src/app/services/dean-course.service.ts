import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Course {
  course_id: number;
  course_code: string;
  course_name: string;
  description?: string;
  department_id: number;
  department?: {
    department_id: number;
    department_name: string;
    department_acronym: string;
  };
}

export interface CreateCourseData {
  course_code: string;
  course_name: string;
  description?: string;
}

export interface UpdateCourseData {
  course_code: string;
  course_name: string;
  description?: string;
}

export interface CourseResponse {
  courses: Course[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

@Injectable({
  providedIn: 'root',
})
export class DeanCourseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dean/courses`;

  getCourses(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Observable<CourseResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<CourseResponse>(this.apiUrl, { params });
  }

  createCourse(data: CreateCourseData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateCourse(id: number, data: UpdateCourseData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
