import { Divider } from "antd";
import SettingsLayout from "@/components/layout/SettingsLayout";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { requireAuth } from "@/lib/auth/session";

const ProfilePage = async () => {
    const user = await requireAuth();

    return (
        <SettingsLayout>
            <div>
                <h2 className="text-xl font-semibold mb-1">Mi Perfil</h2>
                <p className="text-gray-500 mb-6">Administra tu información personal</p>
                <Divider />
                <ProfileForm user={user} />
            </div>
        </SettingsLayout>
    );
};

export default ProfilePage;
