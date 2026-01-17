import { PublicBookingView } from "@/features/appointments/public-booking/components/PublicBookingView";

interface PageProps {
    params: Promise<{ public_token: string }>;
}

export default async function PublicBookingPage({ params }: PageProps) {
    const { public_token } = await params;
    return (
        <div className="min-h-screen bg-gray-50">
            <PublicBookingView publicToken={public_token} />
        </div>
    );
}
