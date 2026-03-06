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
  DeanCourseAssignmentService,
  CreateCourseAssignmentData,
} from '../../../services/dean-course-assignment.service';
import { DeanCourseService, Course } from '../../../services/dean-course.service';
import { DeanSectionService, Section } from '../../../services/dean-section.service';
import { DropdownService, DropdownAcademicYear } from '../../../services/dropdown.service';
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
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  searchQuery = signal('');
  pageSize = 10;
  Math = Math;

  showCreateModal = signal(false);
  showEditModal = signal(false);
  showAssignCoursesModal = signal(false);

  createForm: CreateFacultyData = {
    employee_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    contact_number: '',
  };
  editForm = {
    faculty_id: 0,
    employee_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    contact_number: '',
  };

  // Assign Courses Modal
  selectedFaculty = signal<Faculty | null>(null);
  assignCoursesForm = {
    academic_year_id: 0,
    semester: '',
  };
  academicYearsList = signal<DropdownAcademicYear[]>([]);
  coursesList = signal<Course[]>([]);
  sectionsList = signal<Section[]>([]);
  semesters = ['1st Sem', '2nd Sem', 'Midterm 1', 'Midterm 2'];

  // New structure: array of section assignments with their own courses
  sectionAssignments = signal<
    Array<{
      section_id: number;
      course_ids: number[];
    }>
  >([]);

  // Search terms for filtering courses per section
  courseSearchTerms = signal<{ [index: number]: string }>({});

  constructor(
    private facultyService: DeanFacultyService,
    private courseAssignmentService: DeanCourseAssignmentService,
    private courseService: DeanCourseService,
    private sectionService: DeanSectionService,
    private dropdownService: DropdownService,
  ) {}

  ngOnInit() {
    this.loadFaculty();
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

    this.loading.set(true);
    this.facultyService.createFaculty(this.createForm).subscribe({
      next: (response) => {
        this.loading.set(false);
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
        this.loading.set(false);
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

    this.loading.set(true);
    this.facultyService
      .updateFaculty(this.editForm.faculty_id, {
        employee_id: this.editForm.employee_id,
        first_name: this.editForm.first_name,
        middle_name: this.editForm.middle_name,
        last_name: this.editForm.last_name,
        email: this.editForm.email,
        contact_number: this.editForm.contact_number,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
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
          this.loading.set(false);
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
        this.loading.set(true);
        this.facultyService.deleteFaculty(faculty.faculty_id).subscribe({
          next: () => {
            this.loading.set(false);
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Faculty deleted successfully',
              confirmButtonColor: '#2563eb',
            });
            this.loadFaculty();
          },
          error: (error) => {
            this.loading.set(false);
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

  // Assign Courses Modal Methods
  openAssignCoursesModal(faculty: Faculty) {
    this.selectedFaculty.set(faculty);
    this.assignCoursesForm = {
      academic_year_id: 0,
      semester: '',
    };
    this.sectionAssignments.set([]);
    this.courseSearchTerms.set({});
    this.coursesList.set([]);
    this.sectionsList.set([]);

    // Load academic years, sections, and courses
    this.loadAcademicYears();
    this.loadAllSections();
    this.loadAllCourses();

    this.showAssignCoursesModal.set(true);
  }

  closeAssignCoursesModal() {
    this.showAssignCoursesModal.set(false);
    this.selectedFaculty.set(null);
  }

  loadAcademicYears() {
    this.dropdownService.getAcademicYears().subscribe({
      next: (years) => {
        this.academicYearsList.set(years);

        // Auto-select current academic year if available
        const currentYear = years.find((y) => y.is_active === 1);
        if (currentYear) {
          this.assignCoursesForm.academic_year_id = currentYear.academic_year_id;
        }
      },
      error: (error) => {
        console.error('Error loading academic years:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load academic years',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  loadAllSections() {
    this.sectionService.getSections(1, 1000, '').subscribe({
      next: (response) => {
        this.sectionsList.set(response.sections);
      },
      error: (error) => {
        console.error('Error loading sections:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load sections',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  loadAllCourses() {
    this.courseService.getCourses(1, 1000, '').subscribe({
      next: (response) => {
        this.coursesList.set(response.courses);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load courses',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  addSectionAssignment() {
    this.sectionAssignments.set([...this.sectionAssignments(), { section_id: 0, course_ids: [] }]);
  }

  removeSectionAssignment(index: number) {
    const current = this.sectionAssignments();
    this.sectionAssignments.set(current.filter((_, i) => i !== index));

    // Remove search term for this index
    const searchTerms = { ...this.courseSearchTerms() };
    delete searchTerms[index];
    this.courseSearchTerms.set(searchTerms);
  }

  toggleCourseForSection(sectionIndex: number, courseId: number) {
    const current = [...this.sectionAssignments()];
    const section = current[sectionIndex];
    const courseIndex = section.course_ids.indexOf(courseId);

    if (courseIndex > -1) {
      section.course_ids = section.course_ids.filter((id) => id !== courseId);
    } else {
      section.course_ids = [...section.course_ids, courseId];
    }

    this.sectionAssignments.set(current);
  }

  isCourseSelectedForSection(sectionIndex: number, courseId: number): boolean {
    const assignments = this.sectionAssignments();
    if (sectionIndex >= assignments.length) return false;
    return assignments[sectionIndex].course_ids.includes(courseId);
  }

  getSelectedSection(sectionId: number): Section | undefined {
    return this.sectionsList().find((s) => s.section_id === sectionId);
  }

  getCoursesForSection(sectionId: number, sectionIndex: number): Course[] {
    // All courses are available since courses no longer have semester restrictions
    let filteredCourses = this.coursesList();

    // Apply search filter if search term exists for this section
    const searchTerm = this.courseSearchTerms()[sectionIndex]?.toLowerCase().trim();
    if (searchTerm) {
      filteredCourses = filteredCourses.filter(
        (c) =>
          c.course_code.toLowerCase().includes(searchTerm) ||
          c.course_name.toLowerCase().includes(searchTerm),
      );
    }

    return filteredCourses;
  }

  updateCourseSearch(sectionIndex: number, searchTerm: string) {
    const updated = { ...this.courseSearchTerms() };
    updated[sectionIndex] = searchTerm;
    this.courseSearchTerms.set(updated);
  }

  getYearLevelDisplay(yearLevel: number): string {
    const levels: { [key: number]: string } = {
      1: '1st Year',
      2: '2nd Year',
      3: '3rd Year',
      4: '4th Year',
    };
    return levels[yearLevel] || `${yearLevel}th Year`;
  }

  getTotalAssignments(): number {
    return this.sectionAssignments().reduce((total, assignment) => {
      return total + assignment.course_ids.length;
    }, 0);
  }

  submitAssignCourses() {
    if (!this.assignCoursesForm.academic_year_id) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please select academic year',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    if (!this.assignCoursesForm.semester) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please select semester',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    if (this.sectionAssignments().length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please add at least one section assignment',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    // Validate each section assignment
    for (const assignment of this.sectionAssignments()) {
      if (!assignment.section_id) {
        Swal.fire({
          icon: 'warning',
          title: 'Validation Error',
          text: 'Please select a section for all assignments',
          confirmButtonColor: '#2563eb',
        });
        return;
      }

      if (assignment.course_ids.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Validation Error',
          text: 'Please select at least one course for each section',
          confirmButtonColor: '#2563eb',
        });
        return;
      }
    }

    const faculty = this.selectedFaculty();
    if (!faculty) return;

    // Create assignments for each section-course combination
    const assignments: CreateCourseAssignmentData[] = [];

    for (const sectionAssignment of this.sectionAssignments()) {
      for (const courseId of sectionAssignment.course_ids) {
        assignments.push({
          faculty_id: faculty.faculty_id,
          course_id: courseId,
          section_id: sectionAssignment.section_id,
          academic_year_id: this.assignCoursesForm.academic_year_id,
          semester: this.assignCoursesForm.semester,
        });
      }
    }

    console.log('Submitting assignments:', assignments);

    this.loading.set(true);
    this.courseAssignmentService.bulkCreateAssignments({ assignments }).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.closeAssignCoursesModal();

        if (response.errors > 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Partially Successful',
            html: `
              <p>${response.created} assignments created successfully.</p>
              <p>${response.errors} assignments failed (may already exist).</p>
            `,
            confirmButtonColor: '#2563eb',
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `${response.created} course assignments (with semester) created successfully`,
            confirmButtonColor: '#2563eb',
          });
        }
      },
      error: (error) => {
        this.loading.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to create course assignments',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }
}
