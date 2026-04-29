import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface DeanOrganizationEvent {
  id: number;
  organization_id: number;
  organization_name: string;
  title: string;
  date_implemented: string;
  status: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled';
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: number;
  approval_date?: string;
  rejection_reason?: string;
  start_time?: string;
  end_time?: string;
  description?: string;
  sdgs?: number[];
  file_path?: string;
  original_filename?: string;
  file_size?: number;
  uploaded_at?: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class DeanOrganizationEventsService {
  private apiUrl = `${environment.apiUrl}/dean/organization-events`;

  constructor(private http: HttpClient) {}

  getEvents(): Observable<DeanOrganizationEvent[]> {
    return this.http.get<DeanOrganizationEvent[]>(this.apiUrl);
  }

  downloadEventFile(eventId: number): void {
    this.http
      .get(`${this.apiUrl}/${eventId}/download`, {
        responseType: 'blob',
        observe: 'response',
      })
      .subscribe({
        next: (response) => {
          const blob = response.body;
          if (!blob) return;

          // Get filename from Content-Disposition header
          const contentDisposition = response.headers.get('Content-Disposition');
          let filename = 'event-file.pdf';
          
          if (contentDisposition) {
            // Try to extract filename from Content-Disposition header
            // Format: attachment; filename="filename.pdf" or attachment; filename=filename.pdf
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1].replace(/['"]/g, '');
              // Decode if it's URL encoded
              filename = decodeURIComponent(filename);
            }
          }

          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Download error:', error);
          alert('Failed to download file');
        },
      });
  }

  approveEvent(eventId: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${eventId}/approve`, {});
  }

  rejectEvent(eventId: number, rejectionReason: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${eventId}/reject`, {
      rejection_reason: rejectionReason,
    });
  }
}
