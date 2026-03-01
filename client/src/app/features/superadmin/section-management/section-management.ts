import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SuperadminSectionService,
  Section,
  CreateSectionData,
} from '../../../services/superadmin-section.service';
import { DropdownService, DropdownProgram } from '../../../services/dropdown.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-superadmin-section-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './section-management.html',
  styleUrl: './section-management.css',
})
export class SuperadminSectionManagement implements OnInit {
  sectionsList = signal<Section[]>([]);
  programsList = signal<DropdownProgram[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  searchQuery = signal('');
  selectedProgramId = signal<number | undefined>(undefined);
  pageSize = 10;
  Math = Math;

  showCreateModal = signal(false);
  showEditModal = signal(false);

  createForm: CreateSectionData = {
    section_name: '',
    year_level: 1,
    semester: '1st Sem',
    program_id: 0,
  };
  editForm = {
    section_id: 0,
    section_name: '',
    year_level: 1,
    semester: '1st Sem' as '1st Sem' | '2nd Sem' | 'Midterm 1' | 'Midterm 2',
    program_id: 0,
  };

  constructor(
    private sectionService: SuperadminSectionService,
    private dropdownService: DropdownService,
  ) {}

  getYearLevelDisplay(yearLevel: number): string {
    const suffixes = ['st', 'nd', 'rd', 'th'];
    const suffix = yearLevel <= 3 ? suffixes[yearLevel - 1] : suffixes[3];
    return `${yearLevel}${suffix} Year`;
  }

  ngOnInit() {
    this.loadPrograms();
    this.loadSections();
  }

  loadPrograms() {
    this.dropdownService.getPrograms().subscribe({
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
      .getSections(this.currentPage(), this.pageSize, this.searchQuery(), this.selectedProgramId())
      .subscribe({
        next: (response) => {
          this.sectionsList.set(response.sections);
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
            confirmButtonColor: '#dc2626',
          });
        },
      });
  }

  searchSections() {
    this.currentPage.set(1);
    this.loadSections();
  }

  filterByProgram(programId: string) {
    this.selectedProgramId.set(programId ? Number(programId) : undefined);
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
      section_name: '',
      year_level: 1,
      semester: '1st Sem',
      program_id: 0,
    };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  submitCreateForm() {
    if (!this.createForm.section_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter section name',
        confirmButtonColor: '#dc2626',
      });
      return;
    }
    if (!this.createForm.program_id || this.createForm.program_id === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please select a program',
        confirmButtonColor: '#dc2626',
      });
      return;
    }

    this.loading.set(true);
    this.sectionService.createSection(this.createForm).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeCreateModal();
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Section created successfully',
          confirmButtonColor: '#dc2626',
        });
        this.loadSections();
      },
      error: (error) => {
        this.loading.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to create section',
          confirmButtonColor: '#dc2626',
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
    if (!this.editForm.section_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter section name',
        confirmButtonColor: '#dc2626',
      });
      return;
    }
    if (!this.editForm.program_id || this.editForm.program_id === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please select a program',
        confirmButtonColor: '#dc2626',
      });
      return;
    }

    this.loading.set(true);
    this.sectionService
      .updateSection(this.editForm.section_id, {
        section_name: this.editForm.section_name,
        year_level: this.editForm.year_level,
        semester: this.editForm.semester,
        program_id: this.editForm.program_id,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.closeEditModal();
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Section updated successfully',
            confirmButtonColor: '#dc2626',
          });
          this.loadSections();
        },
        error: (error) => {
          this.loading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Failed to update section',
            confirmButtonColor: '#dc2626',
          });
        },
      });
  }

  openDeleteModal(section: Section) {
    Swal.fire({
      title: 'Delete Section',
      text: `Are you sure you want to delete "${section.section_name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading.set(true);
        this.sectionService.deleteSection(section.section_id).subscribe({
          next: () => {
            this.loading.set(false);
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Section deleted successfully',
              confirmButtonColor: '#dc2626',
            });
            this.loadSections();
          },
          error: (error) => {
            this.loading.set(false);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.message || 'Failed to delete section',
              confirmButtonColor: '#dc2626',
            });
          },
        });
      }
    });
  }
}
