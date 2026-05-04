import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dean-member-demographics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dean-member-demographics.html',
})
export class DeanMemberDemographicsComponent implements OnInit {
  loading = signal(false);
  selectedOrganization = signal<number | undefined>(undefined);
  selectedAcademicYear = signal<number | undefined>(undefined);
  selectedSemester = signal<string | undefined>(undefined);
  activeOnly = signal(true);

  organizations = signal<any[]>([]);
  academicYears = signal<any[]>([]);

  demographics = signal<any>({
    maleCount: 0,
    femaleCount: 0,
    malePercentage: 0,
    femalePercentage: 0,
    byProgram: [],
    totalMembers: 0,
  });

  stats = signal<any>({
    totalMembers: 0,
    activeMembers: 0,
    membersByYearLevel: [],
  });

  ngOnInit() {
    // Load organizations and academic years
    // TODO: Implement API calls
  }

  loadDemographics() {
    if (!this.selectedOrganization()) {
      return;
    }

    this.loading.set(true);
    // TODO: Implement API call to fetch demographics
    this.loading.set(false);
  }

  getProgramColor(index: number): string {
    const colors = [
      '#8b5cf6',
      '#3b82f6',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#ec4899',
      '#06b6d4',
      '#84cc16',
      '#f97316',
      '#6366f1',
    ];
    return colors[index % colors.length];
  }

  getAccumulatedOffset(index: number): number {
    if (!this.demographics().byProgram || index === 0) return 0;

    let offset = 0;
    for (let i = 0; i < index; i++) {
      const program = this.demographics().byProgram[i];
      const percentage = (program.count / this.stats().totalMembers) * 100;
      offset += (percentage / 100) * 502.65;
    }
    return offset;
  }
}
