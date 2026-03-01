import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../services/auth/auth';
import { RouterModule } from '@angular/router';
import { SuperadminDepartmentManagement } from '../../superadmin/department-management/department-management';
import { SuperadminProgramManagement } from '../../superadmin/program-management/program-management';
import { SuperadminSectionManagement } from '../../superadmin/section-management/section-management';
import { SuperadminAcademicYearManagement } from '../../superadmin/academic-year-management/academic-year-management';
import { SuperadminDeanManagement } from '../../superadmin/dean-management/dean-management';
import { SuperadminFacultyView } from '../../superadmin/faculty-view/faculty-view';

@Component({
  selector: 'app-superadmin-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    SuperadminDepartmentManagement,
    SuperadminProgramManagement,
    SuperadminSectionManagement,
    SuperadminAcademicYearManagement,
    SuperadminDeanManagement,
    SuperadminFacultyView,
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
          <h2 class="text-xl font-bold text-gray-900 text-center">Superadmin Portal</h2>
        </div>

        <ul class="space-y-2 font-medium">
          <!-- Dashboard -->
          <li>
            <button
              (click)="selectTab('dashboard')"
              [class.bg-red-50]="activeTab() === 'dashboard'"
              [class.text-red-600]="activeTab() === 'dashboard'"
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

          <!-- College Department (Deans) -->
          <li>
            <button
              (click)="selectTab('college-department')"
              [class.bg-red-50]="activeTab() === 'college-department'"
              [class.text-red-600]="activeTab() === 'college-department'"
              class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
            >
              <svg class="shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z"
                />
              </svg>
              <span class="flex-1 ms-3 whitespace-nowrap text-left">College Department</span>
            </button>
          </li>

          <!-- Faculty -->
          <li>
            <button
              (click)="selectTab('faculty')"
              [class.bg-red-50]="activeTab() === 'faculty'"
              [class.text-red-600]="activeTab() === 'faculty'"
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
              [class.bg-red-50]="activeTab() === 'organization'"
              [class.text-red-600]="activeTab() === 'organization'"
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

          <li class="pt-2 mt-2 border-t border-gray-200"></li>

          <!-- Settings Section -->
          <li>
            <div class="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">Settings</div>
          </li>

          <!-- Departments -->
          <li>
            <button
              (click)="selectTab('departments')"
              [class.bg-red-50]="activeTab() === 'departments'"
              [class.text-red-600]="activeTab() === 'departments'"
              class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
            >
              <svg class="shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <span class="flex-1 ms-3 whitespace-nowrap text-left">Departments</span>
            </button>
          </li>

          <!-- Programs -->
          <li>
            <button
              (click)="selectTab('programs')"
              [class.bg-red-50]="activeTab() === 'programs'"
              [class.text-red-600]="activeTab() === 'programs'"
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
              <span class="flex-1 ms-3 whitespace-nowrap text-left">Programs</span>
            </button>
          </li>

          <!-- Sections -->
          <li>
            <button
              (click)="selectTab('sections')"
              [class.bg-red-50]="activeTab() === 'sections'"
              [class.text-red-600]="activeTab() === 'sections'"
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

          <!-- Academic Year -->
          <li>
            <button
              (click)="selectTab('academic-year')"
              [class.bg-red-50]="activeTab() === 'academic-year'"
              [class.text-red-600]="activeTab() === 'academic-year'"
              class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
            >
              <svg class="shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span class="flex-1 ms-3 whitespace-nowrap text-left">Academic Year</span>
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
          <span class="font-medium">Super Admin</span>
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
              class="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-b-lg transition"
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
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Welcome, Super Admin!</h1>
            <p class="text-gray-600 mt-1">{{ authService.currentUser()?.email }}</p>
          </div>
          <div class="text-gray-500">Dashboard content will be displayed here</div>
        </div>
      }
      @if (activeTab() === 'college-department') {
        <app-superadmin-dean-management />
      }
      @if (activeTab() === 'faculty') {
        <app-superadmin-faculty-view />
      }
      @if (activeTab() === 'organization') {
        <div class="text-gray-500">Organization management will be displayed here</div>
      }
      @if (activeTab() === 'departments') {
        <app-superadmin-department-management />
      }
      @if (activeTab() === 'programs') {
        <app-superadmin-program-management />
      }
      @if (activeTab() === 'sections') {
        <app-superadmin-section-management />
      }
      @if (activeTab() === 'academic-year') {
        <app-superadmin-academic-year-management />
      }
    </div>
  `,
  styles: [],
})
export class SuperadminDashboard {
  isSidebarOpen = signal(true);
  activeTab = signal<string>('dashboard');
  isUserMenuOpen = signal(false);

  constructor(public authService: Auth) {}

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
      'college-department': 'College Department',
      faculty: 'Faculty Management',
      organization: 'Organization Management',
      departments: 'Department Settings',
      programs: 'Program Settings',
      sections: 'Section Settings',
      'academic-year': 'Academic Year Settings',
    };
    return titles[this.activeTab()] || 'Dashboard';
  }
}
