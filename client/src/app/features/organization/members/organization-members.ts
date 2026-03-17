import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  OrganizationService,
  OrganizationMember,
  PositionTemplate,
} from '../../../services/organization.service';
import {
  AcademicYearService,
  AcademicYearsResponse,
} from '../../../services/academic-year.service';
@Component({
  selector: 'app-organization-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organization-members.html',
})
export class OrganizationMembersComponent implements OnInit {
  private organizationService = inject(OrganizationService);
  private academicYearService = inject(AcademicYearService);

  // Expose Math for template
  Math = Math;

  // State
  members = signal<OrganizationMember[]>([]);
  positions = signal<PositionTemplate[]>([]);
  academicYears = signal<any[]>([]);
  hierarchy = signal<OrganizationMember[]>([]);

  // Pagination
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  itemsPerPage = 20;

  // Filters
  searchQuery = signal('');
  selectedAcademicYear = signal<number | undefined>(undefined);
  selectedPosition = signal<string | undefined>(undefined);
  showActiveOnly = signal(true);

  // View mode
  viewMode = signal<'list' | 'hierarchy'>('list');

  // Modals
  showAddModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  selectedMember = signal<OrganizationMember | null>(null);

  // Form data
  memberForm = signal({
    sr_code: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    year_level: '1st Year' as '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | '5th Year',
    position: '',
    parent_member_id: undefined as number | undefined,
    academic_year_id: undefined as number | undefined,
    term_start_date: '',
    term_end_date: '',
    is_active: true,
  });

  // Auto-populate search
  autoPopulateSearch = signal('');
  autoPopulateFound = signal(false);

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit() {
    this.loadMembers();
    this.loadPositionTemplates();
    this.loadAcademicYears();
  }

  loadMembers() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.organizationService
      .getMembers(
        this.currentPage(),
        this.itemsPerPage,
        this.searchQuery(),
        this.selectedAcademicYear(),
        this.selectedPosition(),
        this.showActiveOnly() ? true : undefined,
      )
      .subscribe({
        next: (response) => {
          this.members.set(response.members);
          this.totalPages.set(response.totalPages);
          this.totalItems.set(response.totalItems);
          this.loading.set(false);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Failed to load members');
          this.loading.set(false);
        },
      });
  }

  loadHierarchy() {
    this.loading.set(true);

    this.organizationService.getHierarchy(this.selectedAcademicYear()).subscribe({
      next: (response) => {
        this.hierarchy.set(response.hierarchy);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Failed to load hierarchy');
        this.loading.set(false);
      },
    });
  }

  loadPositionTemplates() {
    this.organizationService.getPositionTemplates().subscribe({
      next: (response) => {
        this.positions.set(response.positions);
      },
      error: (error) => {
        console.error('Failed to load positions:', error);
      },
    });
  }

  loadAcademicYears() {
    this.academicYearService.getAcademicYears().subscribe({
      next: (response: AcademicYearsResponse) => {
        this.academicYears.set(response.academicYears);
      },
      error: (error: any) => {
        console.error('Failed to load academic years:', error);
      },
    });
  }

  toggleViewMode(mode: 'list' | 'hierarchy') {
    this.viewMode.set(mode);
    if (mode === 'hierarchy') {
      this.loadHierarchy();
    }
  }

  searchMemberHistory() {
    const search = this.autoPopulateSearch().trim();
    if (!search) return;

    // Check if it's an SR Code (alphanumeric) or name
    const isSrCode = /^[A-Za-z0-9-]+$/.test(search);

    this.organizationService
      .searchMemberHistory(isSrCode ? search : undefined, !isSrCode ? search : undefined)
      .subscribe({
        next: (response) => {
          const member = response.member;
          this.memberForm.set({
            ...this.memberForm(),
            sr_code: member.sr_code,
            first_name: member.first_name,
            middle_name: member.middle_name || '',
            last_name: member.last_name,
            email: member.email || '',
            contact_number: member.contact_number || '',
          });
          this.autoPopulateFound.set(true);
          this.successMessage.set('Member details auto-populated!');
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (error) => {
          this.autoPopulateFound.set(false);
          this.errorMessage.set('No previous record found for this student');
          setTimeout(() => this.errorMessage.set(''), 3000);
        },
      });
  }

  openAddModal() {
    this.resetForm();
    this.showAddModal.set(true);
  }

  openEditModal(member: OrganizationMember) {
    this.selectedMember.set(member);
    this.memberForm.set({
      sr_code: member.sr_code,
      first_name: member.first_name,
      middle_name: member.middle_name || '',
      last_name: member.last_name,
      email: member.email || '',
      contact_number: member.contact_number || '',
      year_level: member.year_level,
      position: member.position,
      parent_member_id: member.parent_member_id,
      academic_year_id: member.academic_year_id,
      term_start_date: member.term_start_date,
      term_end_date: member.term_end_date || '',
      is_active: member.is_active,
    });
    this.showEditModal.set(true);
  }

  openDeleteModal(member: OrganizationMember) {
    this.selectedMember.set(member);
    this.showDeleteModal.set(true);
  }

  closeModals() {
    this.showAddModal.set(false);
    this.showEditModal.set(false);
    this.showDeleteModal.set(false);
    this.selectedMember.set(null);
    this.resetForm();
  }

  resetForm() {
    this.memberForm.set({
      sr_code: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      contact_number: '',
      year_level: '1st Year',
      position: '',
      parent_member_id: undefined,
      academic_year_id: undefined,
      term_start_date: '',
      term_end_date: '',
      is_active: true,
    });
    this.autoPopulateSearch.set('');
    this.autoPopulateFound.set(false);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  saveMember() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.organizationService.createMember(this.memberForm()).subscribe({
      next: (response) => {
        this.successMessage.set(response.message);
        this.closeModals();
        this.loadMembers();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Failed to add member');
        this.loading.set(false);
      },
    });
  }

  updateMember() {
    const memberId = this.selectedMember()?.member_id;
    if (!memberId) return;

    this.loading.set(true);
    this.errorMessage.set('');

    this.organizationService.updateMember(memberId, this.memberForm()).subscribe({
      next: (response) => {
        this.successMessage.set(response.message);
        this.closeModals();
        this.loadMembers();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Failed to update member');
        this.loading.set(false);
      },
    });
  }

  deleteMember() {
    const memberId = this.selectedMember()?.member_id;
    if (!memberId) return;

    this.loading.set(true);
    this.errorMessage.set('');

    this.organizationService.deleteMember(memberId).subscribe({
      next: (response) => {
        this.successMessage.set(response.message);
        this.closeModals();
        this.loadMembers();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Failed to delete member');
        this.loading.set(false);
      },
    });
  }

  applyFilters() {
    this.currentPage.set(1);
    if (this.viewMode() === 'list') {
      this.loadMembers();
    } else {
      this.loadHierarchy();
    }
  }

  changePage(page: number) {
    this.currentPage.set(page);
    this.loadMembers();
  }

  getMemberFullName(member: OrganizationMember): string {
    const middle = member.middle_name ? ` ${member.middle_name} ` : ' ';
    return `${member.first_name}${middle}${member.last_name}`;
  }

  getPotentialSupervisors(): OrganizationMember[] {
    return this.members().filter(
      (m) =>
        m.is_active && (!this.selectedMember() || m.member_id !== this.selectedMember()?.member_id),
    );
  }
}
