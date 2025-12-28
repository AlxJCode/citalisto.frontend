import { Card, Progress } from "antd";
import { FC, ReactNode } from "react";
import styles from "./styles.module.css";

interface MetricCardWithProgressProps {
    icon: ReactNode;
    iconBgColor: string;
    iconColor: string;
    value: string | number;
    label: string;
    subtitle?: string;
    progress?: {
        percent: number;
        strokeColor?: string;
        showInfo?: boolean;
        status?: "success" | "exception" | "normal" | "active";
    };
    onClick?: () => void;
}

const MetricCardWithProgress: FC<MetricCardWithProgressProps> = ({
    icon,
    iconBgColor,
    iconColor,
    value,
    label,
    subtitle,
    progress,
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
                        <div className={styles.value}>{value}</div>
                        <div className={styles.label}>{label}</div>
                        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                    </div>
                </div>
                {progress && (
                    <div className={styles.progressContainer}>
                        <Progress
                            percent={progress.percent}
                            strokeColor={progress.strokeColor}
                            showInfo={progress.showInfo ?? false}
                            status={progress.status}
                            size="small"
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default MetricCardWithProgress;
