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
import { DeanFacultyCredentialsView } from '../../dean/faculty-credentials-view/faculty-credentials-view';
import {
  DeanRequirementService,
  DepartmentStatistics,
} from '../../../services/dean-requirement.service';
import { DropdownService, DropdownAcademicYear } from '../../../services/dropdown.service';
import {
  DeanAnalyticsService,
  FacultyDemographics,
  EducationAnalytics,
  ResearchAnalytics,
} from '../../../services/dean-analytics.service';

@Component({
  selector: 'app-dean-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DeanFacultyManagement,
    DeanOrganizationManagement,
    DeanCourseManagement,
    DeanSectionManagement,
    DeanProgramManagement,
    DeanRequirementsMonitoring,
    DeanFacultyCredentialsView,
  ],
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

          <!-- Faculty Credentials -->
          <li>
            <button
              (click)="selectTab('credentials')"
              [class.bg-blue-50]="activeTab() === 'credentials'"
              [class.text-blue-600]="activeTab() === 'credentials'"
              class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
            >
              <svg class="shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span class="flex-1 ms-3 whitespace-nowrap text-left">Faculty Credentials</span>
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
          <!-- Dashboard Sub-Tabs -->
          <div class="mb-6 border-b border-gray-200">
            <nav class="flex space-x-8">
              <button
                (click)="dashboardSubTab.set('overview')"
                [class.border-blue-500]="dashboardSubTab() === 'overview'"
                [class.text-blue-600]="dashboardSubTab() === 'overview'"
                [class.border-transparent]="dashboardSubTab() !== 'overview'"
                [class.text-gray-500]="dashboardSubTab() !== 'overview'"
                class="py-4 px-1 border-b-2 font-medium text-sm hover:text-blue-600 hover:border-blue-300 transition"
              >
                Requirements & Clearance
              </button>
              <button
                (click)="selectDashboardSubTab('analytics')"
                [class.border-blue-500]="dashboardSubTab() === 'analytics'"
                [class.text-blue-600]="dashboardSubTab() === 'analytics'"
                [class.border-transparent]="dashboardSubTab() !== 'analytics'"
                [class.text-gray-500]="dashboardSubTab() !== 'analytics'"
                class="py-4 px-1 border-b-2 font-medium text-sm hover:text-blue-600 hover:border-blue-300 transition"
              >
                Faculty Analytics
              </button>
            </nav>
          </div>

          @if (dashboardSubTab() === 'overview') {
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
                <div
                  class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
                ></div>
                <p class="mt-4 text-gray-600">Loading dashboard...</p>
              </div>
            }

            @if (!loading() && departmentStats()) {
              <!-- Key Metrics Cards -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div
                  class="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white"
                >
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
                <div
                  class="bg-linear-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-medium opacity-90 mb-1">Cleared Faculties</h3>
                      <p class="text-4xl font-bold">{{ departmentStats()!.cleared_faculties }}</p>
                      <p class="text-xs opacity-90 mt-1">
                        {{ departmentStats()!.faculty_clearance_rate }}% of total
                      </p>
                    </div>
                    <div class="text-5xl opacity-30">
                      <i class="fas fa-user-check"></i>
                    </div>
                  </div>
                </div>
                <div
                  class="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white"
                >
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
                <div
                  class="bg-linear-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-medium opacity-90 mb-1">Requirements Validated</h3>
                      <p class="text-4xl font-bold">{{ departmentStats()!.validated }}</p>
                      <p class="text-xs opacity-90 mt-1">
                        {{ departmentStats()!.completion_rate }}% complete
                      </p>
                    </div>
                    <div class="text-5xl opacity-30">
                      <i class="fas fa-check-circle"></i>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Charts and Visualizations -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Status Distribution Chart -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h3 class="text-lg font-bold text-gray-800 mb-6">
                    Requirements Status Distribution
                  </h3>
                  <div class="flex items-center justify-center mb-6">
                    <div class="relative w-64 h-64">
                      <!-- Donut Chart using conic-gradient -->
                      <div
                        class="absolute inset-0 rounded-full"
                        [style.background]="
                          'conic-gradient(' +
                          'from 0deg, ' +
                          'rgb(34, 197, 94) 0deg ' +
                          (departmentStats()!.validated / departmentStats()!.total_requirements) *
                            360 +
                          'deg, ' +
                          'rgb(234, 179, 8) ' +
                          (departmentStats()!.validated / departmentStats()!.total_requirements) *
                            360 +
                          'deg ' +
                          ((departmentStats()!.validated + departmentStats()!.pending) /
                            departmentStats()!.total_requirements) *
                            360 +
                          'deg, ' +
                          'rgb(239, 68, 68) ' +
                          ((departmentStats()!.validated + departmentStats()!.pending) /
                            departmentStats()!.total_requirements) *
                            360 +
                          'deg ' +
                          ((departmentStats()!.validated +
                            departmentStats()!.pending +
                            departmentStats()!.returned) /
                            departmentStats()!.total_requirements) *
                            360 +
                          'deg, ' +
                          'rgb(156, 163, 175) ' +
                          ((departmentStats()!.validated +
                            departmentStats()!.pending +
                            departmentStats()!.returned) /
                            departmentStats()!.total_requirements) *
                            360 +
                          'deg 360deg)'
                        "
                      ></div>
                      <!-- Center white circle for donut effect -->
                      <div
                        class="absolute inset-8 bg-white rounded-full flex items-center justify-center flex-col"
                      >
                        <div class="text-3xl font-bold text-gray-800">
                          {{ departmentStats()!.total_requirements }}
                        </div>
                        <div class="text-sm text-gray-600">Total</div>
                      </div>
                    </div>
                  </div>
                  <!-- Legend -->
                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center space-x-2">
                      <div class="w-4 h-4 bg-green-500 rounded"></div>
                      <div class="text-sm">
                        <span class="font-semibold">{{ departmentStats()!.validated }}</span>
                        <span class="text-gray-600"> Validated</span>
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

                <!-- Overall Completion -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h3 class="text-lg font-bold text-gray-800 mb-6">Overall Completion Rate</h3>
                  <div class="flex items-center justify-center mb-6">
                    <div class="relative w-64 h-64">
                      <svg class="transform -rotate-90 w-64 h-64">
                        <circle
                          cx="128"
                          cy="128"
                          r="100"
                          stroke="#e5e7eb"
                          stroke-width="20"
                          fill="none"
                        />
                        <circle
                          cx="128"
                          cy="128"
                          r="100"
                          stroke="#3b82f6"
                          stroke-width="20"
                          fill="none"
                          [attr.stroke-dasharray]="628"
                          [attr.stroke-dashoffset]="
                            628 - (628 * +departmentStats()!.completion_rate) / 100
                          "
                          class="transition-all duration-1000"
                        />
                      </svg>
                      <div class="absolute inset-0 flex items-center justify-center flex-col">
                        <div class="text-5xl font-bold text-blue-600">
                          {{ departmentStats()!.completion_rate }}%
                        </div>
                        <div class="text-sm text-gray-600 mt-2">Complete</div>
                      </div>
                    </div>
                  </div>
                  <div class="text-center text-sm text-gray-600">
                    <p class="mb-2">
                      <span class="font-semibold text-gray-800">{{
                        departmentStats()!.validated
                      }}</span>
                      out of
                      <span class="font-semibold text-gray-800">{{
                        departmentStats()!.total_requirements
                      }}</span>
                      requirements validated
                    </p>
                    <p class="text-xs text-gray-500">
                      Faculty Clearance:
                      <span class="font-semibold text-green-600"
                        >{{ departmentStats()!.faculty_clearance_rate }}%</span
                      >
                      ({{ departmentStats()!.cleared_faculties }}/{{
                        departmentStats()!.total_faculty
                      }})
                    </p>
                  </div>
                </div>
              </div>

              <!-- Faculty Clearance Status -->
              <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 class="text-lg font-bold text-gray-800 mb-6">Faculty Clearance Status</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- Cleared Faculties -->
                  <div
                    class="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border-2 border-green-200"
                  >
                    <div class="shrink-0">
                      <div
                        class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white"
                      >
                        <i class="fas fa-user-check text-2xl"></i>
                      </div>
                    </div>
                    <div class="flex-1">
                      <p class="text-3xl font-bold text-green-700">
                        {{ departmentStats()!.cleared_faculties }}
                      </p>
                      <p class="text-sm text-green-600 font-medium">Cleared Faculties</p>
                      <p class="text-xs text-gray-600 mt-1">All requirements approved</p>
                    </div>
                  </div>

                  <!-- Pending Faculties -->
                  <div
                    class="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200"
                  >
                    <div class="shrink-0">
                      <div
                        class="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white"
                      >
                        <i class="fas fa-clock text-2xl"></i>
                      </div>
                    </div>
                    <div class="flex-1">
                      <p class="text-3xl font-bold text-yellow-700">
                        {{ departmentStats()!.pending_faculties }}
                      </p>
                      <p class="text-sm text-yellow-600 font-medium">Pending Faculties</p>
                      <p class="text-xs text-gray-600 mt-1">Incomplete requirements</p>
                    </div>
                  </div>

                  <!-- Withholding Faculties -->
                  <div
                    class="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border-2 border-red-200"
                  >
                    <div class="shrink-0">
                      <div
                        class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white"
                      >
                        <i class="fas fa-exclamation-triangle text-2xl"></i>
                      </div>
                    </div>
                    <div class="flex-1">
                      <p class="text-3xl font-bold text-red-700">
                        {{ departmentStats()!.withholding_faculties }}
                      </p>
                      <p class="text-sm text-red-600 font-medium">Withholding</p>
                      <p class="text-xs text-gray-600 mt-1">Has returned requirements</p>
                    </div>
                  </div>
                </div>

                <!-- Faculty Clearance Progress Bar -->
                <div class="mt-6">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-700">Faculty Clearance Rate</span>
                    <span class="text-sm font-semibold text-green-600">
                      {{ departmentStats()!.cleared_faculties }} /
                      {{ departmentStats()!.total_faculty }} ({{
                        departmentStats()!.faculty_clearance_rate
                      }}%)
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      class="bg-linear-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500 flex items-center justify-end px-3"
                      [style.width.%]="departmentStats()!.faculty_clearance_rate"
                    >
                      <span class="text-xs font-semibold text-white"
                        >{{ departmentStats()!.faculty_clearance_rate }}%</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            }
          }

          @if (dashboardSubTab() === 'analytics') {
            @if (loading()) {
              <div class="text-center py-12">
                <div
                  class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
                ></div>
                <p class="mt-4 text-gray-600">Loading analytics...</p>
              </div>
            }

            @if (!loading() && facultyDemographics()) {
              <!-- Key Metrics Cards -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div
                  class="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-medium opacity-90 mb-1">Total Faculty</h3>
                      <p class="text-4xl font-bold">{{ facultyDemographics()!.total_faculty }}</p>
                    </div>
                    <div class="text-5xl opacity-30">
                      <i class="fas fa-users"></i>
                    </div>
                  </div>
                </div>
                <div
                  class="bg-linear-to-br from-pink-500 to-pink-600 rounded-lg shadow-lg p-6 text-white"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-medium opacity-90 mb-1">Male Faculty</h3>
                      <p class="text-4xl font-bold">{{ facultyDemographics()!.gender.male }}</p>
                      <p class="text-xs opacity-90 mt-1">
                        {{
                          (
                            (facultyDemographics()!.gender.male /
                              facultyDemographics()!.total_faculty) *
                            100
                          ).toFixed(1)
                        }}% of total
                      </p>
                    </div>
                    <div class="text-5xl opacity-30">
                      <i class="fas fa-male"></i>
                    </div>
                  </div>
                </div>
                <div
                  class="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-medium opacity-90 mb-1">Female Faculty</h3>
                      <p class="text-4xl font-bold">{{ facultyDemographics()!.gender.female }}</p>
                      <p class="text-xs opacity-90 mt-1">
                        {{
                          (
                            (facultyDemographics()!.gender.female /
                              facultyDemographics()!.total_faculty) *
                            100
                          ).toFixed(1)
                        }}% of total
                      </p>
                    </div>
                    <div class="text-5xl opacity-30">
                      <i class="fas fa-female"></i>
                    </div>
                  </div>
                </div>
                <div
                  class="bg-linear-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-medium opacity-90 mb-1">Doctorate Holders</h3>
                      <p class="text-4xl font-bold">
                        {{ facultyDemographics()!.education.doctorate }}
                      </p>
                      <p class="text-xs opacity-90 mt-1">
                        {{
                          (
                            (facultyDemographics()!.education.doctorate /
                              facultyDemographics()!.total_faculty) *
                            100
                          ).toFixed(1)
                        }}% of total
                      </p>
                    </div>
                    <div class="text-5xl opacity-30">
                      <i class="fas fa-graduation-cap"></i>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Charts Row 1 -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Gender Distribution -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h3 class="text-lg font-bold text-gray-800 mb-6">Gender Distribution</h3>
                  <div class="flex items-center justify-center mb-6">
                    <div class="relative w-64 h-64">
                      <div
                        class="absolute inset-0 rounded-full"
                        [style.background]="
                          'conic-gradient(' +
                          'from 0deg, ' +
                          'rgb(236, 72, 153) 0deg ' +
                          (facultyDemographics()!.gender.male /
                            facultyDemographics()!.total_faculty) *
                            360 +
                          'deg, ' +
                          'rgb(168, 85, 247) ' +
                          (facultyDemographics()!.gender.male /
                            facultyDemographics()!.total_faculty) *
                            360 +
                          'deg 360deg)'
                        "
                      ></div>
                      <div
                        class="absolute inset-8 bg-white rounded-full flex items-center justify-center flex-col"
                      >
                        <div class="text-3xl font-bold text-gray-800">
                          {{ facultyDemographics()!.total_faculty }}
                        </div>
                        <div class="text-sm text-gray-600">Total</div>
                      </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center space-x-2">
                      <div class="w-4 h-4 bg-pink-500 rounded"></div>
                      <div class="text-sm">
                        <span class="font-semibold">{{ facultyDemographics()!.gender.male }}</span>
                        <span class="text-gray-600"> Male</span>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-4 h-4 bg-purple-500 rounded"></div>
                      <div class="text-sm">
                        <span class="font-semibold">{{
                          facultyDemographics()!.gender.female
                        }}</span>
                        <span class="text-gray-600"> Female</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Age Distribution -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h3 class="text-lg font-bold text-gray-800 mb-6">Age Distribution</h3>
                  <div class="space-y-4">
                    <div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium text-gray-700">20-29 years</span>
                        <span class="text-sm font-semibold text-blue-600">
                          {{ facultyDemographics()!.age_ranges['20-29'] }}
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-3">
                        <div
                          class="bg-blue-500 h-full rounded-full"
                          [style.width.%]="
                            (facultyDemographics()!.age_ranges['20-29'] /
                              facultyDemographics()!.total_faculty) *
                            100
                          "
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium text-gray-700">30-39 years</span>
                        <span class="text-sm font-semibold text-green-600">
                          {{ facultyDemographics()!.age_ranges['30-39'] }}
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-3">
                        <div
                          class="bg-green-500 h-full rounded-full"
                          [style.width.%]="
                            (facultyDemographics()!.age_ranges['30-39'] /
                              facultyDemographics()!.total_faculty) *
                            100
                          "
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium text-gray-700">40-49 years</span>
                        <span class="text-sm font-semibold text-yellow-600">
                          {{ facultyDemographics()!.age_ranges['40-49'] }}
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-3">
                        <div
                          class="bg-yellow-500 h-full rounded-full"
                          [style.width.%]="
                            (facultyDemographics()!.age_ranges['40-49'] /
                              facultyDemographics()!.total_faculty) *
                            100
                          "
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium text-gray-700">50-59 years</span>
                        <span class="text-sm font-semibold text-orange-600">
                          {{ facultyDemographics()!.age_ranges['50-59'] }}
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-3">
                        <div
                          class="bg-orange-500 h-full rounded-full"
                          [style.width.%]="
                            (facultyDemographics()!.age_ranges['50-59'] /
                              facultyDemographics()!.total_faculty) *
                            100
                          "
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium text-gray-700">60+ years</span>
                        <span class="text-sm font-semibold text-red-600">
                          {{ facultyDemographics()!.age_ranges['60+'] }}
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-3">
                        <div
                          class="bg-red-500 h-full rounded-full"
                          [style.width.%]="
                            (facultyDemographics()!.age_ranges['60+'] /
                              facultyDemographics()!.total_faculty) *
                            100
                          "
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Charts Row 2: Demographics -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Civil Status -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h3 class="text-lg font-bold text-gray-800 mb-6">Civil Status</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p class="text-sm text-gray-600">Single</p>
                        <p class="text-2xl font-bold text-green-600">
                          {{ facultyDemographics()!.civil_status.single }}
                        </p>
                      </div>
                      <div class="text-sm text-gray-600">
                        {{
                          (
                            (facultyDemographics()!.civil_status.single /
                              facultyDemographics()!.total_faculty) *
                            100
                          ).toFixed(1)
                        }}%
                      </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p class="text-sm text-gray-600">Married</p>
                        <p class="text-2xl font-bold text-blue-600">
                          {{ facultyDemographics()!.civil_status.married }}
                        </p>
                      </div>
                      <div class="text-sm text-gray-600">
                        {{
                          (
                            (facultyDemographics()!.civil_status.married /
                              facultyDemographics()!.total_faculty) *
                            100
                          ).toFixed(1)
                        }}%
                      </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p class="text-sm text-gray-600">Widowed</p>
                        <p class="text-2xl font-bold text-gray-600">
                          {{ facultyDemographics()!.civil_status.widowed }}
                        </p>
                      </div>
                      <div class="text-sm text-gray-600">
                        {{
                          (
                            (facultyDemographics()!.civil_status.widowed /
                              facultyDemographics()!.total_faculty) *
                            100
                          ).toFixed(1)
                        }}%
                      </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p class="text-sm text-gray-600">Separated</p>
                        <p class="text-2xl font-bold text-yellow-600">
                          {{ facultyDemographics()!.civil_status.separated }}
                        </p>
                      </div>
                      <div class="text-sm text-gray-600">
                        {{
                          (
                            (facultyDemographics()!.civil_status.separated /
                              facultyDemographics()!.total_faculty) *
                            100
                          ).toFixed(1)
                        }}%
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Credential Status -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h3 class="text-lg font-bold text-gray-800 mb-6">Credential Status</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p class="text-sm text-gray-600">Validated</p>
                        <p class="text-2xl font-bold text-green-600">
                          {{ facultyDemographics()!.credential_status.validated }}
                        </p>
                      </div>
                      <div class="text-sm text-gray-600">
                        {{
                          (
                            (facultyDemographics()!.credential_status.validated /
                              facultyDemographics()!.total_faculty) *
                            100
                          ).toFixed(1)
                        }}%
                      </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p class="text-sm text-gray-600">Pending</p>
                        <p class="text-2xl font-bold text-yellow-600">
                          {{ facultyDemographics()!.credential_status.pending }}
                        </p>
                      </div>
                      <div class="text-sm text-gray-600">
                        {{
                          (
                            (facultyDemographics()!.credential_status.pending /
                              facultyDemographics()!.total_faculty) *
                            100
                          ).toFixed(1)
                        }}%
                      </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p class="text-sm text-gray-600">Returned</p>
                        <p class="text-2xl font-bold text-red-600">
                          {{ facultyDemographics()!.credential_status.returned }}
                        </p>
                      </div>
                      <div class="text-sm text-gray-600">
                        {{
                          (
                            (facultyDemographics()!.credential_status.returned /
                              facultyDemographics()!.total_faculty) *
                            100
                          ).toFixed(1)
                        }}%
                      </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p class="text-sm text-gray-600">Not Submitted</p>
                        <p class="text-2xl font-bold text-gray-600">
                          {{ facultyDemographics()!.credential_status.not_submitted }}
                        </p>
                      </div>
                      <div class="text-sm text-gray-600">
                        {{
                          (
                            (facultyDemographics()!.credential_status.not_submitted /
                              facultyDemographics()!.total_faculty) *
                            100
                          ).toFixed(1)
                        }}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section Divider -->
              <div class="my-8 border-t-2 border-gray-300 relative">
                <div
                  class="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4"
                >
                  <h2 class="text-xl font-bold text-gray-700">Academic Information</h2>
                </div>
              </div>

              <!-- Charts Row 3: Academic -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Educational Attainment -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h3 class="text-lg font-bold text-gray-800 mb-6">Educational Attainment</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                      <div>
                        <p class="text-sm text-gray-600">Doctorate</p>
                        <p class="text-2xl font-bold text-indigo-600">
                          {{ facultyDemographics()!.education.doctorate }}
                        </p>
                      </div>
                      <div class="text-sm text-gray-600">
                        {{
                          (
                            (facultyDemographics()!.education.doctorate /
                              facultyDemographics()!.total_faculty) *
                            100
                          ).toFixed(1)
                        }}%
                      </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p class="text-sm text-gray-600">Masters</p>
                        <p class="text-2xl font-bold text-purple-600">
                          {{ facultyDemographics()!.education.masters }}
                        </p>
                      </div>
                      <div class="text-sm text-gray-600">
                        {{
                          (
                            (facultyDemographics()!.education.masters /
                              facultyDemographics()!.total_faculty) *
                            100
                          ).toFixed(1)
                        }}%
                      </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p class="text-sm text-gray-600">Bachelors</p>
                        <p class="text-2xl font-bold text-blue-600">
                          {{ facultyDemographics()!.education.bachelors }}
                        </p>
                      </div>
                      <div class="text-sm text-gray-600">
                        {{
                          (
                            (facultyDemographics()!.education.bachelors /
                              facultyDemographics()!.total_faculty) *
                            100
                          ).toFixed(1)
                        }}%
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Currently Enrolled -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h3 class="text-lg font-bold text-gray-800 mb-6">Currently Enrolled</h3>
                  @if (educationAnalytics()) {
                    <div class="space-y-4">
                      <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <p class="text-sm text-gray-600">Masters Program</p>
                          <p class="text-2xl font-bold text-purple-600">
                            {{ educationAnalytics()!.currently_enrolled.masters }}
                          </p>
                        </div>
                        <div class="text-sm text-gray-600">
                          {{
                            (
                              (educationAnalytics()!.currently_enrolled.masters /
                                facultyDemographics()!.total_faculty) *
                              100
                            ).toFixed(1)
                          }}%
                        </div>
                      </div>
                      <div class="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                        <div>
                          <p class="text-sm text-gray-600">Doctorate Program</p>
                          <p class="text-2xl font-bold text-indigo-600">
                            {{ educationAnalytics()!.currently_enrolled.doctorate }}
                          </p>
                        </div>
                        <div class="text-sm text-gray-600">
                          {{
                            (
                              (educationAnalytics()!.currently_enrolled.doctorate /
                                facultyDemographics()!.total_faculty) *
                              100
                            ).toFixed(1)
                          }}%
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Charts Row 4: Certifications & Trainings -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Certifications & Eligibility -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h3 class="text-lg font-bold text-gray-800 mb-6">Certifications & Eligibility</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <p class="text-sm text-gray-600">Total Certifications</p>
                        <p class="text-3xl font-bold text-blue-600">
                          {{ facultyDemographics()!.certifications.total_certifications }}
                        </p>
                      </div>
                      <div class="text-4xl text-blue-300">
                        <i class="fas fa-certificate"></i>
                      </div>
                    </div>
                    <div class="space-y-3">
                      <div>
                        <div class="flex justify-between items-center mb-1">
                          <div class="flex items-center gap-2">
                            <i class="fas fa-id-card text-green-600"></i>
                            <span class="text-sm font-medium text-gray-700"
                              >Professional License</span
                            >
                          </div>
                          <span class="text-lg font-bold text-green-600">
                            {{ facultyDemographics()!.certifications.with_professional_license }}
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-3">
                          <div
                            class="bg-green-500 h-full rounded-full"
                            [style.width.%]="
                              (facultyDemographics()!.certifications.with_professional_license /
                                facultyDemographics()!.total_faculty) *
                              100
                            "
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div class="flex justify-between items-center mb-1">
                          <div class="flex items-center gap-2">
                            <i class="fas fa-award text-purple-600"></i>
                            <span class="text-sm font-medium text-gray-700">Civil Service</span>
                          </div>
                          <span class="text-lg font-bold text-purple-600">
                            {{ facultyDemographics()!.certifications.with_civil_service }}
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-3">
                          <div
                            class="bg-purple-500 h-full rounded-full"
                            [style.width.%]="
                              (facultyDemographics()!.certifications.with_civil_service /
                                facultyDemographics()!.total_faculty) *
                              100
                            "
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div class="flex justify-between items-center mb-1">
                          <div class="flex items-center gap-2">
                            <i class="fas fa-graduation-cap text-indigo-600"></i>
                            <span class="text-sm font-medium text-gray-700">Board/Bar Exam</span>
                          </div>
                          <span class="text-lg font-bold text-indigo-600">
                            {{ facultyDemographics()!.certifications.with_board_exam }}
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-3">
                          <div
                            class="bg-indigo-500 h-full rounded-full"
                            [style.width.%]="
                              (facultyDemographics()!.certifications.with_board_exam /
                                facultyDemographics()!.total_faculty) *
                              100
                            "
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Trainings & Seminars -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h3 class="text-lg font-bold text-gray-800 mb-6">Trainings & Seminars</h3>
                  <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div class="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                        <div>
                          <p class="text-xs text-gray-600">Total Trainings</p>
                          <p class="text-3xl font-bold text-orange-600">
                            {{ facultyDemographics()!.training.total_trainings }}
                          </p>
                        </div>
                        <div class="text-3xl text-orange-300">
                          <i class="fas fa-chalkboard-teacher"></i>
                        </div>
                      </div>
                      <div class="flex items-center justify-between p-4 bg-teal-50 rounded-lg">
                        <div>
                          <p class="text-xs text-gray-600">Total Hours</p>
                          <p class="text-3xl font-bold text-teal-600">
                            {{ facultyDemographics()!.training.total_hours }}
                          </p>
                        </div>
                        <div class="text-3xl text-teal-300">
                          <i class="fas fa-clock"></i>
                        </div>
                      </div>
                    </div>
                    <div class="p-4 bg-blue-50 rounded-lg">
                      <div class="flex items-center justify-between mb-2">
                        <p class="text-sm text-gray-700">Faculty with Trainings</p>
                        <p class="text-2xl font-bold text-blue-600">
                          {{ facultyDemographics()!.training.faculty_with_trainings }}
                        </p>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-3">
                        <div
                          class="bg-blue-600 h-full rounded-full"
                          [style.width.%]="
                            (facultyDemographics()!.training.faculty_with_trainings /
                              facultyDemographics()!.total_faculty) *
                            100
                          "
                        ></div>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">
                        {{
                          (
                            (facultyDemographics()!.training.faculty_with_trainings /
                              facultyDemographics()!.total_faculty) *
                            100
                          ).toFixed(1)
                        }}% of faculty
                      </p>
                    </div>

                    <!-- Training Types Bar Chart -->
                    <div class="space-y-2">
                      <p class="text-sm font-medium text-gray-700 mb-2">Training Types</p>
                      <div>
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-xs text-gray-600">Managerial</span>
                          <span class="text-sm font-bold text-gray-700">
                            {{ facultyDemographics()!.training.by_type.managerial }}
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div
                            class="bg-blue-500 h-full rounded-full"
                            [style.width.%]="
                              facultyDemographics()!.training.total_trainings > 0
                                ? (facultyDemographics()!.training.by_type.managerial /
                                    facultyDemographics()!.training.total_trainings) *
                                  100
                                : 0
                            "
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-xs text-gray-600">Supervisory</span>
                          <span class="text-sm font-bold text-gray-700">
                            {{ facultyDemographics()!.training.by_type.supervisory }}
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div
                            class="bg-green-500 h-full rounded-full"
                            [style.width.%]="
                              facultyDemographics()!.training.total_trainings > 0
                                ? (facultyDemographics()!.training.by_type.supervisory /
                                    facultyDemographics()!.training.total_trainings) *
                                  100
                                : 0
                            "
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-xs text-gray-600">Technical</span>
                          <span class="text-sm font-bold text-gray-700">
                            {{ facultyDemographics()!.training.by_type.technical }}
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div
                            class="bg-purple-500 h-full rounded-full"
                            [style.width.%]="
                              facultyDemographics()!.training.total_trainings > 0
                                ? (facultyDemographics()!.training.by_type.technical /
                                    facultyDemographics()!.training.total_trainings) *
                                  100
                                : 0
                            "
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-xs text-gray-600">Others</span>
                          <span class="text-sm font-bold text-gray-700">
                            {{ facultyDemographics()!.training.by_type.others }}
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div
                            class="bg-orange-500 h-full rounded-full"
                            [style.width.%]="
                              facultyDemographics()!.training.total_trainings > 0
                                ? (facultyDemographics()!.training.by_type.others /
                                    facultyDemographics()!.training.total_trainings) *
                                  100
                                : 0
                            "
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Charts Row 5: Research & Publications -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Research & Publications -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h3 class="text-lg font-bold text-gray-800 mb-6">Research & Publications</h3>
                  @if (researchAnalytics()) {
                    <div class="space-y-4">
                      <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                          <p class="text-sm text-gray-600">Total Publications</p>
                          <p class="text-3xl font-bold text-blue-600">
                            {{ researchAnalytics()!.total_publications }}
                          </p>
                        </div>
                        <div class="text-4xl text-blue-300">
                          <i class="fas fa-book"></i>
                        </div>
                      </div>
                      <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                          <p class="text-sm text-gray-600">Faculty with Publications</p>
                          <p class="text-3xl font-bold text-green-600">
                            {{ researchAnalytics()!.faculty_with_publications }}
                          </p>
                        </div>
                        <div class="text-4xl text-green-300">
                          <i class="fas fa-user-graduate"></i>
                        </div>
                      </div>
                      <div class="p-4 bg-purple-50 rounded-lg">
                        <p class="text-sm text-gray-600 mb-2">Percentage with Publications</p>
                        <div class="flex items-center gap-4">
                          <div class="flex-1">
                            <div class="w-full bg-gray-200 rounded-full h-4">
                              <div
                                class="bg-purple-600 h-full rounded-full"
                                [style.width.%]="researchAnalytics()!.percentage_with_publications"
                              ></div>
                            </div>
                          </div>
                          <span class="text-2xl font-bold text-purple-600">
                            {{ researchAnalytics()!.percentage_with_publications }}%
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
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
      @if (activeTab() === 'credentials') {
        <app-dean-faculty-credentials-view />
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
  dashboardSubTab = signal<string>('overview');
  isUserMenuOpen = signal(false);

  // Dashboard data
  loading = signal(false);
  departmentStats = signal<DepartmentStatistics | null>(null);
  academicYearsList = signal<DropdownAcademicYear[]>([]);
  selectedAcademicYear = signal<number>(0);
  selectedSemester = signal<string>('');

  // Analytics data
  facultyDemographics = signal<FacultyDemographics | null>(null);
  educationAnalytics = signal<EducationAnalytics | null>(null);
  researchAnalytics = signal<ResearchAnalytics | null>(null);

  constructor(
    public authService: Auth,
    private requirementService: DeanRequirementService,
    private dropdownService: DropdownService,
    private analyticsService: DeanAnalyticsService,
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
    if (tab === 'dashboard') {
      this.dashboardSubTab.set('overview');
    }
  }

  selectDashboardSubTab(subTab: string) {
    this.dashboardSubTab.set(subTab);
    if (subTab === 'analytics') {
      this.loadAnalytics();
    }
  }

  loadAnalytics() {
    this.loading.set(true);

    // Load all analytics data
    this.analyticsService.getFacultyDemographics().subscribe({
      next: (data) => {
        this.facultyDemographics.set(data);
      },
      error: (error) => {
        console.error('Error loading faculty demographics:', error);
      },
    });

    this.analyticsService.getEducationAnalytics().subscribe({
      next: (data) => {
        this.educationAnalytics.set(data);
      },
      error: (error) => {
        console.error('Error loading education analytics:', error);
      },
    });

    this.analyticsService.getResearchAnalytics().subscribe({
      next: (data) => {
        this.researchAnalytics.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading research analytics:', error);
        this.loading.set(false);
      },
    });
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
      credentials: 'Faculty Credentials',
      sections: 'Section Settings',
      programs: 'Program Management',
      courses: 'Course Settings',
    };
    return titles[this.activeTab()] || 'Dashboard';
  }
}
