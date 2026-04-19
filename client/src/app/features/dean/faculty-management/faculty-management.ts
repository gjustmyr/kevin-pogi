import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DeanFacultyService,
  Faculty,
  CreateFacultyData,
  UpdateFacultyData,
} from '../../../services/dean-faculty.service';
import {
  DropdownService,
  DropdownAcademicYear,
  DropdownPositionLevel,
} from '../../../services/dropdown.service';
import { DeanAnalyticsService } from '../../../services/dean-analytics.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dean-faculty-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './faculty-management.html',
  styleUrl: './faculty-management.css',
})
export class DeanFacultyManagement implements OnInit {
  facultyList = signal<Faculty[]>([]);
  loading = signal(false);
  createLoading = signal(false);
  updateLoading = signal(false);
  deleteLoading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  searchQuery = signal('');
  pageSize = 10;
  Math = Math;

  positionLevels = signal<DropdownPositionLevel[]>([]);

  showCreateModal = signal(false);
  showEditModal = signal(false);

  createForm: CreateFacultyData = {
    employee_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    position_level: '',
  };
  editForm = {
    faculty_id: 0,
    employee_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    position_level: '',
  };

  constructor(
    private facultyService: DeanFacultyService,
    private dropdownService: DropdownService,
    private analyticsService: DeanAnalyticsService,
  ) {}

  showPDFMenu = signal<number | null>(null);

  togglePDFMenu(facultyId: number) {
    if (this.showPDFMenu() === facultyId) {
      this.showPDFMenu.set(null);
    } else {
      this.showPDFMenu.set(facultyId);
    }
  }

  generateFacultyPDF(faculty: Faculty, type: 'extension' | 'research' | 'seminars') {
    this.showPDFMenu.set(null);

    let observable;
    switch (type) {
      case 'extension':
        observable = this.analyticsService.getExtensionActivitiesByFaculty(faculty.faculty_id);
        break;
      case 'research':
        observable = this.analyticsService.getResearchActivitiesByFaculty(faculty.faculty_id);
        break;
      case 'seminars':
        observable = this.analyticsService.getSeminarsTrainingsByFaculty(faculty.faculty_id);
        break;
    }

    observable.subscribe({
      next: (data: any) => {
        if (
          !data.facultyList ||
          data.facultyList.length === 0 ||
          data.facultyList[0].activities.length === 0
        ) {
          Swal.fire({
            icon: 'info',
            title: 'No Data',
            text: `No ${type} activities found for this faculty member.`,
            confirmButtonColor: '#2563eb',
          });
          return;
        }
        this.createPDF(data, type, faculty);
      },
      error: (error: any) => {
        console.error(`Error generating ${type} PDF:`, error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to generate PDF. Please try again.',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  private createPDF(data: any, type: string, faculty: Faculty) {
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const title = data.title;
    const titleLines = doc.splitTextToSize(title, pageWidth - 2 * margin);
    doc.text(titleLines, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += titleLines.length * 6 + 5;

    // Academic Year
    const currentYear = new Date().getFullYear();
    doc.setFontSize(11);
    doc.text(`FY ${currentYear}-${currentYear + 1}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // Faculty Name
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Faculty Name: ${data.facultyList[0].faculty_name.toUpperCase()}`, margin, yPosition);
    yPosition += 8;

    // Table headers
    const headers = this.getTableHeaders(type);
    const columnWidths = this.getColumnWidths(type, pageWidth, margin);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 7);

    let xPosition = margin + 2;
    headers.forEach((header: string, index: number) => {
      doc.text(header, xPosition, yPosition + 5);
      xPosition += columnWidths[index];
    });
    yPosition += 7;

    // Table rows
    doc.setFont('helvetica', 'normal');
    data.facultyList[0].activities.forEach((activity: any, activityIndex: number) => {
      const rowData = this.getRowData(activity, type, activityIndex + 1);
      const rowHeight = this.calculateRowHeight(doc, rowData, columnWidths, pageWidth, margin);

      // Check if we need a new page
      if (yPosition + rowHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight);

      xPosition = margin + 2;
      rowData.forEach((cellData: string, index: number) => {
        const cellLines = doc.splitTextToSize(cellData, columnWidths[index] - 4);
        doc.text(cellLines, xPosition, yPosition + 4);
        xPosition += columnWidths[index];
      });

      yPosition += rowHeight;
    });

    // Save PDF
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
    const facultyName = `${faculty.last_name}_${faculty.first_name}`.replace(/\s+/g, '_');
    const fileName = `${facultyName}_${typeLabel}_Report_${currentYear}.pdf`;
    doc.save(fileName);
  }

  private getTableHeaders(type: string): string[] {
    switch (type) {
      case 'extension':
        return [
          'No.',
          'Title of Extension PPAs',
          'Date of Implementation',
          'Beneficiary',
          'Location',
        ];
      case 'research':
        return ['No.', 'Title of Research', 'Category', 'Date', 'Sponsoring Agency'];
      case 'seminars':
        return [
          'No.',
          'Title of Seminar/Workshop/Training/Conference Attended',
          'Category (Local, National, International)',
          'Date',
          'Sponsoring Agency',
        ];
      default:
        return [];
    }
  }

  private getColumnWidths(type: string, pageWidth: number, margin: number): number[] {
    const totalWidth = pageWidth - 2 * margin;
    switch (type) {
      case 'extension':
        return [12, totalWidth * 0.35, totalWidth * 0.18, totalWidth * 0.22, totalWidth * 0.13];
      case 'research':
      case 'seminars':
        return [12, totalWidth * 0.4, totalWidth * 0.15, totalWidth * 0.15, totalWidth * 0.18];
      default:
        return [];
    }
  }

  private getRowData(activity: any, type: string, rowNumber: number): string[] {
    const formatDate = (date: string) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    switch (type) {
      case 'extension':
        const dateRange = activity.date_to
          ? `${formatDate(activity.date_from)} - ${formatDate(activity.date_to)}`
          : formatDate(activity.date_from);
        return [
          rowNumber.toString(),
          activity.title || '',
          dateRange,
          activity.beneficiary || '',
          activity.location || '',
        ];
      case 'research':
        return [
          rowNumber.toString(),
          activity.title || '',
          activity.category || '',
          formatDate(activity.date),
          activity.sponsoring_agency || '',
        ];
      case 'seminars':
        return [
          rowNumber.toString(),
          activity.title || '',
          activity.category || '',
          formatDate(activity.date),
          activity.sponsoring_agency || '',
        ];
      default:
        return [];
    }
  }

  private calculateRowHeight(
    doc: any,
    rowData: string[],
    columnWidths: number[],
    pageWidth: number,
    margin: number,
  ): number {
    let maxLines = 1;
    rowData.forEach((cellData: string, index: number) => {
      const lines = doc.splitTextToSize(cellData, columnWidths[index] - 4);
      maxLines = Math.max(maxLines, lines.length);
    });
    return Math.max(7, maxLines * 4 + 3);
  }

  ngOnInit() {
    this.loadFaculty();
    this.loadPositionLevels();
  }

  loadPositionLevels() {
    this.dropdownService.getPositionLevels().subscribe({
      next: (levels) => this.positionLevels.set(levels),
      error: (error) => console.error('Error loading position levels:', error),
    });
  }

  loadFaculty() {
    this.loading.set(true);
    this.facultyService
      .getFaculty(this.currentPage(), this.pageSize, this.searchQuery())
      .subscribe({
        next: (response) => {
          this.facultyList.set(response.faculty);
          this.currentPage.set(response.currentPage);
          this.totalPages.set(response.totalPages);
          this.totalItems.set(response.totalItems);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading faculty:', error);
          this.loading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load faculty',
            confirmButtonColor: '#2563eb',
          });
        },
      });
  }

  searchFaculty() {
    this.currentPage.set(1);
    this.loadFaculty();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadFaculty();
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
      employee_id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      contact_number: '',
      position_level: '',
    };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  submitCreateForm() {
    if (!this.createForm.employee_id.trim() || this.createForm.employee_id.length !== 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter a valid 5-digit employee ID',
        confirmButtonColor: '#2563eb',
      });
      return;
    }
    if (!this.createForm.first_name.trim() || !this.createForm.last_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter first name and last name',
        confirmButtonColor: '#2563eb',
      });
      return;
    }
    if (!this.createForm.email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter email',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    this.createLoading.set(true);
    this.facultyService.createFaculty(this.createForm).subscribe({
      next: (response) => {
        this.createLoading.set(false);
        this.closeCreateModal();

        if (response.emailSent) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            html: `Faculty created successfully!<br><small>Credentials sent via email to ${this.createForm.email}</small>`,
            confirmButtonColor: '#2563eb',
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Faculty Created - Email Failed',
            html: `
              <p>Faculty account created successfully, but email could not be sent.</p>
              <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; text-align: left;">
                <p><strong>Email:</strong> ${this.createForm.email}</p>
                <p><strong>Password:</strong> <code style="background: #dbeafe; padding: 2px 6px; border-radius: 3px;">${response.generatedPassword}</code></p>
              </div>
              <p style="color: #2563eb; font-size: 14px;"><strong>⚠️ Important:</strong> Please save these credentials and share them with the faculty manually.</p>
            `,
            confirmButtonColor: '#2563eb',
            confirmButtonText: 'I have saved the credentials',
            allowOutsideClick: false,
          });
        }

        this.loadFaculty();
      },
      error: (error) => {
        this.createLoading.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to create faculty',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  openEditModal(faculty: Faculty) {
    this.editForm = {
      faculty_id: faculty.faculty_id,
      employee_id: faculty.employee_id,
      first_name: faculty.first_name,
      middle_name: faculty.middle_name || '',
      last_name: faculty.last_name,
      email: faculty.email,
      contact_number: faculty.contact_number || '',
      position_level: faculty.position_level || '',
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  submitEditForm() {
    if (!this.editForm.employee_id.trim() || this.editForm.employee_id.length !== 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter a valid 5-digit employee ID',
        confirmButtonColor: '#2563eb',
      });
      return;
    }
    if (!this.editForm.first_name.trim() || !this.editForm.last_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter first name and last name',
        confirmButtonColor: '#2563eb',
      });
      return;
    }
    if (!this.editForm.email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter email',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    this.updateLoading.set(true);
    this.facultyService
      .updateFaculty(this.editForm.faculty_id, {
        employee_id: this.editForm.employee_id,
        first_name: this.editForm.first_name,
        middle_name: this.editForm.middle_name,
        last_name: this.editForm.last_name,
        email: this.editForm.email,
        contact_number: this.editForm.contact_number,
        position_level: this.editForm.position_level,
      })
      .subscribe({
        next: () => {
          this.updateLoading.set(false);
          this.closeEditModal();
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Faculty updated successfully',
            confirmButtonColor: '#2563eb',
          });
          this.loadFaculty();
        },
        error: (error) => {
          this.updateLoading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Failed to update faculty',
            confirmButtonColor: '#2563eb',
          });
        },
      });
  }

  openDeleteModal(faculty: Faculty) {
    Swal.fire({
      title: 'Delete Faculty',
      text: `Are you sure you want to delete "${faculty.first_name} ${faculty.last_name}"? This will also delete their user account. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#2563eb',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteLoading.set(true);
        this.facultyService.deleteFaculty(faculty.faculty_id).subscribe({
          next: () => {
            this.deleteLoading.set(false);
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Faculty deleted successfully',
              confirmButtonColor: '#2563eb',
            });
            this.loadFaculty();
          },
          error: (error) => {
            this.deleteLoading.set(false);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.message || 'Failed to delete faculty',
              confirmButtonColor: '#2563eb',
            });
          },
        });
      }
    });
  }

  getFullName(faculty: Faculty): string {
    return faculty.middle_name
      ? `${faculty.first_name} ${faculty.middle_name} ${faculty.last_name}`
      : `${faculty.first_name} ${faculty.last_name}`;
  }
}
