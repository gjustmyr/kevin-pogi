import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface OrganizationEvent {
  id?: number;
  organization_id?: number;
  title: string;
  date_implemented: string;
  status: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled';
  start_time?: string;
  end_time?: string;
  description?: string;
  sdgs?: number[];
  guests?: EventGuest[];
  attendee_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface EventGuest {
  id?: number;
  event_id?: number;
  guest_name: string;
  guest_title?: string;
  guest_affiliation?: string;
}

export interface EventAttendee {
  id?: number;
  event_id?: number;
  sr_code: string;
  student_name: string;
  email?: string;
  year_level?: string;
  section?: string;
  program?: string;
  department?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrganizationEventService {
  private apiUrl = `${environment.apiUrl}/organization/events`;

  constructor(private http: HttpClient) {}

  getEvents(): Observable<OrganizationEvent[]> {
    return this.http.get<OrganizationEvent[]>(this.apiUrl);
  }

  getEvent(id: number): Observable<OrganizationEvent> {
    return this.http.get<OrganizationEvent>(`${this.apiUrl}/${id}`);
  }

  createEvent(event: OrganizationEvent): Observable<any> {
    return this.http.post(this.apiUrl, event);
  }

  updateEvent(id: number, event: OrganizationEvent): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAttendees(eventId: number): Observable<EventAttendee[]> {
    return this.http.get<EventAttendee[]>(`${this.apiUrl}/${eventId}/attendees`);
  }

  uploadAttendees(eventId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${eventId}/attendees/upload`, formData);
  }

  downloadTemplate(): void {
    window.open(`${this.apiUrl}/template/download`, '_blank');
  }

  deleteAttendee(eventId: number, attendeeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${eventId}/attendees/${attendeeId}`);
  }
}
