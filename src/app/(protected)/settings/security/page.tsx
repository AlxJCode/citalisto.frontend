import { Divider } from "antd";
import SettingsLayout from "@/components/layout/SettingsLayout";
import { ChangePasswordCard } from "@/components/settings/ChangePasswordCard";
import { TwoFactorAuthCard } from "@/components/settings/TwoFactorAuthCard";

const SecurityPage = () => {
    return (
        <SettingsLayout>
            <div>
                <h2 className="text-xl font-semibold mb-1">Seguridad</h2>
                <p className="text-gray-500 mb-6">Administra la seguridad de tu cuenta</p>
                <Divider />
                <ChangePasswordCard />
                <TwoFactorAuthCard />
            </div>
        </SettingsLayout>
    );
};

export default SecurityPage;
