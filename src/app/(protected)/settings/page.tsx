import SettingsLayout from "@/components/layout/SettingsLayout";
import ProfessionalPlanCard from "@/components/settings/ProfessionalPlanCard";
import AddOnsCard from "@/components/settings/AddOnsCard";
import LanguageRegionCard from "@/components/settings/LanguageRegionCard";

const SettingsPage = () => {
    return (
        <SettingsLayout>
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Configuración</h2>
                    <p className="text-gray-600">Gestiona tu plan y preferencias</p>
                </div>
                <div className="flex flex-col gap-4">
                    <ProfessionalPlanCard />
                    <AddOnsCard />
                    <LanguageRegionCard />
                </div>
            </div>
        </SettingsLayout>
    );
};

export default SettingsPage;
