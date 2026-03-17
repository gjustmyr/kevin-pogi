import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth/auth';
import { OrganizationService } from '../../../services/organization.service';
import { OrganizationMembersComponent } from '../../organization/members/organization-members';
import { OrganizationDocumentsComponent } from '../../organization/documents/organization-documents';

interface OrganizationStats {
  totalMembers: number;
  activeMembers: number;
  documentsSubmitted: number;
  documentsPending: number;
  documentsApproved: number;
  documentsRejected: number;
  membersByPosition: { position: string; count: number }[];
  membersByYearLevel: { year: string; count: number }[];
}

@Component({
  selector: 'app-organization-dashboard',
  standalone: true,
  imports: [CommonModule, OrganizationMembersComponent, OrganizationDocumentsComponent],
  templateUrl: './organization.html',
})
export class OrganizationDashboard implements OnInit {
  authService = inject(Auth);
  private router = inject(Router);
  private organizationService = inject(OrganizationService);

  activeTab = signal<'dashboard' | 'members' | 'documents' | 'advisers'>('dashboard');
  isSidebarOpen = signal(true);
  isUserMenuOpen = signal(false);

  organizationName = signal('');
  advisers = signal<any[]>([]);
  stats = signal<OrganizationStats>({
    totalMembers: 0,
    activeMembers: 0,
    documentsSubmitted: 0,
    documentsPending: 0,
    documentsApproved: 0,
    documentsRejected: 0,
    membersByPosition: [],
    membersByYearLevel: [],
  });
  loading = signal(false);

  ngOnInit() {
    const userInfo = this.authService.currentUser();
    if (userInfo && userInfo.profile && userInfo.profile.organization_name) {
      this.organizationName.set(userInfo.profile.organization_name);
    }
    this.loadAdvisers();
    this.loadStatistics();
  }

  selectTab(tab: 'dashboard' | 'members' | 'documents' | 'advisers') {
    this.activeTab.set(tab);
    if (tab === 'advisers') {
      this.loadAdvisers();
    } else if (tab === 'dashboard') {
      this.loadStatistics();
    }
  }

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }

  toggleUserMenu() {
    this.isUserMenuOpen.set(!this.isUserMenuOpen());
  }

  getPageTitle(): string {
    switch (this.activeTab()) {
      case 'dashboard':
        return 'Dashboard';
      case 'members':
        return 'Members Management';
      case 'documents':
        return 'Document Submission';
      case 'advisers':
        return 'Organization Advisers';
      default:
        return 'Organization Portal';
    }
  }

  loadAdvisers() {
    this.organizationService.getAdvisers().subscribe({
      next: (response) => {
        this.advisers.set(response.advisers);
      },
      error: (error) => {
        console.error('Failed to load advisers:', error);
      },
    });
  }

  loadStatistics() {
    this.loading.set(true);
    // Load members and documents to calculate statistics
    this.organizationService.getMembers(1, 999).subscribe({
      next: (response) => {
        const members = response.members;
        const activeMembers = members.filter((m: any) => m.is_active);

        // Count by position
        const positionCounts: { [key: string]: number } = {};
        members.forEach((m: any) => {
          positionCounts[m.position] = (positionCounts[m.position] || 0) + 1;
        });

        // Count by year level
        const yearCounts: { [key: string]: number } = {};
        members.forEach((m: any) => {
          yearCounts[m.year_level] = (yearCounts[m.year_level] || 0) + 1;
        });

        this.stats.update((s) => ({
          ...s,
          totalMembers: members.length,
          activeMembers: activeMembers.length,
          membersByPosition: Object.entries(positionCounts).map(([position, count]) => ({
            position,
            count,
          })),
          membersByYearLevel: Object.entries(yearCounts).map(([year, count]) => ({
            year,
            count,
          })),
        }));
      },
      error: (error) => {
        console.error('Failed to load members:', error);
      },
    });

    this.organizationService.getDocuments(1, 999).subscribe({
      next: (response) => {
        const documents = response.documents;
        this.stats.update((s) => ({
          ...s,
          documentsSubmitted: documents.length,
          documentsPending: documents.filter((d: any) => d.status === 'pending').length,
          documentsApproved: documents.filter((d: any) => d.status === 'approved').length,
          documentsRejected: documents.filter((d: any) => d.status === 'rejected').length,
        }));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load documents:', error);
        this.loading.set(false);
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getAdviserFullName(adviser: any): string {
    const faculty = adviser.Faculty;
    if (!faculty) return 'N/A';
    const middle = faculty.middle_name ? ` ${faculty.middle_name} ` : ' ';
    return `${faculty.first_name}${middle}${faculty.last_name}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
