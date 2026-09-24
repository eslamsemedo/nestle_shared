import type { Permission } from './generated/permissions.js';

export interface HasPermissions {
  permissions: readonly string[];
}

export function can(user: HasPermissions | null | undefined, permission: Permission): boolean {
  return !!user && user.permissions.includes(permission);
}

export function canAny(user: HasPermissions | null | undefined, permissions: readonly Permission[]): boolean {
  return permissions.some((p) => can(user, p));
}

export function canAll(user: HasPermissions | null | undefined, permissions: readonly Permission[]): boolean {
  return permissions.every((p) => can(user, p));
}
