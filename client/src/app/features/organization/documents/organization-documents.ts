import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  OrganizationService,
  OrganizationDocument,
  DocumentType,
  ChecklistItem,
} from '../../../services/organization.service';
import {
  AcademicYearService,
  AcademicYearsResponse,
} from '../../../services/academic-year.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-organization-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organization-documents.html',
})
export class OrganizationDocumentsComponent implements OnInit {
  private organizationService = inject(OrganizationService);
  private academicYearService = inject(AcademicYearService);

  // Expose Math for template
  Math = Math;

  // State
  documents = signal<OrganizationDocument[]>([]);
  documentTypes = signal<DocumentType[]>([]);
  academicYears = signal<any[]>([]);
  checklist = signal<ChecklistItem[]>([]);

  // Pagination
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  itemsPerPage = 10;

  // Filters
  selectedAcademicYear = signal<number | undefined>(undefined);
  selectedSemester = signal<string | undefined>(undefined);
  selectedDocumentType = signal<number | undefined>(undefined);
  selectedStatus = signal<string | undefined>(undefined);

  // View mode
  viewMode = signal<'documents' | 'checklist'>('documents');

  // Modals
  showSubmitModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);
  showViewModal = signal(false);
  selectedDocument = signal<OrganizationDocument | null>(null);

  // Form data
  documentForm = signal({
    document_type_id: undefined as number | undefined,
    academic_year_id: undefined as number | undefined,
    semester: '1st Semester' as '1st Semester' | '2nd Semester' | 'Summer',
    document_title: '',
  });

  selectedFile = signal<File | null>(null);

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit() {
    this.loadDocuments();
    this.loadDocumentTypes();
    this.loadAcademicYears();
  }

  loadDocuments() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.organizationService
      .getDocuments(
        this.currentPage(),
        this.itemsPerPage,
        this.selectedAcademicYear(),
        this.selectedSemester(),
        this.selectedDocumentType(),
        this.selectedStatus(),
      )
      .subscribe({
        next: (response) => {
          this.documents.set(response.documents);
          this.totalPages.set(response.totalPages);
          this.totalItems.set(response.totalItems);
          this.loading.set(false);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Failed to load documents');
          this.loading.set(false);
        },
      });
  }

  loadDocumentTypes() {
    this.organizationService.getDocumentTypes().subscribe({
      next: (response) => {
        this.documentTypes.set(response.documentTypes);
      },
      error: (error) => {
        console.error('Failed to load document types:', error);
      },
    });
  }

  loadAcademicYears() {
    this.academicYearService.getAcademicYears().subscribe({
      next: (response: AcademicYearsResponse) => {
        this.academicYears.set(response.academicYears);
        // Set latest (first) academic year and semester as default
        if (response.academicYears.length > 0) {
          this.selectedAcademicYear.set(response.academicYears[0].academic_year_id);
        }
        this.selectedSemester.set('1st Semester');
      },
      error: (error: any) => {
        console.error('Failed to load academic years:', error);
      },
    });
  }

  loadChecklist() {
    const academicYearId = this.selectedAcademicYear();
    const semester = this.selectedSemester();

    if (!academicYearId || !semester) {
      this.errorMessage.set('Please select academic year and semester');
      return;
    }

    this.loading.set(true);

    this.organizationService.getSubmissionChecklist(academicYearId, semester).subscribe({
      next: (response) => {
        this.checklist.set(response.checklist);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Failed to load checklist');
        this.loading.set(false);
      },
    });
  }

  switchViewMode(mode: 'documents' | 'checklist') {
    this.viewMode.set(mode);
    if (mode === 'checklist') {
      this.loadChecklist();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage.set('File size must be less than 10MB');
        return;
      }
      this.selectedFile.set(file);
    }
  }

  openSubmitModal() {
    this.resetForm();
    this.showSubmitModal.set(true);
  }

  openUpdateModal(document: OrganizationDocument) {
    this.selectedDocument.set(document);
    this.documentForm.set({
      document_type_id: document.document_type_id,
      academic_year_id: document.academic_year_id,
      semester: document.semester,
      document_title: document.document_title,
    });
    this.showUpdateModal.set(true);
  }

  openDeleteModal(document: OrganizationDocument) {
    this.selectedDocument.set(document);
    this.showDeleteModal.set(true);
  }

  openViewModal(document: OrganizationDocument) {
    this.selectedDocument.set(document);
    this.showViewModal.set(true);
  }

  closeModals() {
    this.showSubmitModal.set(false);
    this.showUpdateModal.set(false);
    this.showDeleteModal.set(false);
    this.showViewModal.set(false);
    this.selectedDocument.set(null);
    this.resetForm();
  }

  resetForm() {
    this.documentForm.set({
      document_type_id: undefined,
      academic_year_id: undefined,
      semester: '1st Semester',
      document_title: '',
    });
    this.selectedFile.set(null);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  submitDocument() {
    const form = this.documentForm();
    const file = this.selectedFile();

    if (!form.document_type_id || !form.academic_year_id || !form.document_title || !file) {
      this.errorMessage.set('All fields are required');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const formData = new FormData();
    formData.append('document_type_id', form.document_type_id.toString());
    formData.append('academic_year_id', form.academic_year_id.toString());
    formData.append('semester', form.semester);
    formData.append('document_title', form.document_title);
    formData.append('document', file);

    this.organizationService.submitDocument(formData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.message || 'Document submitted successfully',
          confirmButtonColor: '#16a34a',
          timer: 2000,
          showConfirmButton: false,
        });
        this.closeModals();
        this.loadDocuments();
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Failed to submit document');
        this.loading.set(false);
      },
    });
  }

  updateDocument() {
    const documentId = this.selectedDocument()?.document_id;
    if (!documentId) return;

    const form = this.documentForm();
    const file = this.selectedFile();

    if (!form.document_title) {
      this.errorMessage.set('Document title is required');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const formData = new FormData();
    formData.append('document_title', form.document_title);
    if (file) {
      formData.append('document', file);
    }

    this.organizationService.updateDocument(documentId, formData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: response.message || 'Document updated successfully',
          confirmButtonColor: '#16a34a',
          timer: 2000,
          showConfirmButton: false,
        });
        this.closeModals();
        this.loadDocuments();
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Failed to update document');
        this.loading.set(false);
      },
    });
  }

  deleteDocument() {
    const documentId = this.selectedDocument()?.document_id;
    if (!documentId) return;

    Swal.fire({
      title: 'Delete Document?',
      text: 'Are you sure you want to delete this document? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading.set(true);
        this.errorMessage.set('');

        this.organizationService.deleteDocument(documentId).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: response.message || 'Document deleted successfully',
              confirmButtonColor: '#16a34a',
              timer: 2000,
              showConfirmButton: false,
            });
            this.closeModals();
            this.loadDocuments();
          },
          error: (error) => {
            this.errorMessage.set(error.error?.message || 'Failed to delete document');
            this.loading.set(false);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.message || 'Failed to delete document',
              confirmButtonColor: '#dc2626',
            });
          },
        });
      }
    });
  }

  downloadDocument(documentId: number, filename: string) {
    this.organizationService.downloadDocument(documentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => {
        this.errorMessage.set('Failed to download document');
        setTimeout(() => this.errorMessage.set(''), 3000);
      },
    });
  }

  applyFilters() {
    this.currentPage.set(1);
    this.loadDocuments();
  }

  refreshChecklist() {
    this.loadChecklist();
  }

  changePage(page: number) {
    this.currentPage.set(page);
    this.loadDocuments();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'revision_needed':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'not_submitted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'revision_needed':
        return 'Needs Revision';
      case 'pending':
        return 'Pending Review';
      case 'not_submitted':
        return 'Not Submitted';
      default:
        return status;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Helper methods for checklist progress
  getApprovedCount(): number {
    return this.checklist().filter((item) => item.submitted && item.status === 'approved').length;
  }

  getRequiredCount(): number {
    return this.checklist().filter((item) => item.required).length;
  }

  isAllRequiredApproved(): boolean {
    const required = this.checklist().filter((item) => item.required);
    return required.every((item) => item.submitted && item.status === 'approved');
  }
}
