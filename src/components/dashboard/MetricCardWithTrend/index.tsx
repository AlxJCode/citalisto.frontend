import { Card } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { FC, ReactNode } from "react";
import styles from "./styles.module.css";

interface MetricCardWithTrendProps {
    icon: ReactNode;
    iconBgColor: string;
    iconColor: string;
    value: string | number;
    label: string;
    subtitle?: string;
    trend?: {
        value: number;
        direction: "up" | "down";
        label?: string;
    };
    onClick?: () => void;
}

const MetricCardWithTrend: FC<MetricCardWithTrendProps> = ({
    icon,
    iconBgColor,
    iconColor,
    value,
    label,
    subtitle,
    trend,
    onClick,
}) => {
    const getTrendColor = () => {
        if (!trend) return undefined;
        return trend.direction === "up" ? "#52c41a" : "#ff4d4f";
    };

    const TrendIcon = trend?.direction === "up" ? ArrowUpOutlined : ArrowDownOutlined;

    return (
        <Card
            hoverable={!!onClick}
            className={styles.card}
            styles={{ body: { padding: 0 } }}
            onClick={onClick}
        >
            <div className={styles.cardBody}>
                <div className={styles.content}>
                    <div
                        className={styles.iconContainer}
                        style={{ backgroundColor: iconBgColor }}
                    >
                        <div className={styles.icon} style={{ color: iconColor }}>
                            {icon}
                        </div>
                    </div>
                    <div className={styles.textContainer}>
                        <div className={styles.valueRow}>
                            <div className={styles.value}>{value}</div>
                            {trend && (
                                <div
                                    className={styles.trend}
                                    style={{ color: getTrendColor() }}
                                >
                                    <TrendIcon className={styles.trendIcon} />
                                    <span className={styles.trendValue}>
                                        {Math.abs(trend.value)}%
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className={styles.label}>{label}</div>
                        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                        {trend?.label && (
                            <div className={styles.trendLabel}>{trend.label}</div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default MetricCardWithTrend;
