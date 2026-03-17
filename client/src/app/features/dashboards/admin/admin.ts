import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../shared/components/layout.component';
import { DeanManagementComponent } from '../../admin/dean-management/dean-management';
import { FacultyManagement } from '../../admin/faculty-management/faculty-management';
import { OrganizationManagement } from '../../admin/organization-management/organization-management';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    LayoutComponent,
    DeanManagementComponent,
    FacultyManagement,
    OrganizationManagement,
  ],
  template: `
    <app-layout (tabChange)="onTabChange($event)">
      <div class="p-4">
        @if (activeTab() === 'dean') {
          <app-dean-management></app-dean-management>
        } @else if (activeTab() === 'faculty') {
          <app-faculty-management></app-faculty-management>
        } @else if (activeTab() === 'organizations') {
          <app-organization-management></app-organization-management>
        } @else {
          <div>
            <div class="bg-white shadow rounded-lg p-6">
              <p class="text-gray-600">
                Select a tab from the sidebar to manage different sections.
              </p>
              <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  class="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200"
                >
                  <h3 class="font-semibold text-green-900 mb-2">Dean Management</h3>
                  <p class="text-sm text-green-700">Manage dean accounts and assignments</p>
                </div>
                <div
                  class="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200"
                >
                  <h3 class="font-semibold text-purple-900 mb-2">Faculty Management</h3>
                  <p class="text-sm text-purple-700">Manage faculty members</p>
                </div>
                <div
                  class="p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg border border-pink-200"
                >
                  <h3 class="font-semibold text-pink-900 mb-2">Organization Management</h3>
                  <p class="text-sm text-pink-700">Manage student organizations</p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </app-layout>
  `,
})
export class AdminDashboard {
  activeTab = signal<string>('dean');

  onTabChange(tab: string) {
    this.activeTab.set(tab);
  }
}
