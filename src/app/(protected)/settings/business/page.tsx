import { Divider } from "antd";
import SettingsLayout from "@/components/layout/SettingsLayout";
import { BusinessForm } from "@/components/settings/BusinessForm";
import { requireAuth } from "@/lib/auth/session";
import { redirect } from "next/navigation";

const BusinessPage = async () => {
    const user = await requireAuth();

    if (!user.businessModel) {
        redirect("/settings");
    }

    return (
        <SettingsLayout>
            <div>
                <h2 className="text-xl font-semibold mb-1">Mi Negocio</h2>
                <p className="text-gray-500 mb-6">Configura la información de tu negocio</p>
                <Divider />
                <BusinessForm business={user.businessModel} />
            </div>
        </SettingsLayout>
    );
};

export default BusinessPage;
