import { Card } from "antd";
import { FC, ReactNode } from "react";
import styles from "./styles.module.css";

interface MetricCardProps {
    icon: ReactNode;
    iconBgColor: string;
    iconColor: string;
    value: string | number;
    label: string;
    subtitle?: string;
    valueColor?: string;
    onClick?: () => void;
}

const MetricCard: FC<MetricCardProps> = ({
    icon,
    iconBgColor,
    iconColor,
    value,
    label,
    subtitle,
    valueColor = "#000",
    onClick,
}) => {
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
                        <div className={styles.value} style={{ color: valueColor }}>
                            {value}
                        </div>
                        <div className={styles.label}>{label}</div>
                        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default MetricCard;
