import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DeanProgramService,
  Program,
  CreateProgramData,
  UpdateProgramData,
} from '../../../services/dean-program.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dean-program-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './program-management.html',
  styleUrl: './program-management.css',
})
export class DeanProgramManagement implements OnInit {
  programList = signal<Program[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  searchQuery = signal('');
  pageSize = 10;
  Math = Math;

  showCreateModal = signal(false);
  showEditModal = signal(false);

  createForm: CreateProgramData = {
    program_name: '',
    program_acronym: '',
  };

  editForm: UpdateProgramData & { program_id: number } = {
    program_id: 0,
    program_name: '',
    program_acronym: '',
  };

  constructor(private programService: DeanProgramService) {}

  ngOnInit() {
    this.loadPrograms();
  }

  loadPrograms() {
    this.loading.set(true);
    this.programService
      .getPrograms(this.currentPage(), this.pageSize, this.searchQuery())
      .subscribe({
        next: (response) => {
          this.programList.set(response.programs);
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
            confirmButtonColor: '#2563eb',
          });
        },
      });
  }

  searchPrograms() {
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
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
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
    };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  submitCreateForm() {
    if (!this.createForm.program_name) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter the program name',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    this.programService.createProgram(this.createForm).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Program created successfully',
          confirmButtonColor: '#2563eb',
        });
        this.closeCreateModal();
        this.loadPrograms();
      },
      error: (error) => {
        console.error('Error creating program:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to create program',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  openEditModal(program: Program) {
    this.editForm = {
      program_id: program.program_id,
      program_name: program.program_name,
      program_acronym: program.program_acronym || '',
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  submitEditForm() {
    if (!this.editForm.program_name) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter the program name',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    const { program_id, ...updateData } = this.editForm;
    this.programService.updateProgram(program_id, updateData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Program updated successfully',
          confirmButtonColor: '#2563eb',
        });
        this.closeEditModal();
        this.loadPrograms();
      },
      error: (error) => {
        console.error('Error updating program:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to update program',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  openDeleteModal(program: Program) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: `Do you want to delete ${program.program_name}? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProgram(program.program_id);
      }
    });
  }

  deleteProgram(programId: number) {
    this.programService.deleteProgram(programId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Program has been deleted successfully',
          confirmButtonColor: '#2563eb',
        });
        this.loadPrograms();
      },
      error: (error) => {
        console.error('Error deleting program:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to delete program',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }
}
