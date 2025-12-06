// HOC for role-based access control

import { redirect } from "next/navigation";
import { getSession } from "./session";
import { UserRole } from "@/features/users/user/types/user.api";

interface WithRoleOptions {
    allowedRoles: UserRole[];
    redirectTo?: string;
}

/**
 * Require specific roles to access a page
 * Usage in a page component:
 *
 * export default async function AdminPage() {
 *   await withRole({ allowedRoles: ['OWNER', 'SUPERADMIN'] });
 *   return <div>Admin Content</div>;
 * }
 */
export async function withRole(options: WithRoleOptions): Promise<void> {
    const session = await getSession();

    if (!session) {
        redirect(options.redirectTo || "/login");
    }

    if (!options.allowedRoles.includes(session.role)) {
        redirect("/unauthorized");
    }
}
