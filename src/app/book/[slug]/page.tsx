// Public booking page - Dynamic route for each business

import { PublicBookingWidget } from "@/features/appointments/public-booking/components/PublicBookingWidget";

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BookingPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const queryParams = await searchParams;

    return (
        <div className="min-h-screen bg-gray-50">
            <PublicBookingWidget businessSlug={slug} queryParams={queryParams} />
        </div>
    );
}
