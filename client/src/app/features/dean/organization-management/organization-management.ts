import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Organization,
  CreateOrganizationData,
  DeanOrganizationService,
} from '../../../services/dean-organization.service';
import { DeanFacultyService, Faculty } from '../../../services/dean-faculty.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dean-organization-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './organization-management.html',
  styleUrl: './organization-management.css',
})
export class DeanOrganizationManagement implements OnInit {
  organizationsList = signal<Organization[]>([]);
  facultyList = signal<Faculty[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  searchQuery = signal('');
  pageSize = 10;
  Math = Math;

  showCreateModal = signal(false);
  showEditModal = signal(false);

  createForm: CreateOrganizationData = {
    organization_name: '',
    description: '',
    faculty_id: 0,
    email: '',
    password: '',
  };
  editForm = {
    organization_id: 0,
    organization_name: '',
    description: '',
    faculty_id: 0,
  };

  constructor(
    private organizationService: DeanOrganizationService,
    private facultyService: DeanFacultyService,
  ) {}

  ngOnInit() {
    this.loadFaculty();
    this.loadOrganizations();
  }

  loadFaculty() {
    this.facultyService.getFaculty(1, 1000).subscribe({
      next: (response) => {
        this.facultyList.set(response.faculty);
      },
      error: (error) => {
        console.error('Error loading faculty:', error);
      },
    });
  }

  loadOrganizations() {
    this.loading.set(true);
    this.organizationService
      .getOrganizations(this.currentPage(), this.pageSize, this.searchQuery())
      .subscribe({
        next: (response) => {
          this.organizationsList.set(response.organizations);
          this.currentPage.set(response.currentPage);
          this.totalPages.set(response.totalPages);
          this.totalItems.set(response.totalItems);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading organizations:', error);
          this.loading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load organizations',
            confirmButtonColor: '#2563eb',
          });
        },
      });
  }

  searchOrganizations() {
    this.currentPage.set(1);
    this.loadOrganizations();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadOrganizations();
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
      organization_name: '',
      description: '',
      faculty_id: 0,
      email: '',
      password: '',
    };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  submitCreateForm() {
    if (!this.createForm.organization_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter organization name',
        confirmButtonColor: '#2563eb',
      });
      return;
    }
    if (!this.createForm.faculty_id || this.createForm.faculty_id === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please select a faculty',
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
    if (!this.createForm.password.trim() || this.createForm.password.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter a password (minimum 8 characters)',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    this.loading.set(true);
    this.organizationService.createOrganization(this.createForm).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeCreateModal();
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Organization created successfully',
          confirmButtonColor: '#2563eb',
        });
        this.loadOrganizations();
      },
      error: (error) => {
        this.loading.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to create organization',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  openEditModal(organization: Organization) {
    this.editForm = {
      organization_id: organization.organization_id,
      organization_name: organization.organization_name,
      description: organization.description || '',
      faculty_id: organization.faculty_id,
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  submitEditForm() {
    if (!this.editForm.organization_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter organization name',
        confirmButtonColor: '#2563eb',
      });
      return;
    }
    if (!this.editForm.faculty_id || this.editForm.faculty_id === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please select a faculty',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    this.loading.set(true);
    this.organizationService
      .updateOrganization(this.editForm.organization_id, {
        organization_name: this.editForm.organization_name,
        description: this.editForm.description,
        faculty_id: this.editForm.faculty_id,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.closeEditModal();
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Organization updated successfully',
            confirmButtonColor: '#2563eb',
          });
          this.loadOrganizations();
        },
        error: (error) => {
          this.loading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Failed to update organization',
            confirmButtonColor: '#2563eb',
          });
        },
      });
  }

  openDeleteModal(organization: Organization) {
    Swal.fire({
      title: 'Delete Organization',
      text: `Are you sure you want to delete "${organization.organization_name}"? This will also delete the organization's user account. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#2563eb',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading.set(true);
        this.organizationService.deleteOrganization(organization.organization_id).subscribe({
          next: () => {
            this.loading.set(false);
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Organization deleted successfully',
              confirmButtonColor: '#2563eb',
            });
            this.loadOrganizations();
          },
          error: (error) => {
            this.loading.set(false);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.message || 'Failed to delete organization',
              confirmButtonColor: '#2563eb',
            });
          },
        });
      }
    });
  }

  getFacultyName(organization: Organization): string {
    if (!organization.faculty) return 'N/A';
    return organization.faculty.middle_name
      ? `${organization.faculty.first_name} ${organization.faculty.middle_name} ${organization.faculty.last_name}`
      : `${organization.faculty.first_name} ${organization.faculty.last_name}`;
  }
}
