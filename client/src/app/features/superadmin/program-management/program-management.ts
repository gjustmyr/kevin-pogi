import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SuperadminProgramService,
  Program,
  CreateProgramData,
} from '../../../services/superadmin-program.service';
import { DropdownService, DropdownDepartment } from '../../../services/dropdown.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-superadmin-program-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './program-management.html',
  styleUrl: './program-management.css',
})
export class SuperadminProgramManagement implements OnInit {
  programsList = signal<Program[]>([]);
  departmentsList = signal<DropdownDepartment[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  searchQuery = signal('');
  selectedDepartmentId = signal<number | undefined>(undefined);
  pageSize = 10;
  Math = Math;

  // Modal states
  showCreateModal = signal(false);
  showEditModal = signal(false);

  // Form data
  createForm: CreateProgramData = {
    program_name: '',
    program_acronym: '',
    department_id: 0,
    status: 'enabled',
  };
  editForm = {
    program_id: 0,
    program_name: '',
    program_acronym: '',
    department_id: 0,
    status: 'enabled' as 'enabled' | 'disabled',
  };

  constructor(
    private programService: SuperadminProgramService,
    private dropdownService: DropdownService,
  ) {}

  ngOnInit() {
    this.loadDepartments();
    this.loadPrograms();
  }

  loadDepartments() {
    this.dropdownService.getDepartments().subscribe({
      next: (departments) => {
        this.departmentsList.set(departments);
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      },
    });
  }

  loadPrograms() {
    this.loading.set(true);
    this.programService
      .getPrograms(
        this.currentPage(),
        this.pageSize,
        this.searchQuery(),
        this.selectedDepartmentId(),
      )
      .subscribe({
        next: (response) => {
          this.programsList.set(response.programs);
          this.currentPage.set(response.currentPage);
          this.totalPages.set(response.totalPages);
          this.totalItems.set(response.totalItems);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading programs:', error);
          this.loading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load programs',
            confirmButtonColor: '#dc2626',
          });
        },
      });
  }

  searchPrograms() {
    this.currentPage.set(1);
    this.loadPrograms();
  }

  filterByDepartment(departmentId: string) {
    this.selectedDepartmentId.set(departmentId ? Number(departmentId) : undefined);
    this.currentPage.set(1);
    this.loadPrograms();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadPrograms();
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
      program_name: '',
      program_acronym: '',
      department_id: 0,
      status: 'enabled',
    };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  submitCreateForm() {
    if (!this.createForm.program_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter program name',
        confirmButtonColor: '#dc2626',
      });
      return;
    }
    if (!this.createForm.department_id || this.createForm.department_id === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please select a department',
        confirmButtonColor: '#dc2626',
      });
      return;
    }

    this.loading.set(true);
    this.programService.createProgram(this.createForm).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeCreateModal();
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Program created successfully',
          confirmButtonColor: '#dc2626',
        });
        this.loadPrograms();
      },
      error: (error) => {
        this.loading.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to create program',
          confirmButtonColor: '#dc2626',
        });
      },
    });
  }

  openEditModal(program: Program) {
    this.editForm = {
      program_id: program.program_id,
      program_name: program.program_name,
      program_acronym: program.program_acronym,
      department_id: program.department_id,
      status: program.status || 'enabled',
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  submitEditForm() {
    if (!this.editForm.program_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter program name',
        confirmButtonColor: '#dc2626',
      });
      return;
    }
    if (!this.editForm.department_id || this.editForm.department_id === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please select a department',
        confirmButtonColor: '#dc2626',
      });
      return;
    }

    this.loading.set(true);
    this.programService
      .updateProgram(this.editForm.program_id, {
        program_name: this.editForm.program_name,
        program_acronym: this.editForm.program_acronym,
        department_id: this.editForm.department_id,
        status: this.editForm.status,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.closeEditModal();
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Program updated successfully',
            confirmButtonColor: '#dc2626',
          });
          this.loadPrograms();
        },
        error: (error) => {
          this.loading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Failed to update program',
            confirmButtonColor: '#dc2626',
          });
        },
      });
  }

  openDeleteModal(program: Program) {
    Swal.fire({
      title: 'Delete Program',
      text: `Are you sure you want to delete "${program.program_name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading.set(true);
        this.programService.deleteProgram(program.program_id).subscribe({
          next: () => {
            this.loading.set(false);
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Program deleted successfully',
              confirmButtonColor: '#dc2626',
            });
            this.loadPrograms();
          },
          error: (error) => {
            this.loading.set(false);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.message || 'Failed to delete program',
              confirmButtonColor: '#dc2626',
            });
          },
        });
      }
    });
  }
}
