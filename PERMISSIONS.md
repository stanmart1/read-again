# Frontend Permission Checks

This document lists all permissions that the frontend application checks for.

## Menu/Navigation Permissions

These permissions control visibility of admin menu items:

1. `analytics.view` - Admin Overview/Dashboard
2. `users.view` - Users Management
3. `roles.view` - Roles Management
4. `audit_logs.view` - Audit Log
5. `books.view` - Books & Library Management
6. `reviews.view` - Reviews Management
7. `orders.view` - Orders Management
8. `shipping.view` - Shipping Management
9. `reading.view_analytics` - Reading Analytics
10. `reports.view` - Reports
11. `email_templates.view` - Email Templates Management
12. `blog.view` - Blog Management
13. `works.view` - Works/Portfolio Management
14. `about.view` - About Page Management
15. `contact.view` - Contact Messages Management
16. `faq.view` - FAQ Management
17. `settings.view` - Settings Management

## Role-Based Access

### SuperAdmin Role
- Has access to ALL permissions (bypasses permission checks)
- Role name in backend: `SuperAdmin`

### Admin Role
- Has access to ALL permissions (bypasses permission checks)
- Role name in backend: `Admin`

### Author Role
- Role name in backend: `Author`
- Permissions need to be assigned explicitly

### User Role
- Role name in backend: `User`
- Regular user with no admin permissions

## Permission Check Methods

The frontend uses the following methods from `usePermissions` hook:

- `hasPermission(permissionName)` - Check single permission
- `hasRole(roleName)` - Check user role
- `hasAnyPermission(permissionNames)` - Check if user has any of the permissions
- `hasAllPermissions(permissionNames)` - Check if user has all permissions
- `canAccess(resource, action)` - Check permission in format `resource.action`
- `isAdmin()` - Check if user is Admin or SuperAdmin
- `isSuperAdmin()` - Check if user is SuperAdmin

## Notes

- SuperAdmin and Admin roles automatically have all permissions
- Permission format: `resource.action` (e.g., `users.view`, `books.edit`)
- Permissions are cached in localStorage after first fetch
- Permission endpoint: `/auth/permissions` (needs to be implemented in backend)

## Backend Role Names

Make sure backend returns these exact role names:
- `SuperAdmin` (not `super_admin`)
- `Admin` (not `admin`)
- `Author`
- `User`
