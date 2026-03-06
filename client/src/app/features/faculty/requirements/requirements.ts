import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FacultyRequirementService,
  Assignment,
  RequirementStatus,
} from '../../../services/faculty-requirement.service';
import { DropdownService, DropdownAcademicYear } from '../../../services/dropdown.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-faculty-requirements',
  imports: [CommonModule, FormsModule],
  templateUrl: './requirements.html',
  styleUrl: './requirements.css',
})
export class FacultyRequirements implements OnInit {
  assignments = signal<Assignment[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  pageSize = 10;

  academicYearsList = signal<DropdownAcademicYear[]>([]);
  selectedAcademicYear = signal<number>(0);
  selectedSemester = signal<string>('');

  // For modal
  showSubmitModal = signal(false);
  selectedAssignment = signal<Assignment | null>(null);
  requirements = signal<RequirementStatus[]>([]);
  selectedRequirement = signal<RequirementStatus | null>(null);
  selectedFile: File | null = null;
  uploading = signal(false);

  Math = Math;

  constructor(
    private requirementService: FacultyRequirementService,
    private dropdownService: DropdownService,
  ) {}

  ngOnInit() {
    this.loadAcademicYears();
    this.loadAssignments();
  }

  loadAcademicYears() {
    this.dropdownService.getAcademicYears().subscribe({
      next: (years) => {
        this.academicYearsList.set(years);
        // Auto-select current academic year
        const currentYear = years.find((y) => y.is_active === 1);
        if (currentYear) {
          this.selectedAcademicYear.set(currentYear.academic_year_id);
        }
      },
      error: (error) => {
        console.error('Error loading academic years:', error);
      },
    });
  }

  loadAssignments() {
    this.loading.set(true);
    this.requirementService
      .getMyAssignments(
        this.currentPage(),
        this.pageSize,
        this.selectedAcademicYear() || undefined,
        this.selectedSemester() || undefined,
      )
      .subscribe({
        next: (response) => {
          this.assignments.set(response.assignments);
          this.currentPage.set(response.currentPage);
          this.totalPages.set(response.totalPages);
          this.totalItems.set(response.totalItems);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading assignments:', error);
          this.loading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load assignments',
            confirmButtonColor: '#2563eb',
          });
        },
      });
  }

  filterAssignments() {
    this.currentPage.set(1);
    this.loadAssignments();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadAssignments();
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

  openSubmitModal(assignment: Assignment) {
    this.selectedAssignment.set(assignment);
    this.loading.set(true);
    this.requirementService.getRequirementsByAssignment(assignment.assignment_id).subscribe({
      next: (response) => {
        this.requirements.set(response.requirements);
        this.showSubmitModal.set(true);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading requirements:', error);
        this.loading.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load requirements',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  closeSubmitModal() {
    this.showSubmitModal.set(false);
    this.selectedAssignment.set(null);
    this.selectedRequirement.set(null);
    this.selectedFile = null;
  }

  selectRequirement(requirement: RequirementStatus) {
    this.selectedRequirement.set(requirement);
    this.selectedFile = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submitRequirement() {
    if (!this.selectedRequirement() || !this.selectedFile || !this.selectedAssignment()) {
      return;
    }

    const assignment = this.selectedAssignment()!;
    const requirement = this.selectedRequirement()!;

    this.uploading.set(true);
    this.requirementService
      .submitRequirement(assignment.assignment_id, requirement.requirement_type, this.selectedFile)
      .subscribe({
        next: () => {
          this.uploading.set(false);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Requirement submitted successfully',
            confirmButtonColor: '#2563eb',
          });
          // Reload requirements
          this.openSubmitModal(assignment);
          this.selectedRequirement.set(null);
          this.selectedFile = null;
        },
        error: (error) => {
          this.uploading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Failed to submit requirement',
            confirmButtonColor: '#2563eb',
          });
        },
      });
  }

  deleteSubmission(submission_id: number) {
    Swal.fire({
      title: 'Delete Submission?',
      text: 'Are you sure you want to delete this submission? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.requirementService.deleteRequirement(submission_id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'Submission deleted successfully',
              confirmButtonColor: '#2563eb',
            });
            // Reload requirements
            if (this.selectedAssignment()) {
              this.openSubmitModal(this.selectedAssignment()!);
            }
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.message || 'Failed to delete submission',
              confirmButtonColor: '#2563eb',
            });
          },
        });
      }
    });
  }

  downloadFile(submission_id: number) {
    this.requirementService.downloadRequirement(submission_id);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'validated':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'returned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getCompletionStats(assignment: Assignment) {
    const submissions = assignment.requirement_submissions || [];
    const total = 9; // Total requirements
    const submitted = submissions.length;
    const validated = submissions.filter((s) => s.status === 'validated').length;
    const pending = submissions.filter((s) => s.status === 'pending').length;
    const returned = submissions.filter((s) => s.status === 'returned').length;

    return {
      total,
      submitted,
      cleared: validated,
      pending,
      returned,
      percentage: Math.round((submitted / total) * 100),
    };
  }

  getYearLevelDisplay(yearLevel: number): string {
    const yearNames = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    return yearNames[yearLevel - 1] || `Year ${yearLevel}`;
  }
}
