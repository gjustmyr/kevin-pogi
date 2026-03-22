import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FacultyRequirementService,
  RequirementSubmission,
  STANDARD_REQUIREMENTS,
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
  requirements = signal<RequirementSubmission[]>([]);
  standardRequirements = STANDARD_REQUIREMENTS;
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  pageSize = 10;

  academicYearsList = signal<DropdownAcademicYear[]>([]);
  selectedAcademicYear = signal<number>(0);
  selectedSemester = signal<string>('');
  selectedStatus = signal<string>('');

  // For submit modal
  showSubmitModal = signal(false);
  submitForm = {
    academic_year_id: 0,
    semester: '',
    requirement_name: '',
  };
  selectedFiles: File[] = [];
  uploading = signal(false);

  // For add files modal
  showAddFilesModal = signal(false);
  addFilesSubmission = signal<RequirementSubmission | null>(null);
  addFiles: File[] = [];

  Math = Math;

  constructor(
    private requirementService: FacultyRequirementService,
    private dropdownService: DropdownService,
  ) {}

  ngOnInit() {
    this.loadAcademicYears();
    this.loadRequirements();
  }

  loadAcademicYears() {
    this.dropdownService.getAcademicYears().subscribe({
      next: (years) => {
        this.academicYearsList.set(years);
        // Set latest (first) academic year and semester as default
        if (years.length > 0) {
          this.selectedAcademicYear.set(years[0].academic_year_id);
          this.submitForm.academic_year_id = years[0].academic_year_id;
        }
        this.selectedSemester.set('1st Semester');
        this.submitForm.semester = '1st Semester';
      },
      error: (error) => {
        console.error('Error loading academic years:', error);
      },
    });
  }

  loadRequirements() {
    this.loading.set(true);
    this.requirementService
      .getMyRequirements(
        this.currentPage(),
        this.pageSize,
        this.selectedAcademicYear() || undefined,
        this.selectedSemester() || undefined,
        this.selectedStatus() || undefined,
      )
      .subscribe({
        next: (response) => {
          this.requirements.set(response.requirements);
          this.currentPage.set(response.currentPage);
          this.totalPages.set(response.totalPages);
          this.totalItems.set(response.totalItems);
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

  filterRequirements() {
    this.currentPage.set(1);
    this.loadRequirements();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadRequirements();
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

  openSubmitModal() {
    this.showSubmitModal.set(true);
    this.submitForm.semester = '';
    this.submitForm.requirement_name = '';
    this.selectedFiles = [];
  }

  closeSubmitModal() {
    this.showSubmitModal.set(false);
    this.submitForm.semester = '';
    this.submitForm.requirement_name = '';
    this.selectedFiles = [];
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  submitRequirement() {
    if (
      !this.submitForm.academic_year_id ||
      !this.submitForm.semester ||
      !this.submitForm.requirement_name ||
      this.selectedFiles.length === 0
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill all fields and select at least one file',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    this.uploading.set(true);
    this.requirementService
      .submitRequirement(
        this.submitForm.academic_year_id,
        this.submitForm.semester,
        this.submitForm.requirement_name,
        this.selectedFiles,
      )
      .subscribe({
        next: () => {
          this.uploading.set(false);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Requirement submitted successfully',
            confirmButtonColor: '#2563eb',
          });
          this.closeSubmitModal();
          this.loadRequirements();
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

  openAddFilesModal(submission: RequirementSubmission) {
    if (submission.status === 'validated') {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Add Files',
        text: 'Cannot add files to a validated requirement',
        confirmButtonColor: '#2563eb',
      });
      return;
    }
    this.addFilesSubmission.set(submission);
    this.showAddFilesModal.set(true);
    this.addFiles = [];
  }

  closeAddFilesModal() {
    this.showAddFilesModal.set(false);
    this.addFilesSubmission.set(null);
    this.addFiles = [];
  }

  onAddFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.addFiles = Array.from(input.files);
    }
  }

  removeAddFile(index: number) {
    this.addFiles.splice(index, 1);
  }

  submitAddFiles() {
    if (this.addFiles.length === 0 || !this.addFilesSubmission()) {
      Swal.fire({
        icon: 'warning',
        title: 'No Files Selected',
        text: 'Please select at least one file to upload',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    this.uploading.set(true);
    this.requirementService
      .addFiles(this.addFilesSubmission()!.submission_id, this.addFiles)
      .subscribe({
        next: () => {
          this.uploading.set(false);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Files added successfully',
            confirmButtonColor: '#2563eb',
          });
          this.closeAddFilesModal();
          this.loadRequirements();
        },
        error: (error) => {
          this.uploading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Failed to add files',
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
            this.loadRequirements();
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

  downloadSingleFile(submission_id: number, file_id: number, fileName: string) {
    this.requirementService.downloadSingleFile(submission_id, file_id, fileName);
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

  getStatusText(status: string): string {
    switch (status) {
      case 'validated':
        return 'Validated';
      case 'pending':
        return 'Pending';
      case 'returned':
        return 'Returned';
      default:
        return status;
    }
  }

  getSemesterLabel(semester: string): string {
    const map: Record<string, string> = {
      '1st Sem': '1st Semester',
      '2nd Sem': '2nd Semester',
      'Midterm 1': '1st Semester',
      'Midterm 2': '2nd Semester',
      Summer: 'Summer 1',
    };
    return map[semester] ?? semester;
  }
}
