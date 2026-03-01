import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DepartmentService,
  Department,
  CreateDepartmentData,
} from '../../../services/department.service';
import { SweetAlertService } from '../../../shared/services/sweetalert.service';

@Component({
  selector: 'app-department-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './department-management.html',
  styleUrl: './department-management.css',
})
export class DepartmentManagementComponent implements OnInit {
  departmentsList = signal<Department[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  searchQuery = signal('');
  pageSize = 10;

  // Modal states
  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  
  // Form data
  createForm = { department_name: '', status: 'enabled' as 'enabled' | 'disabled' };
  editForm = { department_id: 0, department_name: '', status: 'enabled' as 'enabled' | 'disabled' };
  deleteTarget: Department | null = null;
  
  // Expose Math for template
  Math = Math;

  constructor(
    private departmentService: DepartmentService,
    private sweetAlert: SweetAlertService
  ) {}

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
          this.sweetAlert.error('Failed to load departments');
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
    this.createForm = { department_name: '', status: 'enabled' };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.createForm = { department_name: '', status: 'enabled' };
  }

  submitCreateForm() {
    if (!this.createForm.department_name.trim()) {
      this.sweetAlert.warning('Please enter department name');
      return;
    }
    
    this.loading.set(true);
    this.departmentService.createDepartment(this.createForm).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeCreateModal();
        this.sweetAlert.success('Department created successfully!');
        this.loadDepartments();
      },
      error: (error) => {
        this.loading.set(false);
        this.sweetAlert.error(error.error?.message || 'Failed to create department');
      },
    });
  }

  openEditModal(dept: Department) {
    this.editForm = {
      department_id: dept.department_id,
      department_name: dept.department_name,
      status: dept.status
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editForm = { department_id: 0, department_name: '', status: 'enabled' };
  }

  submitEditForm() {
    if (!this.editForm.department_name.trim()) {
      this.sweetAlert.warning('Please enter department name');
      return;
    }
    
    this.loading.set(true);
    this.departmentService.updateDepartment(this.editForm.department_id, {
      department_name: this.editForm.department_name,
      status: this.editForm.status
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeEditModal();
        this.sweetAlert.success('Department updated successfully!');
        this.loadDepartments();
      },
      error: (error) => {
        this.loading.set(false);
        this.sweetAlert.error(error.error?.message || 'Failed to update department');
      },
    });
  }

  openDeleteModal(dept: Department) {
    this.deleteTarget = dept;
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.deleteTarget = null;
  }

  confirmDelete() {
    if (!this.deleteTarget) return;
    
    this.loading.set(true);
    this.departmentService.deleteDepartment(this.deleteTarget.department_id).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeDeleteModal();
        this.sweetAlert.success('Department deleted successfully!');
        this.loadDepartments();
      },
      error: (error) => {
        this.loading.set(false);
        this.sweetAlert.error(error.error?.message || 'Failed to delete department');
      },
    });
  }
}
