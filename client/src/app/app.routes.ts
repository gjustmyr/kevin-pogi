import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { SuperadminDashboard } from './features/dashboards/superadmin/superadmin';
import { DeanDashboard } from './features/dashboards/dean/dean';
import { FacultyDashboard } from './features/dashboards/faculty/faculty';
import { OrganizationDashboard } from './features/dashboards/organization/organization';
import { AdminDashboard } from './features/dashboards/admin/admin';
import { FacultyRequirements } from './features/faculty/requirements/requirements';
import { DeanRequirementsMonitoring } from './features/dean/requirements-monitoring/requirements-monitoring';
import { DeanCourseManagement } from './features/dean/course-management/course-management';
import { DeanSectionManagement } from './features/dean/section-management/section-management';
import { DeanProgramManagement } from './features/dean/program-management/program-management';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'superadmin/dashboard',
    component: SuperadminDashboard,
    canActivate: [authGuard, roleGuard(['superadmin'])],
  },
  {
    path: 'dean/dashboard',
    component: DeanDashboard,
    canActivate: [authGuard, roleGuard(['dean'])],
  },
  {
    path: 'dean/courses',
    component: DeanCourseManagement,
    canActivate: [authGuard, roleGuard(['dean'])],
  },
  {
    path: 'dean/sections',
    component: DeanSectionManagement,
    canActivate: [authGuard, roleGuard(['dean'])],
  },
  {
    path: 'dean/programs',
    component: DeanProgramManagement,
    canActivate: [authGuard, roleGuard(['dean'])],
  },
  {
    path: 'dean/requirements-monitoring',
    component: DeanRequirementsMonitoring,
    canActivate: [authGuard, roleGuard(['dean'])],
  },
  {
    path: 'faculty/dashboard',
    component: FacultyDashboard,
    canActivate: [authGuard, roleGuard(['faculty'])],
  },
  {
    path: 'faculty/requirements',
    component: FacultyRequirements,
    canActivate: [authGuard, roleGuard(['faculty'])],
  },
  {
    path: 'organization/dashboard',
    component: OrganizationDashboard,
    canActivate: [authGuard, roleGuard(['organization'])],
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboard,
    canActivate: [authGuard, roleGuard(['admin'])],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
