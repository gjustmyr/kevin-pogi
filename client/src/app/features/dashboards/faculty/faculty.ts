import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../services/auth/auth';
import { RouterModule } from '@angular/router';
import { FacultyRequirements } from '../../faculty/requirements/requirements';
import { FacultyCredentials } from '../../faculty/credentials/credentials';
import {
  FacultyRequirementService,
  Assignment,
} from '../../../services/faculty-requirement.service';
import { DropdownService, DropdownAcademicYear } from '../../../services/dropdown.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faculty-dashboard',
  imports: [CommonModule, RouterModule, FacultyRequirements, FacultyCredentials, FormsModule],
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
          <h2 class="text-xl font-bold text-gray-900 text-center">Faculty Portal</h2>
        </div>

        <ul class="space-y-2 font-medium">
          <!-- Dashboard -->
          <li>
            <button
              (click)="selectTab('dashboard')"
              [class.bg-green-50]="activeTab() === 'dashboard'"
              [class.text-green-600]="activeTab() === 'dashboard'"
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

          <!-- Accomplishments -->
          <li>
            <button
              (click)="selectTab('accomplishments')"
              [class.bg-green-50]="activeTab() === 'accomplishments'"
              [class.text-green-600]="activeTab() === 'accomplishments'"
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

          <!-- Credentials -->
          <li>
            <button
              (click)="selectTab('credentials')"
              [class.bg-green-50]="activeTab() === 'credentials'"
              [class.text-green-600]="activeTab() === 'credentials'"
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
              <span class="flex-1 ms-3 whitespace-nowrap text-left">Credentials</span>
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
          <span class="font-medium">
            {{ authService.currentUser()?.profile?.first_name }}
            {{ authService.currentUser()?.profile?.last_name }}
          </span>
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
              class="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-b-lg transition"
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
        <div class="p-4 border border-gray-200 border-dashed rounded-lg">
          <!-- Filters -->
          <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Academic Year</label
                >
                <select
                  [(ngModel)]="selectedAcademicYear"
                  (change)="filterData()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
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
                  (change)="filterData()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">All Semesters</option>
                  <option value="1st Sem">1st Semester</option>
                  <option value="2nd Sem">2nd Semester</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div
              class="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium opacity-90 mb-1">Total Courses</h3>
                  <p class="text-4xl font-bold">{{ dashboardStats().totalAssignments }}</p>
                </div>
                <div class="text-5xl opacity-30">
                  <i class="fas fa-book"></i>
                </div>
              </div>
            </div>

            <div
              class="bg-linear-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium opacity-90 mb-1">Total Requirements</h3>
                  <p class="text-4xl font-bold">{{ dashboardStats().totalRequirements }}</p>
                </div>
                <div class="text-5xl opacity-30">
                  <i class="fas fa-file-alt"></i>
                </div>
              </div>
            </div>

            @if (authService.currentUser()?.profile) {
              @if (authService.currentUser()!.profile.clearance_status === 'cleared') {
                <div
                  class="bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-medium opacity-90 mb-1">Clearance Status</h3>
                      <p class="text-4xl font-bold">Cleared</p>
                      @if (authService.currentUser()!.profile.clearance_date) {
                        <p class="text-xs opacity-80 mt-1">
                          {{ authService.currentUser()!.profile.clearance_date | date: 'MMM d, y' }}
                        </p>
                      }
                    </div>
                    <div class="text-5xl opacity-30">
                      <i class="fas fa-check-circle"></i>
                    </div>
                  </div>
                </div>
              } @else if (authService.currentUser()!.profile.clearance_status === 'withholding') {
                <div
                  class="bg-linear-to-br from-red-500 to-red-600 text-white rounded-lg shadow-lg p-6"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-medium opacity-90 mb-1">Clearance Status</h3>
                      <p class="text-4xl font-bold">Withholding</p>
                      @if (authService.currentUser()!.profile.clearance_date) {
                        <p class="text-xs opacity-80 mt-1">
                          {{ authService.currentUser()!.profile.clearance_date | date: 'MMM d, y' }}
                        </p>
                      }
                    </div>
                    <div class="text-5xl opacity-30">
                      <i class="fas fa-exclamation-circle"></i>
                    </div>
                  </div>
                </div>
              } @else {
                <div
                  class="bg-linear-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg p-6"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-medium opacity-90 mb-1">Clearance Status</h3>
                      <p class="text-4xl font-bold">Pending</p>
                      @if (authService.currentUser()!.profile.clearance_date) {
                        <p class="text-xs opacity-80 mt-1">
                          {{ authService.currentUser()!.profile.clearance_date | date: 'MMM d, y' }}
                        </p>
                      }
                    </div>
                    <div class="text-5xl opacity-30">
                      <i class="fas fa-clock"></i>
                    </div>
                  </div>
                </div>
              }
            } @else {
              <div
                class="bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium opacity-90 mb-1">Cleared</h3>
                    <p class="text-4xl font-bold">{{ dashboardStats().cleared }}</p>
                  </div>
                  <div class="text-5xl opacity-30">
                    <i class="fas fa-check-circle"></i>
                  </div>
                </div>
              </div>
            }

            <div
              class="bg-linear-to-br from-indigo-500 to-indigo-600 text-white rounded-lg shadow-lg p-6"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium opacity-90 mb-1">Completion Rate</h3>
                  <p class="text-4xl font-bold">{{ dashboardStats().completionRate }}%</p>
                </div>
                <div class="text-5xl opacity-30">
                  <i class="fas fa-chart-line"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts and Progress -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Status Distribution -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-bold text-gray-800 mb-6">
                Requirements Status Distribution
              </h3>
              <div class="flex items-center justify-center mb-6">
                <div class="relative w-64 h-64">
                  <!-- Donut Chart -->
                  <div
                    class="absolute inset-0 rounded-full"
                    [style.background]="
                      'conic-gradient(' +
                      'from 0deg, ' +
                      'rgb(34, 197, 94) 0deg ' +
                      (dashboardStats().cleared / dashboardStats().totalRequirements) * 360 +
                      'deg, ' +
                      'rgb(234, 179, 8) ' +
                      (dashboardStats().cleared / dashboardStats().totalRequirements) * 360 +
                      'deg ' +
                      ((dashboardStats().cleared + dashboardStats().pending) /
                        dashboardStats().totalRequirements) *
                        360 +
                      'deg, ' +
                      'rgb(239, 68, 68) ' +
                      ((dashboardStats().cleared + dashboardStats().pending) /
                        dashboardStats().totalRequirements) *
                        360 +
                      'deg ' +
                      ((dashboardStats().cleared +
                        dashboardStats().pending +
                        dashboardStats().returned) /
                        dashboardStats().totalRequirements) *
                        360 +
                      'deg, ' +
                      'rgb(156, 163, 175) ' +
                      ((dashboardStats().cleared +
                        dashboardStats().pending +
                        dashboardStats().returned) /
                        dashboardStats().totalRequirements) *
                        360 +
                      'deg 360deg)'
                    "
                  ></div>
                  <!-- Center white circle -->
                  <div
                    class="absolute inset-8 bg-white rounded-full flex items-center justify-center flex-col"
                  >
                    <div class="text-3xl font-bold text-gray-800">
                      {{ dashboardStats().totalRequirements }}
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
                    <span class="font-semibold">{{ dashboardStats().cleared }}</span>
                    <span class="text-gray-600"> Cleared</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-4 h-4 bg-yellow-500 rounded"></div>
                  <div class="text-sm">
                    <span class="font-semibold">{{ dashboardStats().pending }}</span>
                    <span class="text-gray-600"> Pending</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-4 h-4 bg-red-500 rounded"></div>
                  <div class="text-sm">
                    <span class="font-semibold">{{ dashboardStats().returned }}</span>
                    <span class="text-gray-600"> Returned</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-4 h-4 bg-gray-400 rounded"></div>
                  <div class="text-sm">
                    <span class="font-semibold">{{ dashboardStats().notSubmitted }}</span>
                    <span class="text-gray-600"> Not Submitted</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Progress Bars -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-bold text-gray-800 mb-6">Progress Overview</h3>
              <div class="space-y-6">
                <!-- Overall Completion -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-700">Overall Completion</span>
                    <span class="text-sm font-semibold text-green-600">
                      {{ dashboardStats().completionRate }}%
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      class="bg-linear-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500"
                      [style.width.%]="dashboardStats().completionRate"
                    ></div>
                  </div>
                </div>

                <!-- Submitted -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-700">Submitted</span>
                    <span class="text-sm font-semibold text-blue-600">
                      {{ dashboardStats().submitted }} / {{ dashboardStats().totalRequirements }}
                      ({{
                        (
                          (dashboardStats().submitted / dashboardStats().totalRequirements) *
                          100
                        ).toFixed(1)
                      }}%)
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      class="bg-linear-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-500"
                      [style.width.%]="
                        (dashboardStats().submitted / dashboardStats().totalRequirements) * 100
                      "
                    ></div>
                  </div>
                </div>

                <!-- Pending -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-700">Pending Review</span>
                    <span class="text-sm font-semibold text-yellow-600">
                      {{ dashboardStats().pending }}
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      class="bg-linear-to-r from-yellow-400 to-yellow-600 h-full rounded-full transition-all duration-500"
                      [style.width.%]="
                        (dashboardStats().pending / dashboardStats().totalRequirements) * 100
                      "
                    ></div>
                  </div>
                </div>

                <!-- Returned -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-700">Returned for Revision</span>
                    <span class="text-sm font-semibold text-red-600">
                      {{ dashboardStats().returned }}
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      class="bg-linear-to-r from-red-400 to-red-600 h-full rounded-full transition-all duration-500"
                      [style.width.%]="
                        (dashboardStats().returned / dashboardStats().totalRequirements) * 100
                      "
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div
              class="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-green-800 mb-1">Cleared</h3>
                  <p class="text-3xl font-bold text-green-600">{{ dashboardStats().cleared }}</p>
                  <p class="text-xs text-green-700 mt-2">
                    {{
                      (
                        (dashboardStats().cleared / dashboardStats().totalRequirements) *
                        100
                      ).toFixed(1)
                    }}% of total
                  </p>
                </div>
                <div class="text-4xl text-green-300">
                  <i class="fas fa-check-circle"></i>
                </div>
              </div>
            </div>

            <div
              class="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-yellow-800 mb-1">Pending Review</h3>
                  <p class="text-3xl font-bold text-yellow-600">{{ dashboardStats().pending }}</p>
                  <p class="text-xs text-yellow-700 mt-2">
                    {{
                      (
                        (dashboardStats().pending / dashboardStats().totalRequirements) *
                        100
                      ).toFixed(1)
                    }}% of total
                  </p>
                </div>
                <div class="text-4xl text-yellow-300">
                  <i class="fas fa-clock"></i>
                </div>
              </div>
            </div>

            <div
              class="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-red-800 mb-1">Returned</h3>
                  <p class="text-3xl font-bold text-red-600">{{ dashboardStats().returned }}</p>
                  <p class="text-xs text-red-700 mt-2">
                    {{
                      (
                        (dashboardStats().returned / dashboardStats().totalRequirements) *
                        100
                      ).toFixed(1)
                    }}% of total
                  </p>
                </div>
                <div class="text-4xl text-red-300">
                  <i class="fas fa-undo"></i>
                </div>
              </div>
            </div>

            <div
              class="bg-gray-50 border-l-4 border-gray-500 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-gray-800 mb-1">Not Submitted</h3>
                  <p class="text-3xl font-bold text-gray-600">
                    {{ dashboardStats().notSubmitted }}
                  </p>
                  <p class="text-xs text-gray-700 mt-2">
                    {{
                      (
                        (dashboardStats().notSubmitted / dashboardStats().totalRequirements) *
                        100
                      ).toFixed(1)
                    }}% of total
                  </p>
                </div>
                <div class="text-4xl text-gray-300">
                  <i class="fas fa-exclamation-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      @if (activeTab() === 'accomplishments') {
        <app-faculty-requirements />
      }
      @if (activeTab() === 'credentials') {
        <app-faculty-credentials />
      }
    </div>
  `,
  styles: [],
})
export class FacultyDashboard implements OnInit {
  isSidebarOpen = signal(true);
  activeTab = signal<string>('dashboard');
  isUserMenuOpen = signal(false);
  loading = signal(false);

  // Dashboard data
  assignments = signal<Assignment[]>([]);
  academicYearsList = signal<DropdownAcademicYear[]>([]);
  selectedAcademicYear = signal<number>(0);
  selectedSemester = signal<string>('');

  // Statistics
  dashboardStats = signal({
    totalAssignments: 0,
    totalRequirements: 0,
    submitted: 0,
    cleared: 0,
    pending: 0,
    returned: 0,
    notSubmitted: 0,
    completionRate: 0,
  });

  constructor(
    public authService: Auth,
    private requirementService: FacultyRequirementService,
    private dropdownService: DropdownService,
  ) {}

  ngOnInit() {
    this.refreshProfile();
    this.loadAcademicYears();
    this.loadDashboardData();
  }

  refreshProfile() {
    this.authService.getProfile().subscribe({
      error: (error) => {
        console.error('Error refreshing profile:', error);
      }
    });
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

  loadDashboardData() {
    this.loading.set(true);
    this.requirementService
      .getMyAssignments(
        1,
        1000,
        this.selectedAcademicYear() || undefined,
        this.selectedSemester() || undefined,
      )
      .subscribe({
        next: (response) => {
          this.assignments.set(response.assignments);
          this.calculateStats();
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading assignments:', error);
          this.loading.set(false);
        },
      });
  }

  calculateStats() {
    const assignments = this.assignments();
    const totalAssignments = assignments.length;
    const requirementsPerAssignment = 9;
    const totalRequirements = totalAssignments * requirementsPerAssignment;

    let submitted = 0;
    let cleared = 0;
    let pending = 0;
    let returned = 0;

    assignments.forEach((assignment) => {
      const submissions = assignment.requirement_submissions || [];
      submitted += submissions.length;
      cleared += submissions.filter((s) => s.status === 'cleared').length;
      pending += submissions.filter((s) => s.status === 'pending').length;
      returned += submissions.filter((s) => s.status === 'returned').length;
    });

    const notSubmitted = totalRequirements - submitted;
    const completionRate =
      totalRequirements > 0 ? Math.round((cleared / totalRequirements) * 100) : 0;

    this.dashboardStats.set({
      totalAssignments,
      totalRequirements,
      submitted,
      cleared,
      pending,
      returned,
      notSubmitted,
      completionRate,
    });
  }

  filterData() {
    this.loadDashboardData();
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

  getPageTitle(): string {
    switch (this.activeTab()) {
      case 'dashboard':
        return 'Dashboard';
      case 'accomplishments':
        return 'Accomplishments';
      case 'credentials':
        return 'Credentials';
      default:
        return 'Faculty Portal';
    }
  }

  logout() {
    this.authService.logout();
  }
}
