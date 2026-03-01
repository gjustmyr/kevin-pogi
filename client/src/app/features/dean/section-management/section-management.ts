import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DeanSectionService,
  Section,
  CreateSectionData,
  UpdateSectionData,
} from '../../../services/dean-section.service';
import { DropdownService, DropdownProgram } from '../../../services/dropdown.service';
import { Auth } from '../../../services/auth/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dean-section-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './section-management.html',
  styleUrl: './section-management.css',
})
export class DeanSectionManagement implements OnInit {
  sectionList = signal<Section[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  searchQuery = signal('');
  filterProgramId = signal<number | undefined>(undefined);
  pageSize = 10;
  Math = Math;

  showCreateModal = signal(false);
  showEditModal = signal(false);

  programsList = signal<DropdownProgram[]>([]);

  createForm: CreateSectionData = {
    section_name: '',
    year_level: 1,
    semester: '1st Sem',
    program_id: 0,
  };

  editForm: UpdateSectionData & { section_id: number } = {
    section_id: 0,
    section_name: '',
    year_level: 1,
    semester: '1st Sem',
    program_id: 0,
  };

  yearLevels = [1, 2, 3, 4];
  semesters = ['1st Sem', '2nd Sem', 'Midterm 1', 'Midterm 2'];

  constructor(
    private sectionService: DeanSectionService,
    private dropdownService: DropdownService,
    private authService: Auth,
  ) {}

  ngOnInit() {
    this.loadPrograms();
    this.loadSections();
  }

  loadPrograms() {
    const departmentId = this.authService.currentUser()?.profile?.department_id;
    this.dropdownService.getPrograms(departmentId).subscribe({
      next: (programs) => {
        this.programsList.set(programs);
      },
      error: (error) => {
        console.error('Error loading programs:', error);
      },
    });
  }

  loadSections() {
    this.loading.set(true);
    this.sectionService
      .getSections(this.currentPage(), this.pageSize, this.searchQuery(), this.filterProgramId())
      .subscribe({
        next: (response) => {
          this.sectionList.set(response.sections);
          this.currentPage.set(response.currentPage);
          this.totalPages.set(response.totalPages);
          this.totalItems.set(response.totalItems);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading sections:', error);
          this.loading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load sections',
            confirmButtonColor: '#2563eb',
          });
        },
      });
  }

  searchSections() {
    this.currentPage.set(1);
    this.loadSections();
  }

  applyFilters() {
    this.currentPage.set(1);
    this.loadSections();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadSections();
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
      section_name: '',
      year_level: 1,
      semester: '1st Sem',
      program_id: this.programsList().length > 0 ? this.programsList()[0].program_id : 0,
    };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  submitCreateForm() {
    if (
      !this.createForm.section_name ||
      !this.createForm.year_level ||
      !this.createForm.semester ||
      !this.createForm.program_id
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    this.sectionService.createSection(this.createForm).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Section created successfully',
          confirmButtonColor: '#2563eb',
        });
        this.closeCreateModal();
        this.loadSections();
      },
      error: (error) => {
        console.error('Error creating section:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to create section',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  openEditModal(section: Section) {
    this.editForm = {
      section_id: section.section_id,
      section_name: section.section_name,
      year_level: section.year_level,
      semester: section.semester,
      program_id: section.program_id,
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  submitEditForm() {
    if (
      !this.editForm.section_name ||
      !this.editForm.year_level ||
      !this.editForm.semester ||
      !this.editForm.program_id
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    const { section_id, ...updateData } = this.editForm;
    this.sectionService.updateSection(section_id, updateData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Section updated successfully',
          confirmButtonColor: '#2563eb',
        });
        this.closeEditModal();
        this.loadSections();
      },
      error: (error) => {
        console.error('Error updating section:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to update section',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  openDeleteModal(section: Section) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: `Do you want to delete ${section.section_name}? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteSection(section.section_id);
      }
    });
  }

  deleteSection(sectionId: number) {
    this.sectionService.deleteSection(sectionId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Section has been deleted successfully',
          confirmButtonColor: '#2563eb',
        });
        this.loadSections();
      },
      error: (error) => {
        console.error('Error deleting section:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to delete section',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  getProgramName(programId: number): string {
    const program = this.programsList().find((p) => p.program_id === programId);
    return program ? program.program_name : 'N/A';
  }

  getYearLabel(year: number): string {
    const labels = ['1st year', '2nd year', '3rd year', '4th year'];
    return labels[year - 1] || `${year}th year`;
  }
}
