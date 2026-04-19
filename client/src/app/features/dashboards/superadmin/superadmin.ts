import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../services/auth/auth';
import { RouterModule } from '@angular/router';
import { SuperadminAcademicYearManagement } from '../../superadmin/academic-year-management/academic-year-management';
import { SuperadminDeanManagement } from '../../superadmin/dean-management/dean-management';
import { SuperadminFacultyView } from '../../superadmin/faculty-view/faculty-view';
import { SuperadminOrganizationView } from '../../superadmin/organization-view/organization-view';
import { ChangePasswordModal } from '../../../shared/components/change-password-modal/change-password-modal';
import {
  SuperadminDashboardService,
  SuperadminStatistics,
} from '../../../services/superadmin-dashboard.service';

@Component({
  selector: 'app-superadmin-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    SuperadminAcademicYearManagement,
    SuperadminDeanManagement,
    SuperadminFacultyView,
    SuperadminOrganizationView,
    ChangePasswordModal,
  ],
  templateUrl: './superadmin.html',
  styles: [],
})
export class SuperadminDashboard implements OnInit {
  isSidebarOpen = signal(true);
  activeTab = signal<string>('dashboard');
  isUserMenuOpen = signal(false);
  isChangePasswordOpen = signal(false);
  statistics = signal<SuperadminStatistics>({
    total_faculty: 0,
    total_deans: 0,
    total_organizations: 0,
    files_by_status: {
      pending: 0,
      returned: 0,
    },
  });
  loading = signal(false);

  constructor(
    public authService: Auth,
    private dashboardService: SuperadminDashboardService,
  ) {}

  ngOnInit() {
    this.loadDashboardStatistics();
  }

  loadDashboardStatistics() {
    this.loading.set(true);
    this.dashboardService.getDashboardStatistics().subscribe({
      next: (response) => {
        this.statistics.set(response.statistics);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading dashboard statistics:', error);
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
      'college-department': 'College Dean',
      faculty: 'Faculty Management',
      organization: 'Organization Management',
      'academic-year': 'Academic Year Settings',
    };
    return titles[this.activeTab()] || 'Dashboard';
  }
}
