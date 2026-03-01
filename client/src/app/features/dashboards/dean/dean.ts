import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../services/auth/auth';
import { RouterModule } from '@angular/router';
import { DeanFacultyManagement } from '../../dean/faculty-management/faculty-management';
import { DeanOrganizationManagement } from '../../dean/organization-management/organization-management';
import { DeanCourseManagement } from '../../dean/course-management/course-management';
import { DeanSectionManagement } from '../../dean/section-management/section-management';
import { DeanProgramManagement } from '../../dean/program-management/program-management';
import { DeanRequirementsMonitoring } from '../../dean/requirements-monitoring/requirements-monitoring';
import { DeanRequirementService, DepartmentStatistics } from '../../../services/dean-requirement.service';
import { DropdownService, DropdownAcademicYear } from '../../../services/dropdown.service';

@Component({
  selector: 'app-dean-dashboard',
  imports: [CommonModule, FormsModule, RouterModule, DeanFacultyManagement, DeanOrganizationManagement, DeanCourseManagement, DeanSectionManagement, DeanProgramManagement, DeanRequirementsMonitoring],
  template: `
    <!-- Sidebar -->
    <aside
      [class.translate-x-0]="isSidebarOpen()"
      [class.-translate-x-full]="!isSidebarOpen()"
      class="fixed top-0 left-0 z-50 w-64 h-full transition-transform bg-white border-r border-gray-200"
    >
      <div class="h-full px-3 py-4 overflow-y-auto">
        <!-- Logo/Brand -->
        <div class="mb-6 px-2 flex flex-col items-center">
          <img src="/assets/logo.png" alt="Logo" class="h-24 mb-3" />
          <h2 class="text-xl font-bold text-gray-900 text-center">Dean Portal</h2>
        </div>

        <ul class="space-y-2 font-medium">
          <!-- Dashboard -->
          <li>
            <button
              (click)="selectTab('dashboard')"
              [class.bg-blue-50]="activeTab() === 'dashboard'"
              [class.text-blue-600]="activeTab() === 'dashboard'"
              class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
            >
              <svg class="shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"
                />
              </svg>
              <span class="flex-1 ms-3 whitespace-nowrap text-left">Dashboard</span>
            </button>
          </li>

          <li class="pt-2 mt-2 border-t border-gray-200"></li>

          <!-- Faculty Management -->
          <li>
            <button
              (click)="selectTab('faculty')"
              [class.bg-blue-50]="activeTab() === 'faculty'"
              [class.text-blue-600]="activeTab() === 'faculty'"
              class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
            >
              <svg class="shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-width="2"
                  d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <span class="flex-1 ms-3 whitespace-nowrap text-left">Faculty</span>
            </button>
          </li>

          <!-- Organization -->
          <li>
            <button
              (click)="selectTab('organization')"
              [class.bg-blue-50]="activeTab() === 'organization'"
              [class.text-blue-600]="activeTab() === 'organization'"
              class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
            >
              <svg class="shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z"
                />
              </svg>
              <span class="flex-1 ms-3 whitespace-nowrap text-left">Organization</span>
            </button>
          </li>

          <!-- Accomplishments -->
          <li>
            <button
              (click)="selectTab('accomplishments')"
              [class.bg-blue-50]="activeTab() === 'accomplishments'"
              [class.text-blue-600]="activeTab() === 'accomplishments'"
              class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
            >
              <svg class="shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 3v4a1 1 0 0 1-1 1H5m8-2h3m-3 3h3m-4 3v6m4-3H8M19 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                />
              </svg>
              <span class="flex-1 ms-3 whitespace-nowrap text-left">Accomplishments</span>
            </button>
          </li>

          <li class="pt-2 mt-2 border-t border-gray-200"></li>

          <!-- Settings Section -->
          <li>
            <div class="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">Settings</div>
          </li>

          <!-- Sections -->
          <li>
            <button
              (click)="selectTab('sections')"
              [class.bg-blue-50]="activeTab() === 'sections'"
              [class.text-blue-600]="activeTab() === 'sections'"
              class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
            >
              <svg class="shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
                />
              </svg>
              <span class="flex-1 ms-3 whitespace-nowrap text-left">Sections</span>
            </button>
          </li>

          <!-- Programs -->
          <li>
            <button
              (click)="selectTab('programs')"
              [class.bg-blue-50]="activeTab() === 'programs'"
              [class.text-blue-600]="activeTab() === 'programs'"
              class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
            >
              <svg class="shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z"
                />
              </svg>
              <span class="flex-1 ms-3 whitespace-nowrap text-left">Programs</span>
            </button>
          </li>

          <!-- Courses/Subjects -->
          <li>
            <button
              (click)="selectTab('courses')"
              [class.bg-blue-50]="activeTab() === 'courses'"
              [class.text-blue-600]="activeTab() === 'courses'"
              class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
            >
              <svg class="shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"
                />
              </svg>
              <span class="flex-1 ms-3 whitespace-nowrap text-left">Courses</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>

    <!-- Top Bar -->
    <div
      class="fixed top-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4 gap-4 transition-all duration-300"
      [class.left-64]="isSidebarOpen()"
      [class.left-0]="!isSidebarOpen()"
      [class.right-0]="true"
    >
      <div class="flex items-center gap-4">
        <button
          (click)="toggleSidebar()"
          type="button"
          class="text-gray-900 bg-transparent hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm p-2 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h10" />
          </svg>
        </button>
        <h1 class="text-xl font-bold text-gray-900">{{ getPageTitle() }}</h1>
      </div>

      <!-- User Menu -->
      <div class="relative">
        <button
          (click)="toggleUserMenu()"
          class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span class="font-medium">Dean</span>
          <svg
            class="w-4 h-4 transition-transform"
            [class.rotate-180]="isUserMenuOpen()"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        @if (isUserMenuOpen()) {
          <div
            class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <button
              disabled
              class="flex items-center w-full px-4 py-2 text-gray-400 cursor-not-allowed rounded-t-lg"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Settings</span>
            </button>
            <button
              (click)="logout()"
              class="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-lg transition"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        }
      </div>
    </div>

    <!-- Main Content -->
    <div class="pt-20 pl-4 pr-4 pb-4 transition-all duration-300" [class.ml-64]="isSidebarOpen()">
      @if (activeTab() === 'dashboard') {
        <div class="container mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
            <p class="text-gray-600">Monitor department accomplishments and faculty performance</p>
          </div>

          <!-- Filters -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                <select
                  [(ngModel)]="selectedAcademicYear"
                  (change)="loadDepartmentStats()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option [value]="0">All Years</option>
                  @for (year of academicYearsList(); track year.academic_year_id) {
                    <option [value]="year.academic_year_id">
                      {{ year.year_start }}-{{ year.year_end }}
                    </option>
                  }
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                <select
                  [(ngModel)]="selectedSemester"
                  (change)="loadDepartmentStats()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">All Semesters</option>
                  <option value="1st Sem">1st Semester</option>
                  <option value="2nd Sem">2nd Semester</option>
                </select>
              </div>
            </div>
          </div>

          @if (loading()) {
            <div class="text-center py-12">
              <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p class="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          }

          @if (!loading() && departmentStats()) {
            <!-- Key Metrics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div class="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium opacity-90 mb-1">Total Faculty</h3>
                    <p class="text-4xl font-bold">{{ departmentStats()!.total_faculty }}</p>
                  </div>
                  <div class="text-5xl opacity-30">
                    <i class="fas fa-users"></i>
                  </div>
                </div>
              </div>
              <div class="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium opacity-90 mb-1">Total Requirements</h3>
                    <p class="text-4xl font-bold">{{ departmentStats()!.total_requirements }}</p>
                  </div>
                  <div class="text-5xl opacity-30">
                    <i class="fas fa-clipboard-list"></i>
                  </div>
                </div>
              </div>
              <div class="bg-linear-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium opacity-90 mb-1">Cleared</h3>
                    <p class="text-4xl font-bold">{{ departmentStats()!.cleared }}</p>
                  </div>
                  <div class="text-5xl opacity-30">
                    <i class="fas fa-check-circle"></i>
                  </div>
                </div>
              </div>
              <div class="bg-linear-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium opacity-90 mb-1">Completion Rate</h3>
                    <p class="text-4xl font-bold">{{ departmentStats()!.completion_rate }}%</p>
                  </div>
                  <div class="text-5xl opacity-30">
                    <i class="fas fa-chart-line"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- Charts and Visualizations -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <!-- Status Distribution Chart -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-6">Requirements Status Distribution</h3>
                <div class="flex items-center justify-center mb-6">
                  <div class="relative w-64 h-64">
                    <!-- Donut Chart using conic-gradient -->
                    <div class="absolute inset-0 rounded-full" 
                      [style.background]="'conic-gradient(' +
                        'from 0deg, ' +
                        'rgb(34, 197, 94) 0deg ' + (departmentStats()!.cleared / departmentStats()!.total_requirements * 360) + 'deg, ' +
                        'rgb(234, 179, 8) ' + (departmentStats()!.cleared / departmentStats()!.total_requirements * 360) + 'deg ' + 
                        ((departmentStats()!.cleared + departmentStats()!.pending) / departmentStats()!.total_requirements * 360) + 'deg, ' +
                        'rgb(239, 68, 68) ' + ((departmentStats()!.cleared + departmentStats()!.pending) / departmentStats()!.total_requirements * 360) + 'deg ' +
                        ((departmentStats()!.cleared + departmentStats()!.pending + departmentStats()!.returned) / departmentStats()!.total_requirements * 360) + 'deg, ' +
                        'rgb(156, 163, 175) ' + ((departmentStats()!.cleared + departmentStats()!.pending + departmentStats()!.returned) / departmentStats()!.total_requirements * 360) + 'deg 360deg)'">
                    </div>
                    <!-- Center white circle for donut effect -->
                    <div class="absolute inset-8 bg-white rounded-full flex items-center justify-center flex-col">
                      <div class="text-3xl font-bold text-gray-800">{{ departmentStats()!.total_requirements }}</div>
                      <div class="text-sm text-gray-600">Total</div>
                    </div>
                  </div>
                </div>
                <!-- Legend -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 bg-green-500 rounded"></div>
                    <div class="text-sm">
                      <span class="font-semibold">{{ departmentStats()!.cleared }}</span>
                      <span class="text-gray-600"> Cleared</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 bg-yellow-500 rounded"></div>
                    <div class="text-sm">
                      <span class="font-semibold">{{ departmentStats()!.pending }}</span>
                      <span class="text-gray-600"> Pending</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 bg-red-500 rounded"></div>
                    <div class="text-sm">
                      <span class="font-semibold">{{ departmentStats()!.returned }}</span>
                      <span class="text-gray-600"> Returned</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 bg-gray-400 rounded"></div>
                    <div class="text-sm">
                      <span class="font-semibold">{{ departmentStats()!.not_submitted }}</span>
                      <span class="text-gray-600"> Not Submitted</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Progress Bar Chart -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-6">Department Progress Overview</h3>
                <div class="space-y-6">
                  <!-- Cleared Progress -->
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-medium text-gray-700">Cleared Requirements</span>
                      <span class="text-sm font-semibold text-green-600">
                        {{ departmentStats()!.cleared }} / {{ departmentStats()!.total_requirements }}
                        ({{ (departmentStats()!.cleared / departmentStats()!.total_requirements * 100).toFixed(1) }}%)
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div class="bg-linear-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500"
                        [style.width.%]="(departmentStats()!.cleared / departmentStats()!.total_requirements * 100)">
                      </div>
                    </div>
                  </div>

                  <!-- Pending Reviews -->
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-medium text-gray-700">Pending Reviews</span>
                      <span class="text-sm font-semibold text-yellow-600">
                        {{ departmentStats()!.pending }} / {{ departmentStats()!.total_requirements }}
                        ({{ (departmentStats()!.pending / departmentStats()!.total_requirements * 100).toFixed(1) }}%)
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div class="bg-linear-to-r from-yellow-400 to-yellow-600 h-full rounded-full transition-all duration-500"
                        [style.width.%]="(departmentStats()!.pending / departmentStats()!.total_requirements * 100)">
                      </div>
                    </div>
                  </div>

                  <!-- Returned -->
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-medium text-gray-700">Returned for Revision</span>
                      <span class="text-sm font-semibold text-red-600">
                        {{ departmentStats()!.returned }} / {{ departmentStats()!.total_requirements }}
                        ({{ (departmentStats()!.returned / departmentStats()!.total_requirements * 100).toFixed(1) }}%)
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div class="bg-linear-to-r from-red-400 to-red-600 h-full rounded-full transition-all duration-500"
                        [style.width.%]="(departmentStats()!.returned / departmentStats()!.total_requirements * 100)">
                      </div>
                    </div>
                  </div>

                  <!-- Not Submitted -->
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-medium text-gray-700">Not Yet Submitted</span>
                      <span class="text-sm font-semibold text-gray-600">
                        {{ departmentStats()!.not_submitted }} / {{ departmentStats()!.total_requirements }}
                        ({{ (departmentStats()!.not_submitted / departmentStats()!.total_requirements * 100).toFixed(1) }}%)
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div class="bg-linear-to-r from-gray-400 to-gray-600 h-full rounded-full transition-all duration-500"
                        [style.width.%]="(departmentStats()!.not_submitted / departmentStats()!.total_requirements * 100)">
                      </div>
                    </div>
                  </div>

                  <!-- Overall Completion -->
                  <div class="pt-4 border-t border-gray-200">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-base font-bold text-gray-800">Overall Completion</span>
                      <span class="text-base font-bold text-blue-600">{{ departmentStats()!.completion_rate }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div class="bg-linear-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 flex items-center justify-end px-2"
                        [style.width.%]="departmentStats()!.completion_rate">
                        <span class="text-xs font-semibold text-white">{{ departmentStats()!.completion_rate }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Status Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-green-800 mb-1">Cleared</h3>
                    <p class="text-3xl font-bold text-green-600">{{ departmentStats()!.cleared }}</p>
                    <p class="text-xs text-green-700 mt-2">
                      {{ (departmentStats()!.cleared / departmentStats()!.total_requirements * 100).toFixed(1) }}% of total
                    </p>
                  </div>
                  <div class="text-4xl text-green-300">
                    <i class="fas fa-check-circle"></i>
                  </div>
                </div>
              </div>

              <div class="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-yellow-800 mb-1">Pending Review</h3>
                    <p class="text-3xl font-bold text-yellow-600">{{ departmentStats()!.pending }}</p>
                    <p class="text-xs text-yellow-700 mt-2">
                      {{ (departmentStats()!.pending / departmentStats()!.total_requirements * 100).toFixed(1) }}% of total
                    </p>
                  </div>
                  <div class="text-4xl text-yellow-300">
                    <i class="fas fa-clock"></i>
                  </div>
                </div>
              </div>

              <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-red-800 mb-1">Returned</h3>
                    <p class="text-3xl font-bold text-red-600">{{ departmentStats()!.returned }}</p>
                    <p class="text-xs text-red-700 mt-2">
                      {{ (departmentStats()!.returned / departmentStats()!.total_requirements * 100).toFixed(1) }}% of total
                    </p>
                  </div>
                  <div class="text-4xl text-red-300">
                    <i class="fas fa-undo"></i>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 border-l-4 border-gray-500 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-gray-800 mb-1">Not Submitted</h3>
                    <p class="text-3xl font-bold text-gray-600">{{ departmentStats()!.not_submitted }}</p>
                    <p class="text-xs text-gray-700 mt-2">
                      {{ (departmentStats()!.not_submitted / departmentStats()!.total_requirements * 100).toFixed(1) }}% of total
                    </p>
                  </div>
                  <div class="text-4xl text-gray-300">
                    <i class="fas fa-exclamation-circle"></i>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
      @if (activeTab() === 'faculty') {
        <app-dean-faculty-management />
      }
      @if (activeTab() === 'organization') {
        <app-dean-organization-management />
      }
      @if (activeTab() === 'accomplishments') {
        <app-dean-requirements-monitoring />
      }
      @if (activeTab() === 'sections') {
        <app-dean-section-management />
      }
      @if (activeTab() === 'programs') {
        <app-dean-program-management />
      }
      @if (activeTab() === 'courses') {
        <app-dean-course-management />
      }
    </div>
  `,
  styles: [],
})
export class DeanDashboard implements OnInit {
  isSidebarOpen = signal(true);
  activeTab = signal<string>('dashboard');
  isUserMenuOpen = signal(false);

  // Dashboard data
  loading = signal(false);
  departmentStats = signal<DepartmentStatistics | null>(null);
  academicYearsList = signal<DropdownAcademicYear[]>([]);
  selectedAcademicYear = signal<number>(0);
  selectedSemester = signal<string>('');

  constructor(
    public authService: Auth,
    private requirementService: DeanRequirementService,
    private dropdownService: DropdownService
  ) {}

  ngOnInit() {
    this.loadAcademicYears();
    this.loadDepartmentStats();
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

  loadDepartmentStats() {
    this.loading.set(true);
    this.requirementService
      .getDepartmentStatistics(
        this.selectedAcademicYear() || undefined,
        this.selectedSemester() || undefined,
      )
      .subscribe({
        next: (stats) => {
          this.departmentStats.set(stats);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading statistics:', error);
          this.loading.set(false);
        },
      });
  }

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }

  toggleUserMenu() {
    this.isUserMenuOpen.set(!this.isUserMenuOpen());
  }

  selectTab(tab: string) {
    this.activeTab.set(tab);
  }

  logout() {
    this.authService.logout();
  }

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      dashboard: 'Dashboard',
      faculty: 'Faculty Management',
      organization: 'Organization Management',
      accomplishments: 'Accomplishments Monitoring',
      sections: 'Section Settings',
      programs: 'Program Management',
      courses: 'Course Settings',
    };
    return titles[this.activeTab()] || 'Dashboard';
  }
}
