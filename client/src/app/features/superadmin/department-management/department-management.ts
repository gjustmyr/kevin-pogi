import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SuperadminDepartmentService,
  Department,
  CreateDepartmentData,
} from '../../../services/superadmin-department.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-superadmin-department-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './department-management.html',
  styleUrl: './department-management.css',
})
export class SuperadminDepartmentManagement implements OnInit {
  departmentsList = signal<Department[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  searchQuery = signal('');
  pageSize = 10;
  Math = Math;

  // Modal states
  showCreateModal = signal(false);
  showEditModal = signal(false);

  // Form data
  createForm: CreateDepartmentData = {
    department_name: '',
    department_acronym: '',
    status: 'enabled',
  };
  editForm = {
    department_id: 0,
    department_name: '',
    department_acronym: '',
    status: 'enabled' as 'enabled' | 'disabled',
  };

  constructor(private departmentService: SuperadminDepartmentService) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.loading.set(true);
    this.departmentService
      .getDepartments(this.currentPage(), this.pageSize, this.searchQuery())
      .subscribe({
        next: (response) => {
          this.departmentsList.set(response.departments);
          this.currentPage.set(response.currentPage);
          this.totalPages.set(response.totalPages);
          this.totalItems.set(response.totalItems);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading departments:', error);
          this.loading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load departments',
          });
        },
      });
  }

  searchDepartments() {
    this.currentPage.set(1);
    this.loadDepartments();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadDepartments();
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
      department_name: '',
      department_acronym: '',
      status: 'enabled',
    };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.createForm = {
      department_name: '',
      department_acronym: '',
      status: 'enabled',
    };
  }

  submitCreateForm() {
    if (!this.createForm.department_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter department name',
        confirmButtonColor: '#dc2626',
      });
      return;
    }
    if (!this.createForm.department_acronym.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter department acronym',
        confirmButtonColor: '#dc2626',
      });
      return;
    }

    this.loading.set(true);
    this.departmentService.createDepartment(this.createForm).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeCreateModal();
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Department created successfully',
          confirmButtonColor: '#dc2626',
        });
        this.loadDepartments();
      },
      error: (error) => {
        this.loading.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to create department',
          confirmButtonColor: '#dc2626',
        });
      },
    });
  }

  openEditModal(department: Department) {
    this.editForm = {
      department_id: department.department_id,
      department_name: department.department_name,
      department_acronym: department.department_acronym,
      status: department.status || 'enabled',
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editForm = {
      department_id: 0,
      department_name: '',
      department_acronym: '',
      status: 'enabled',
    };
  }

  submitEditForm() {
    if (!this.editForm.department_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter department name',
        confirmButtonColor: '#dc2626',
      });
      return;
    }
    if (!this.editForm.department_acronym.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter department acronym',
        confirmButtonColor: '#dc2626',
      });
      return;
    }

    this.loading.set(true);
    this.departmentService
      .updateDepartment(this.editForm.department_id, {
        department_name: this.editForm.department_name,
        department_acronym: this.editForm.department_acronym,
        status: this.editForm.status,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.closeEditModal();
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Department updated successfully',
            confirmButtonColor: '#dc2626',
          });
          this.loadDepartments();
        },
        error: (error) => {
          this.loading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Failed to update department',
            confirmButtonColor: '#dc2626',
          });
        },
      });
  }

  openDeleteModal(department: Department) {
    Swal.fire({
      title: 'Delete Department',
      text: `Are you sure you want to delete "${department.department_name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading.set(true);
        this.departmentService.deleteDepartment(department.department_id).subscribe({
          next: () => {
            this.loading.set(false);
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Department deleted successfully',
              confirmButtonColor: '#dc2626',
            });
            this.loadDepartments();
          },
          error: (error) => {
            this.loading.set(false);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.message || 'Failed to delete department',
              confirmButtonColor: '#dc2626',
            });
          },
        });
      }
    });
  }
}
