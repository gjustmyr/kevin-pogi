import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../services/auth/auth';
import { LayoutComponent } from '../../../shared/components/layout.component';

@Component({
  selector: 'app-organization-dashboard',
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div
            class="border-2 border-gray-100 border-dashed rounded-lg h-32 md:h-64 bg-gray-50"
          ></div>
          <div
            class="border-2 border-gray-100 border-dashed rounded-lg h-32 md:h-64 bg-gray-50"
          ></div>
          <div
            class="border-2 border-gray-100 border-dashed rounded-lg h-32 md:h-64 bg-gray-50"
          ></div>
        </div>
        <div class="border-2 border-gray-100 border-dashed rounded-lg h-96 mb-4 bg-gray-50"></div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div
            class="border-2 border-gray-100 border-dashed rounded-lg h-48 md:h-72 bg-gray-50"
          ></div>
          <div
            class="border-2 border-gray-100 border-dashed rounded-lg h-48 md:h-72 bg-gray-50"
          ></div>
        </div>
        <div class="border-2 border-gray-100 border-dashed rounded-lg h-96 mb-4 bg-gray-50"></div>
        <div class="grid grid-cols-2 gap-4">
          <div
            class="border-2 border-gray-100 border-dashed rounded-lg h-48 md:h-72 bg-gray-50"
          ></div>
          <div
            class="border-2 border-gray-100 border-dashed rounded-lg h-48 md:h-72 bg-gray-50"
          ></div>
        </div>
      </div>
    </app-layout>
  `,
  styles: [``],
})
export class OrganizationDashboard {
  constructor(public authService: Auth) {}
}
