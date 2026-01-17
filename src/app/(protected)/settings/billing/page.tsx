"use client";

import { Divider } from 'antd';
import SettingsLayout from '@/components/layout/SettingsLayout';
import { BillingContent } from '@/components/settings/BillingContent';

const BillingPage = () => {
    return (
        <SettingsLayout>
            <div>
                <h2 className="text-xl font-semibold mb-1">Facturación</h2>
                <p className="text-gray-500 mb-6">Administra tu suscripción y métodos de pago</p>

                <Divider />

                <BillingContent />
            </div>
        </SettingsLayout>
    );
};

export default BillingPage;
