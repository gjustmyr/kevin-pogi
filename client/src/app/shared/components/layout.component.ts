import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Sidebar Toggle Button (Mobile) -->
    <button
      (click)="toggleSidebar()"
      type="button"
      class="text-gray-900 bg-transparent border border-transparent hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg ms-3 mt-3 text-sm p-2 focus:outline-none inline-flex sm:hidden"
    >
      <span class="sr-only">Open sidebar</span>
      <svg
        class="w-6 h-6"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="2"
          d="M5 7h14M5 12h14M5 17h10"
        />
      </svg>
    </button>

    <!-- Sidebar -->
    <aside
      [class.translate-x-0]="isSidebarOpen()"
      [class.-translate-x-full]="!isSidebarOpen()"
      class="fixed top-0 left-0 z-40 w-64 h-full transition-transform sm:translate-x-0 bg-white border-r border-gray-200"
      aria-label="Sidebar"
    >
      <div class="h-full px-3 py-4 overflow-y-auto">
        <!-- Logo/Brand -->
        <div class="mb-6 px-2 flex flex-col items-center">
          <img src="/assets/logo.png" alt="Logo" class="h-24 mb-3" />
          @if (authService.currentUser()?.role === 'admin') {
            <h2 class="text-xl font-bold text-gray-900 text-center">Admin Portal</h2>
          } @else {
            <h2 class="text-lg font-semibold text-gray-900">Commission System</h2>
            <p class="text-xs text-gray-600">{{ authService.currentUser()?.role | titlecase }}</p>
          }
        </div>

        @if (authService.currentUser()?.role === 'admin') {
          <ul class="space-y-2 font-medium">
            <li>
              <button
                (click)="selectTab('dean')"
                [class.bg-green-50]="activeTab() === 'dean'"
                [class.text-green-600]="activeTab() === 'dean'"
                class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
              >
                <svg
                  class="shrink-0 w-5 h-5 transition duration-75"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="2"
                    d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                  />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap text-left">Dean</span>
              </button>
            </li>

            <li>
              <button
                (click)="selectTab('faculty')"
                [class.bg-green-50]="activeTab() === 'faculty'"
                [class.text-green-600]="activeTab() === 'faculty'"
                class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
              >
                <svg
                  class="shrink-0 w-5 h-5 transition duration-75"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="2"
                    d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap text-left">Faculty</span>
              </button>
            </li>

            <li>
              <button
                (click)="selectTab('organizations')"
                [class.bg-green-50]="activeTab() === 'organizations'"
                [class.text-green-600]="activeTab() === 'organizations'"
                class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
              >
                <svg
                  class="shrink-0 w-5 h-5 transition duration-75"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z"
                  />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap text-left">Organizations</span>
              </button>
            </li>

            <li class="pt-4 mt-4 border-t border-gray-200"></li>

            <li>
              <button
                (click)="selectTab('departments')"
                [class.bg-green-50]="activeTab() === 'departments'"
                [class.text-green-600]="activeTab() === 'departments'"
                class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
              >
                <svg
                  class="shrink-0 w-5 h-5 transition duration-75"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z"
                  />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap text-left">Departments</span>
              </button>
            </li>

            <li>
              <button
                (click)="selectTab('programs')"
                [class.bg-green-50]="activeTab() === 'programs'"
                [class.text-green-600]="activeTab() === 'programs'"
                class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
              >
                <svg
                  class="shrink-0 w-5 h-5 transition duration-75"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"
                  />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap text-left">Programs</span>
              </button>
            </li>

            <li>
              <button
                (click)="selectTab('sections')"
                [class.bg-green-50]="activeTab() === 'sections'"
                [class.text-green-600]="activeTab() === 'sections'"
                class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
              >
                <svg
                  class="shrink-0 w-5 h-5 transition duration-75"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
                  />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap text-left">Sections</span>
              </button>
            </li>

            <li class="pt-4 mt-4 border-t border-gray-200"></li>

            <!-- Admin Dropdown -->
            <li class="relative">
              <button
                (click)="toggleDropdown()"
                class="flex items-center justify-between w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
              >
                <div class="flex items-center">
                  <svg
                    class="shrink-0 w-5 h-5 transition duration-75"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  <span class="flex-1 ms-3 whitespace-nowrap text-left">
                    {{ authService.currentUser()?.profile?.first_name }}
                    {{ authService.currentUser()?.profile?.last_name }}
                  </span>
                </div>
                <svg
                  class="w-4 h-4 transition-transform"
                  [class.rotate-180]="isDropdownOpen()"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              @if (isDropdownOpen()) {
                <div
                  class="absolute bottom-full left-0 w-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg"
                >
                  <a
                    href="#"
                    class="flex items-center px-2 py-1.5 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  >
                    <svg
                      class="shrink-0 w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                    <span class="whitespace-nowrap">Profile</span>
                  </a>
                  <button
                    (click)="logout()"
                    class="flex items-center w-full px-2 py-1.5 text-gray-700 hover:bg-gray-100 rounded-b-lg"
                  >
                    <svg
                      class="shrink-0 w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
                    <span class="whitespace-nowrap">Sign Out</span>
                  </button>
                </div>
              }
            </li>
          </ul>
        } @else {
          <ul class="space-y-2 font-medium">
            <li>
              <a
                [routerLink]="['/' + authService.currentUser()?.role + '/dashboard']"
                routerLinkActive="bg-green-50 text-green-600"
                class="flex items-center px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
              >
                <svg
                  class="w-5 h-5 transition duration-75"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"
                  />
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"
                  />
                </svg>
                <span class="ms-3">Dashboard</span>
              </a>
            </li>

            @if (authService.currentUser()?.role === 'faculty') {
              <li>
                <a
                  routerLink="/faculty/requirements"
                  routerLinkActive="bg-green-50 text-green-600"
                  class="flex items-center px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
                >
                  <svg
                    class="shrink-0 w-5 h-5 transition duration-75"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 3v4a1 1 0 0 1-1 1H5m8-2h3m-3 3h3m-4 3v6m4-3H8M19 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                    />
                  </svg>
                  <span class="flex-1 ms-3 whitespace-nowrap">Accomplishments</span>
                </a>
              </li>
            }

            @if (authService.currentUser()?.role === 'superadmin') {
              <li>
                <a
                  href="#"
                  class="flex items-center px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
                >
                  <svg
                    class="shrink-0 w-5 h-5 transition duration-75"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-width="2"
                      d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  <span class="flex-1 ms-3 whitespace-nowrap">Users</span>
                </a>
              </li>
            }

            <li>
              <a
                href="#"
                class="flex items-center px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
              >
                <svg
                  class="shrink-0 w-5 h-5 transition duration-75"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 5v14M9 5v14M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                  />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Projects</span>
              </a>
            </li>

            <li>
              <a
                href="#"
                class="flex items-center px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
              >
                <svg
                  class="shrink-0 w-5 h-5 transition duration-75"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"
                  />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Documents</span>
              </a>
            </li>

            <li class="pt-4 mt-4 border-t border-gray-200">
              <button
                (click)="logout()"
                class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 group"
              >
                <svg
                  class="shrink-0 w-5 h-5 transition duration-75"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                  />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap text-left">Sign Out</span>
              </button>
            </li>
          </ul>
        }
      </div>
    </aside>

    <!-- Main Content -->
    <div class="p-4 sm:ml-64">
      <ng-content></ng-content>
    </div>
  `,
  styles: [],
})
export class LayoutComponent {
  isSidebarOpen = signal(false);
  activeTab = signal<string>('dean');
  isDropdownOpen = signal(false);

  @Output() tabChange = new EventEmitter<string>();

  constructor(public authService: Auth) {}

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  selectTab(tab: string) {
    this.activeTab.set(tab);
    this.tabChange.emit(tab);
  }

  logout() {
    this.authService.logout();
  }
}
