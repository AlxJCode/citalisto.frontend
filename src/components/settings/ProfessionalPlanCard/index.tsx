"use client";

import { Card, Badge, Progress, Skeleton } from "antd";
import {
    WhatsAppOutlined,
    TeamOutlined,
    BankOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useSubscriptionOverview } from "@/features/subscriptions/subscription/hooks/useSubscriptionOverview";

const ProfessionalPlanCard = () => {
    const { overview, loading } = useSubscriptionOverview();

    const isUnlimited = (value: number | null) => value === null;

    const getPercentage = (used: number, total: number | null) => {
        if (isUnlimited(total)) return 0;
        return (used / total!) * 100;
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 80) return "#ff4d4f";
        if (percentage >= 60) return "#faad14";
        return "#52c41a";
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Sin fecha de expiración";
        return dayjs(dateString).format("DD [de] MMMM, YYYY");
    };

    if (loading || !overview) {
        return (
            <Card className="shadow-sm mb-8">
                <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
        );
    }

    const { subscription, usage } = overview;

    return (
        <Card className="shadow-sm mb-8">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-semibold mb-3">{subscription.planDetail.name}</h3>
                    <div className="flex items-center gap-4">
                        <Badge status="success" text={subscription.statusDisplay} />
                        <span className="text-sm text-gray-500 flex items-center gap-1.5">
                            <ClockCircleOutlined />
                            Válido hasta {formatDate(subscription.expiresAt)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-green-300 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-50 p-2.5 rounded-lg">
                            <WhatsAppOutlined className="text-green-600 text-xl" />
                        </div>
                        <span className="font-medium text-gray-700">WhatsApp mensuales</span>
                    </div>
                    <div className="mb-3">
                        <span className="text-3xl font-bold text-gray-900">
                            {usage.whatsappMessagesSent}
                        </span>
                        <span className="text-xl text-gray-400">
                            {isUnlimited(subscription.effectiveLimits.whatsapp)
                                ? " / ∞"
                                : ` / ${subscription.effectiveLimits.whatsapp}`}
                        </span>
                    </div>
                    {!isUnlimited(subscription.effectiveLimits.whatsapp) && (
                        <Progress
                            percent={getPercentage(
                                usage.whatsappMessagesSent,
                                subscription.effectiveLimits.whatsapp
                            )}
                            strokeColor={getProgressColor(
                                getPercentage(
                                    usage.whatsappMessagesSent,
                                    subscription.effectiveLimits.whatsapp
                                )
                            )}
                            showInfo={false}
                        />
                    )}
                    <p className="text-sm text-gray-500 mt-3">
                        {isUnlimited(subscription.effectiveLimits.whatsapp)
                            ? "Mensajes ilimitados"
                            : `${subscription.effectiveLimits.whatsapp! - usage.whatsappMessagesSent} mensajes disponibles`}
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-50 p-2.5 rounded-lg">
                            <TeamOutlined className="text-blue-600 text-xl" />
                        </div>
                        <span className="font-medium text-gray-700">Profesionales</span>
                    </div>
                    <div className="mb-3">
                        <span className="text-3xl font-bold text-gray-900">
                            {usage.professionalsCount}
                        </span>
                        <span className="text-xl text-gray-400">
                            {isUnlimited(subscription.effectiveLimits.professionals)
                                ? " / ∞"
                                : ` / ${subscription.effectiveLimits.professionals}`}
                        </span>
                    </div>
                    {!isUnlimited(subscription.effectiveLimits.professionals) && (
                        <Progress
                            percent={getPercentage(
                                usage.professionalsCount,
                                subscription.effectiveLimits.professionals
                            )}
                            strokeColor={getProgressColor(
                                getPercentage(
                                    usage.professionalsCount,
                                    subscription.effectiveLimits.professionals
                                )
                            )}
                            showInfo={false}
                        />
                    )}
                    <p className="text-sm text-gray-500 mt-3">
                        {isUnlimited(subscription.effectiveLimits.professionals)
                            ? "Profesionales ilimitados"
                            : `${subscription.effectiveLimits.professionals! - usage.professionalsCount} profesionales disponibles`}
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-purple-50 p-2.5 rounded-lg">
                            <BankOutlined className="text-purple-600 text-xl" />
                        </div>
                        <span className="font-medium text-gray-700">Sedes</span>
                    </div>
                    <div className="mb-3">
                        <span className="text-3xl font-bold text-gray-900">
                            {usage.branchesCount}
                        </span>
                        <span className="text-xl text-gray-400">
                            {isUnlimited(subscription.effectiveLimits.branches)
                                ? " / ∞"
                                : ` / ${subscription.effectiveLimits.branches}`}
                        </span>
                    </div>
                    {!isUnlimited(subscription.effectiveLimits.branches) && (
                        <Progress
                            percent={getPercentage(
                                usage.branchesCount,
                                subscription.effectiveLimits.branches
                            )}
                            strokeColor={getProgressColor(
                                getPercentage(
                                    usage.branchesCount,
                                    subscription.effectiveLimits.branches
                                )
                            )}
                            showInfo={false}
                        />
                    )}
                    <p className="text-sm text-gray-500 mt-3">
                        {isUnlimited(subscription.effectiveLimits.branches)
                            ? "Sedes ilimitadas"
                            : `${subscription.effectiveLimits.branches! - usage.branchesCount} ${subscription.effectiveLimits.branches! - usage.branchesCount === 1 ? "sede disponible" : "sedes disponibles"}`}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default ProfessionalPlanCard;
