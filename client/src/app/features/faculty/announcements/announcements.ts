import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AnnouncementService,
  Announcement,
  AnnouncementsResponse,
} from '../../../services/announcement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-faculty-announcements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcements.html',
})
export class FacultyAnnouncementsComponent implements OnInit {
  private announcementService = inject(AnnouncementService);

  announcements = signal<Announcement[]>([]);
  loading = signal(false);
  showViewModal = signal(false);
  selectedAnnouncement = signal<Announcement | null>(null);
  unreadCount = signal(0);

  // Pagination
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  limit = 10;

  ngOnInit() {
    this.loadAnnouncements();
    this.loadUnreadCount();
  }

  loadAnnouncements() {
    this.loading.set(true);
    this.announcementService.getFacultyAnnouncements(this.currentPage(), this.limit).subscribe({
      next: (response: AnnouncementsResponse) => {
        this.announcements.set(response.announcements);
        this.currentPage.set(response.currentPage);
        this.totalPages.set(response.totalPages);
        this.totalItems.set(response.totalItems);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Load announcements error:', error);
        Swal.fire('Error', 'Failed to load announcements', 'error');
        this.loading.set(false);
      },
    });
  }

  loadUnreadCount() {
    this.announcementService.getUnreadCount().subscribe({
      next: (response) => {
        this.unreadCount.set(response.unreadCount);
      },
      error: (error) => {
        console.error('Load unread count error:', error);
      },
    });
  }

  openViewModal(announcement: Announcement) {
    this.selectedAnnouncement.set(announcement);
    this.showViewModal.set(true);

    // Mark as read if not already read
    if (!announcement.is_read) {
      this.announcementService.markAnnouncementRead(announcement.announcement_id).subscribe({
        next: () => {
          // Update the announcement as read
          announcement.is_read = true;
          this.loadUnreadCount();
        },
        error: (error) => {
          console.error('Mark as read error:', error);
        },
      });
    }
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.selectedAnnouncement.set(null);
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.loadAnnouncements();
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.loadAnnouncements();
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  getDeanName(announcement: Announcement): string {
    if (announcement.Dean) {
      return `${announcement.Dean.first_name} ${announcement.Dean.last_name}`;
    }
    return 'Dean';
  }
}
