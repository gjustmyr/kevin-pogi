import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DeanCourseService,
  Course,
  CreateCourseData,
  UpdateCourseData,
} from '../../../services/dean-course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dean-course-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './course-management.html',
  styleUrl: './course-management.css',
})
export class DeanCourseManagement implements OnInit {
  courseList = signal<Course[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  searchQuery = signal('');
  pageSize = 10;
  Math = Math;

  showCreateModal = signal(false);
  showEditModal = signal(false);

  createForm: CreateCourseData = {
    course_code: '',
    course_name: '',
    description: '',
  };

  editForm: UpdateCourseData & { course_id: number } = {
    course_id: 0,
    course_code: '',
    course_name: '',
    description: '',
  };

  constructor(private courseService: DeanCourseService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading.set(true);
    this.courseService
      .getCourses(
        this.currentPage(),
        this.pageSize,
        this.searchQuery(),
      )
      .subscribe({
        next: (response) => {
          this.courseList.set(response.courses);
          this.currentPage.set(response.currentPage);
          this.totalPages.set(response.totalPages);
          this.totalItems.set(response.totalItems);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading courses:', error);
          this.loading.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load courses',
            confirmButtonColor: '#2563eb',
          });
        },
      });
  }

  searchCourses() {
    this.currentPage.set(1);
    this.loadCourses();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadCourses();
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
      course_code: '',
      course_name: '',
      description: '',
    };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  submitCreateForm() {
    if (
      !this.createForm.course_code ||
      !this.createForm.course_name
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    this.courseService.createCourse(this.createForm).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Course created successfully',
          confirmButtonColor: '#2563eb',
        });
        this.closeCreateModal();
        this.loadCourses();
      },
      error: (error) => {
        console.error('Error creating course:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to create course',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  openEditModal(course: Course) {
    this.editForm = {
      course_id: course.course_id,
      course_code: course.course_code,
      course_name: course.course_name,
      description: course.description || '',
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  submitEditForm() {
    if (
      !this.editForm.course_code ||
      !this.editForm.course_name
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    const { course_id, ...updateData } = this.editForm;
    this.courseService.updateCourse(course_id, updateData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Course updated successfully',
          confirmButtonColor: '#2563eb',
        });
        this.closeEditModal();
        this.loadCourses();
      },
      error: (error) => {
        console.error('Error updating course:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to update course',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  openDeleteModal(course: Course) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: `Do you want to delete ${course.course_code} - ${course.course_name}? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteCourse(course.course_id);
      }
    });
  }

  deleteCourse(courseId: number) {
    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Course has been deleted successfully',
          confirmButtonColor: '#2563eb',
        });
        this.loadCourses();
      },
      error: (error) => {
        console.error('Error deleting course:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to delete course',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }

  getYearLabel(year: number): string {
    const labels = ['1st year', '2nd year', '3rd year', '4th year'];
    return labels[year - 1] || `${year}th year`;
  }
}
