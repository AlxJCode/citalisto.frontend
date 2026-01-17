"use client";

import { useEffect, useState } from 'react';
import { Divider } from 'antd';
import { redirect } from 'next/navigation';
import SettingsLayout from '@/components/layout/SettingsLayout';
import { AutoConfirmationCard } from '@/components/settings/AutoConfirmationCard';
import { EmailNotificationsCard } from '@/components/settings/EmailNotificationsCard';
import { WhatsAppNotificationsCard } from '@/components/settings/WhatsAppNotificationsCard';
import { useSession } from '@/providers/SessionProvider';
import { Business } from '@/features/organizations/business/types/business.types';
import { useBusinesses } from '@/features/organizations/business/hooks/useBusinesses';

const NotificationsPage = () => {
    const user = useSession();
    const [business, setBusiness] = useState<Business | null>(null);
    const [changes, setChanges] = useState(false);
    const { fetchBusiness } = useBusinesses();

    useEffect(() => {
        const loadBusiness = async () => {
            if (user?.business) {
                const data = await fetchBusiness(user.business);
                if (data) setBusiness(data);
            }
        };
        loadBusiness();
    }, [changes, user?.business]);

    const handleUpdate = () => setChanges(prev => !prev);

    if (!user?.businessModel) {
        redirect('/settings');
    }

    return (
        <SettingsLayout>
            <div>
                <h2 className="text-xl font-semibold mb-1">Notificaciones</h2>
                <p className="text-gray-500 mb-6">Configura cómo quieres recibir notificaciones</p>

                <Divider />

                <AutoConfirmationCard />
                {business && (
                    <>
                        <EmailNotificationsCard business={business} onUpdate={handleUpdate} />
                        <WhatsAppNotificationsCard business={business} onUpdate={handleUpdate} />
                    </>
                )}
            </div>
        </SettingsLayout>
    );
};

export default NotificationsPage;
