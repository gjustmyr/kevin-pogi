import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DeanRequirementService,
  DepartmentStatistics,
  FacultyAccomplishment,
} from '../../../services/dean-requirement.service';
import { DeanFacultyService, Faculty } from '../../../services/dean-faculty.service';
import { DropdownService, DropdownAcademicYear } from '../../../services/dropdown.service';
import { RequirementSubmission, Assignment } from '../../../services/faculty-requirement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dean-requirements-monitoring',
  imports: [CommonModule, FormsModule],
  templateUrl: './requirements-monitoring.html',
  styleUrl: './requirements-monitoring.css',
})
export class DeanRequirementsMonitoring implements OnInit {
  loading = signal(false);

  // Filters
  academicYearsList = signal<DropdownAcademicYear[]>([]);
  facultyList = signal<Faculty[]>([]);
  selectedAcademicYear = signal<number>(0);
  selectedSemester = signal<string>('');
  selectedFacultyId = signal<number>(0);
  searchQuery = signal<string>('');

  // Pagination
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  pageSize = 10;

  // Faculty accomplishments
  selectedFacultyAccomplishment = signal<FacultyAccomplishment | null>(null);

  // View modal
  showViewModal = signal(false);
  selectedSubmission = signal<any>(null);

  Math = Math;

  constructor(
    private requirementService: DeanRequirementService,
    private facultyService: DeanFacultyService,
    private dropdownService: DropdownService,
  ) {}

  ngOnInit() {
    this.loadAcademicYears();
    this.loadFacultyList();
  }

  loadAcademicYears() {
    this.dropdownService.getAcademicYears().subscribe({
      next: (years) => {
        this.academicYearsList.set(years);
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

  loadFacultyList() {
    this.facultyService.getFaculty(1, 1000, '').subscribe({
      next: (response) => {
        this.facultyList.set(response.faculty);
      },
      error: (error) => {
        console.error('Error loading faculty:', error);
      },
    });
  }

  // loadSubmissions method removed - no longer needed without submissions tab

  filterData() {
    this.currentPage.set(1);
    if (this.selectedFacultyId()) {
      this.loadFacultyAccomplishment();
    }
  }

  loadFacultyAccomplishment() {
    if (!this.selectedFacultyId()) {
      this.selectedFacultyAccomplishment.set(null);
      return;
    }

    this.loading.set(true);
    this.requirementService
      .getFacultyAccomplishment(
        this.selectedFacultyId(),
        this.selectedAcademicYear() || undefined,
        this.selectedSemester() || undefined,
      )
      .subscribe({
        next: (accomplishment) => {
          this.selectedFacultyAccomplishment.set(accomplishment);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading faculty accomplishment:', error);
          this.loading.set(false);
        },
      });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      if (this.selectedFacultyId()) {
        this.loadFacultyAccomplishment();
      }
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

  openViewModal(submission: any) {
    this.selectedSubmission.set(submission);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.selectedSubmission.set(null);
  }

  validateRequirement() {
    if (!this.selectedSubmission()) return;

    Swal.fire({
      title: 'Validate Requirement?',
      text: 'Mark this requirement as validated/approved?',
      input: 'textarea',
      inputLabel: 'Remarks (optional)',
      inputPlaceholder: 'Enter any remarks...',
      showCancelButton: true,
      confirmButtonText: 'Validate',
      confirmButtonColor: '#10b981',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.requirementService
          .validateRequirement(this.selectedSubmission()!.submission_id, result.value || undefined)
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Validated',
                text: 'Requirement validated successfully',
                confirmButtonColor: '#2563eb',
              });
              this.closeViewModal();
              this.loadFacultyAccomplishment();
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.error?.message || 'Failed to validate requirement',
                confirmButtonColor: '#2563eb',
              });
            },
          });
      }
    });
  }

  returnRequirement() {
    if (!this.selectedSubmission()) return;

    Swal.fire({
      title: 'Return Requirement?',
      text: 'Return this requirement for revision',
      input: 'textarea',
      inputLabel: 'Remarks (required)',
      inputPlaceholder: 'Enter reason for returning...',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter remarks!';
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonText: 'Return',
      confirmButtonColor: '#dc2626',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.requirementService
          .returnRequirement(this.selectedSubmission()!.submission_id, result.value)
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Returned',
                text: 'Requirement returned successfully',
                confirmButtonColor: '#2563eb',
              });
              this.closeViewModal();
              this.loadFacultyAccomplishment();
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.error?.message || 'Failed to return requirement',
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

  getFacultyName(faculty: any): string {
    if (!faculty) return '';
    return faculty.middle_name
      ? `${faculty.first_name} ${faculty.middle_name} ${faculty.last_name}`
      : `${faculty.first_name} ${faculty.last_name}`;
  }

  getYearLevelDisplay(yearLevel: number): string {
    const yearNames = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    return yearNames[yearLevel - 1] || `Year ${yearLevel}`;
  }

  getCompletionStats(assignment: Assignment) {
    const submissions = assignment.requirement_submissions || [];
    const total = 9;
    const submitted = submissions.length;
    const validated = submissions.filter((s) => s.status === 'validated').length;
    const pending = submissions.filter((s) => s.status === 'pending').length;
    const returned = submissions.filter((s) => s.status === 'returned').length;

    return {
      total,
      submitted,
      validated,
      pending,
      returned,
      percentage: Math.round((validated / total) * 100),
    };
  }

  // Check if specific academic year and semester are selected
  isSpecificPeriodSelected(): boolean {
    return this.selectedAcademicYear() !== 0 && this.selectedSemester() !== '';
  }

  getClearanceStatusClass(status?: string): string {
    switch (status) {
      case 'cleared':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'withholding':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  }

  getClearanceStatusText(status?: string): string {
    switch (status) {
      case 'cleared':
        return 'CLEARED';
      case 'withholding':
        return 'WITHHOLDING';
      case 'pending':
      default:
        return 'PENDING';
    }
  }

  setFacultyClearanceStatus(status: 'pending' | 'cleared' | 'withholding') {
    if (!this.selectedFacultyAccomplishment()) return;

    // Validate that specific period is selected
    if (!this.isSpecificPeriodSelected()) {
      Swal.fire({
        icon: 'warning',
        title: 'Period Required',
        text: 'Please select a specific academic year and semester to set clearance status',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    const statusText =
      status === 'cleared' ? 'Cleared' : status === 'withholding' ? 'Withholding' : 'Pending';

    Swal.fire({
      title: `Set Faculty Status to ${statusText}?`,
      text: `This will manually set the faculty's clearance status to ${statusText.toLowerCase()}`,
      input: 'textarea',
      inputLabel: 'Remarks (optional)',
      inputPlaceholder: 'Enter any remarks...',
      showCancelButton: true,
      confirmButtonText: `Set to ${statusText}`,
      confirmButtonColor:
        status === 'cleared' ? '#10b981' : status === 'withholding' ? '#dc2626' : '#f59e0b',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.requirementService
          .setFacultyClearanceStatus(
            this.selectedFacultyAccomplishment()!.faculty.faculty_id,
            status,
            result.value || undefined,
            this.selectedAcademicYear() || undefined,
            this.selectedSemester() || undefined,
          )
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Updated',
                text: `Faculty clearance status set to ${statusText.toLowerCase()}`,
                confirmButtonColor: '#2563eb',
              });
              this.loadFacultyAccomplishment();
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.error?.message || 'Failed to update clearance status',
                confirmButtonColor: '#2563eb',
              });
            },
          });
      }
    });
  }

  calculateFacultyClearanceStatus() {
    if (!this.selectedFacultyAccomplishment()) return;

    // Validate that specific period is selected
    if (!this.isSpecificPeriodSelected()) {
      Swal.fire({
        icon: 'warning',
        title: 'Period Required',
        text: 'Please select a specific academic year and semester to calculate clearance status',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    Swal.fire({
      title: 'Auto-Calculate Clearance Status?',
      text: 'This will automatically determine the faculty clearance status based on their requirements',
      showCancelButton: true,
      confirmButtonText: 'Calculate',
      confirmButtonColor: '#2563eb',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.requirementService
          .calculateFacultyClearanceStatus(
            this.selectedFacultyAccomplishment()!.faculty.faculty_id,
            this.selectedAcademicYear() || undefined,
            this.selectedSemester() || undefined,
          )
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Calculated',
                text: 'Faculty clearance status calculated and updated',
                confirmButtonColor: '#2563eb',
              });
              this.loadFacultyAccomplishment();
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.error?.message || 'Failed to calculate clearance status',
                confirmButtonColor: '#2563eb',
              });
            },
          });
      }
    });
  }
}
