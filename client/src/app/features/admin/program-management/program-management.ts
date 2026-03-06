import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgramService, Program, CreateProgramData } from '../../../services/program.service';
import { DropdownService, DropdownDepartment } from '../../../services/dropdown.service';
import { SweetAlertService } from '../../../shared/services/sweetalert.service';

@Component({
  selector: 'app-program-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './program-management.html',
  styleUrl: './program-management.css',
})
export class ProgramManagement implements OnInit {
  programsList = signal<Program[]>([]);
  departmentsList = signal<DropdownDepartment[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  searchQuery = signal('');
  selectedDepartmentId = signal<number | undefined>(undefined);
  pageSize = 10;

  // Modal states
  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);

  // Form data
  createForm = {
    program_name: '',
    department_id: 0,
  };
  editForm = {
    program_id: 0,
    program_name: '',
    department_id: 0,
  };
  deleteTarget: Program | null = null;

  // Expose Math for template
  Math = Math;

  constructor(
    private programService: ProgramService,
    private dropdownService: DropdownService,
    private sweetAlert: SweetAlertService,
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
          this.sweetAlert.error('Failed to load programs');
        },
      });
  }

  searchPrograms() {
    this.currentPage.set(1);
    this.loadPrograms();
  }

  filterByDepartment() {
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
    this.createForm = { program_name: '', department_id: 0 };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.createForm = { program_name: '', department_id: 0 };
  }

  submitCreateForm() {
    if (!this.createForm.program_name.trim()) {
      this.sweetAlert.warning('Please enter program name');
      return;
    }
    if (!this.createForm.department_id || this.createForm.department_id === 0) {
      this.sweetAlert.warning('Please select a department');
      return;
    }

    this.loading.set(true);
    this.programService.createProgram(this.createForm).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeCreateModal();
        this.sweetAlert.success('Program created successfully!');
        this.loadPrograms();
      },
      error: (error) => {
        this.loading.set(false);
        this.sweetAlert.error(error.error?.message || 'Failed to create program');
      },
    });
  }

  openEditModal(program: Program) {
    this.editForm = {
      program_id: program.program_id,
      program_name: program.program_name,
      department_id: program.department_id,
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editForm = {
      program_id: 0,
      program_name: '',
      department_id: 0,
    };
  }

  submitEditForm() {
    if (!this.editForm.program_name.trim()) {
      this.sweetAlert.warning('Please enter program name');
      return;
    }
    if (!this.editForm.department_id || this.editForm.department_id === 0) {
      this.sweetAlert.warning('Please select a department');
      return;
    }

    this.loading.set(true);
    this.programService
      .updateProgram(this.editForm.program_id, {
        program_name: this.editForm.program_name,
        department_id: this.editForm.department_id,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.closeEditModal();
          this.sweetAlert.success('Program updated successfully!');
          this.loadPrograms();
        },
        error: (error) => {
          this.loading.set(false);
          this.sweetAlert.error(error.error?.message || 'Failed to update program');
        },
      });
  }

  openDeleteModal(program: Program) {
    this.deleteTarget = program;
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.deleteTarget = null;
  }

  confirmDelete() {
    if (!this.deleteTarget) return;

    this.loading.set(true);
    this.programService.deleteProgram(this.deleteTarget.program_id).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeDeleteModal();
        this.sweetAlert.success('Program deleted successfully!');
        this.loadPrograms();
      },
      error: (error) => {
        this.loading.set(false);
        this.sweetAlert.error(error.error?.message || 'Failed to delete program');
      },
    });
  }
}
