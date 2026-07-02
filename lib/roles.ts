export const APP_ROLES = ['advisor', 'admin'] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const ROLE_CAPABILITIES: Record<AppRole, string[]> = {
  advisor: [
    'Register with a valid invite code',
    'Create and run project analyses',
    'View and update only their own projects',
    'Use readiness checklist and proposal guidance',
  ],
  admin: [
    'All advisor capabilities',
    'View every project in the workspace',
    'Update project status and remove projects',
    'Create and revoke invites',
    'Promote or demote advisor accounts',
    'Manage grant discovery and review queues',
  ],
};

export function isAppRole(value: string): value is AppRole {
  return APP_ROLES.includes(value as AppRole);
}
