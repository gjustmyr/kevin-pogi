import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  OrganizationEventService,
  OrganizationEvent,
  EventGuest,
  EventAttendee,
} from '../../../services/organization-event.service';

@Component({
  selector: 'app-organization-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organization-events.html',
})
export class OrganizationEventsComponent implements OnInit {
  private eventService = inject(OrganizationEventService);

  events = signal<OrganizationEvent[]>([]);
  loading = signal(false);
  showEventModal = signal(false);
  showAttendeesModal = signal(false);
  isEditing = signal(false);

  selectedEvent = signal<OrganizationEvent | null>(null);
  attendees = signal<EventAttendee[]>([]);

  eventForm = signal<OrganizationEvent>({
    title: '',
    date_implemented: '',
    status: 'Planned',
    start_time: '',
    end_time: '',
    description: '',
    sdgs: [],
    guests: [],
  });

  sdgList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  selectedSDGs = signal<number[]>([]);
  guestsList = signal<EventGuest[]>([]);
  newGuest = signal<EventGuest>({ guest_name: '', guest_title: '', guest_affiliation: '' });

  uploadFile: File | null = null;
  uploadMessage = signal('');
  uploadError = signal('');

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading.set(true);
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Load events error:', error);
        this.loading.set(false);
      },
    });
  }

  openEventModal(event?: OrganizationEvent) {
    if (event) {
      this.isEditing.set(true);
      this.eventForm.set({ ...event });
      this.selectedSDGs.set(event.sdgs || []);
      this.guestsList.set(event.guests || []);
    } else {
      this.isEditing.set(false);
      this.eventForm.set({
        title: '',
        date_implemented: '',
        status: 'Planned',
        start_time: '',
        end_time: '',
        description: '',
        sdgs: [],
        guests: [],
      });
      this.selectedSDGs.set([]);
      this.guestsList.set([]);
    }
    this.showEventModal.set(true);
  }

  toggleSDG(sdg: number) {
    const current = this.selectedSDGs();
    if (current.includes(sdg)) {
      this.selectedSDGs.set(current.filter((s) => s !== sdg));
    } else {
      this.selectedSDGs.set([...current, sdg]);
    }
  }

  addGuest() {
    const guest = this.newGuest();
    if (guest.guest_name.trim()) {
      this.guestsList.set([...this.guestsList(), { ...guest }]);
      this.newGuest.set({ guest_name: '', guest_title: '', guest_affiliation: '' });
    }
  }

  removeGuest(index: number) {
    this.guestsList.set(this.guestsList().filter((_, i) => i !== index));
  }

  saveEvent() {
    const form = this.eventForm();
    const eventData = {
      ...form,
      sdgs: this.selectedSDGs(),
      guests: this.guestsList(),
    };

    if (this.isEditing() && form.id) {
      this.eventService.updateEvent(form.id, eventData).subscribe({
        next: () => {
          this.showEventModal.set(false);
          this.loadEvents();
        },
        error: (error) => console.error('Update event error:', error),
      });
    } else {
      this.eventService.createEvent(eventData).subscribe({
        next: () => {
          this.showEventModal.set(false);
          this.loadEvents();
        },
        error: (error) => console.error('Create event error:', error),
      });
    }
  }

  deleteEvent(id: number) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => this.loadEvents(),
        error: (error) => console.error('Delete event error:', error),
      });
    }
  }

  openAttendeesModal(event: OrganizationEvent) {
    this.selectedEvent.set(event);
    this.loadAttendees(event.id!);
    this.showAttendeesModal.set(true);
  }

  loadAttendees(eventId: number) {
    this.eventService.getAttendees(eventId).subscribe({
      next: (data) => this.attendees.set(data),
      error: (error) => console.error('Load attendees error:', error),
    });
  }

  onFileSelected(event: any) {
    this.uploadFile = event.target.files[0];
    this.uploadMessage.set('');
    this.uploadError.set('');
  }

  uploadCSV() {
    if (!this.uploadFile || !this.selectedEvent()) return;

    this.eventService.uploadAttendees(this.selectedEvent()!.id!, this.uploadFile).subscribe({
      next: (response) => {
        this.uploadMessage.set(
          `Successfully uploaded: ${response.inserted} inserted, ${response.skipped} skipped`,
        );
        this.uploadError.set('');
        this.uploadFile = null;
        this.loadAttendees(this.selectedEvent()!.id!);
      },
      error: (error) => {
        this.uploadError.set(error.error?.message || 'Upload failed');
        this.uploadMessage.set('');
      },
    });
  }

  downloadTemplate() {
    this.eventService.downloadTemplate();
  }

  deleteAttendee(attendeeId: number) {
    if (confirm('Remove this attendee?')) {
      this.eventService.deleteAttendee(this.selectedEvent()!.id!, attendeeId).subscribe({
        next: () => this.loadAttendees(this.selectedEvent()!.id!),
        error: (error) => console.error('Delete attendee error:', error),
      });
    }
  }

  getStatusColor(status: string): string {
    const colors: any = {
      Planned: 'bg-blue-100 text-blue-800',
      Ongoing: 'bg-yellow-100 text-yellow-800',
      Completed: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}
