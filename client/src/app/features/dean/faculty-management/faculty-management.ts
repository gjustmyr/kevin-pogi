import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DeanFacultyService,
  Faculty,
  CreateFacultyData,
  UpdateFacultyData,
} from '../../../services/dean-faculty.service';
import {
  DropdownService,
  DropdownAcademicYear,
  DropdownPositionLevel,
} from '../../../services/dropdown.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dean-faculty-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './faculty-management.html',
  styleUrl: './faculty-management.css',
})
export class DeanFacultyManagement implements OnInit {
  facultyList = signal<Faculty[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  searchQuery = signal('');
  pageSize = 10;
  Math = Math;

  positionLevels = signal<DropdownPositionLevel[]>([]);

  showCreateModal = signal(false);
  showEditModal = signal(false);

  createForm: CreateFacultyData = {
    employee_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    position_level: '',
  };
  editForm = {
    faculty_id: 0,
    employee_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    position_level: '',
  };

  constructor(
    private facultyService: DeanFacultyService,
    private dropdownService: DropdownService,
  ) {}

  ngOnInit() {
    this.loadFaculty();
    this.loadPositionLevels();
  }

  loadPositionLevels() {
    this.dropdownService.getPositionLevels().subscribe({
      next: (levels) => this.positionLevels.set(levels),
      error: (error) => console.error('Error loading position levels:', error),
    });
  }

  loadFaculty() {
    this.loading.set(true);
    this.facultyService
      .getFaculty(this.currentPage(), this.pageSize, this.searchQuery())
      .subscribe({
        next: (response) => {
          this.facultyList.set(response.faculty);
          this.currentPage.set(response.currentPage);
          this.totalPages.set(response.totalPages);
          this.totalItems.set(response.totalItems);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading faculty:', error);
          this.loading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load faculty',
            confirmButtonColor: '#2563eb',
          });
        },
      });
  }

  searchFaculty() {
    this.currentPage.set(1);
    this.loadFaculty();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadFaculty();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      }
    }

    return pages;
  }

  openCreateModal() {
    this.createForm = {
      employee_id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      contact_number: '',
      position_level: '',
    };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  submitCreateForm() {
    if (!this.createForm.employee_id.trim() || this.createForm.employee_id.length !== 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter a valid 5-digit employee ID',
        confirmButtonColor: '#2563eb',
      });
      return;
    }
    if (!this.createForm.first_name.trim() || !this.createForm.last_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter first name and last name',
        confirmButtonColor: '#2563eb',
      });
      return;
    }
    if (!this.createForm.email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter email',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    this.loading.set(true);
    this.facultyService.createFaculty(this.createForm).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.closeCreateModal();

        if (response.emailSent) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            html: `Faculty created successfully!<br><small>Credentials sent via email to ${this.createForm.email}</small>`,
            confirmButtonColor: '#2563eb',
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Faculty Created - Email Failed',
            html: `
              <p>Faculty account created successfully, but email could not be sent.</p>
              <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; text-align: left;">
                <p><strong>Email:</strong> ${this.createForm.email}</p>
                <p><strong>Password:</strong> <code style="background: #dbeafe; padding: 2px 6px; border-radius: 3px;">${response.generatedPassword}</code></p>
              </div>
              <p style="color: #2563eb; font-size: 14px;"><strong>⚠️ Important:</strong> Please save these credentials and share them with the faculty manually.</p>
            `,
            confirmButtonColor: '#2563eb',
            confirmButtonText: 'I have saved the credentials',
            allowOutsideClick: false,
          });
        }

        this.loadFaculty();
      },
      error: (error) => {
        this.loading.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to create faculty',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  openEditModal(faculty: Faculty) {
    this.editForm = {
      faculty_id: faculty.faculty_id,
      employee_id: faculty.employee_id,
      first_name: faculty.first_name,
      middle_name: faculty.middle_name || '',
      last_name: faculty.last_name,
      email: faculty.email,
      contact_number: faculty.contact_number || '',
      position_level: faculty.position_level || '',
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  submitEditForm() {
    if (!this.editForm.employee_id.trim() || this.editForm.employee_id.length !== 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter a valid 5-digit employee ID',
        confirmButtonColor: '#2563eb',
      });
      return;
    }
    if (!this.editForm.first_name.trim() || !this.editForm.last_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter first name and last name',
        confirmButtonColor: '#2563eb',
      });
      return;
    }
    if (!this.editForm.email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter email',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    this.loading.set(true);
    this.facultyService
      .updateFaculty(this.editForm.faculty_id, {
        employee_id: this.editForm.employee_id,
        first_name: this.editForm.first_name,
        middle_name: this.editForm.middle_name,
        last_name: this.editForm.last_name,
        email: this.editForm.email,
        contact_number: this.editForm.contact_number,
        position_level: this.editForm.position_level,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.closeEditModal();
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Faculty updated successfully',
            confirmButtonColor: '#2563eb',
          });
          this.loadFaculty();
        },
        error: (error) => {
          this.loading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Failed to update faculty',
            confirmButtonColor: '#2563eb',
          });
        },
      });
  }

  openDeleteModal(faculty: Faculty) {
    Swal.fire({
      title: 'Delete Faculty',
      text: `Are you sure you want to delete "${faculty.first_name} ${faculty.last_name}"? This will also delete their user account. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#2563eb',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading.set(true);
        this.facultyService.deleteFaculty(faculty.faculty_id).subscribe({
          next: () => {
            this.loading.set(false);
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Faculty deleted successfully',
              confirmButtonColor: '#2563eb',
            });
            this.loadFaculty();
          },
          error: (error) => {
            this.loading.set(false);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.message || 'Failed to delete faculty',
              confirmButtonColor: '#2563eb',
            });
          },
        });
      }
    });
  }

  getFullName(faculty: Faculty): string {
    return faculty.middle_name
      ? `${faculty.first_name} ${faculty.middle_name} ${faculty.last_name}`
      : `${faculty.first_name} ${faculty.last_name}`;
  }
}
