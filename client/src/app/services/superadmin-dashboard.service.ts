import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface SuperadminStatistics {
  total_faculty: number;
  total_deans: number;
  total_departments: number;
  total_files: number;
  total_storage_bytes: number;
  total_storage_mb: number;
  total_storage_gb: number;
  files_by_status: {
    pending: number;
    returned: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SuperadminDashboardService {
  private apiUrl = `${environment.apiUrl}/superadmin/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardStatistics(): Observable<{ success: boolean; statistics: SuperadminStatistics }> {
    return this.http.get<{ success: boolean; statistics: SuperadminStatistics }>(
      `${this.apiUrl}/statistics`,
    );
  }
}
