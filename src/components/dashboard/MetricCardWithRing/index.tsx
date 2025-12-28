import { Card, Progress } from "antd";
import { FC, ReactNode } from "react";
import styles from "./styles.module.css";

interface MetricCardWithRingProps {
    icon: ReactNode;
    value: string | number;
    label: string;
    subtitle?: string;
    progress: {
        percent: number;
        strokeColor?: string | { [key: string]: string };
        format?: (percent?: number) => ReactNode;
    };
    onClick?: () => void;
}

const MetricCardWithRing: FC<MetricCardWithRingProps> = ({
    icon,
    value,
    label,
    subtitle,
    progress,
    onClick,
}) => {
    const getStrokeColor = () => {
        if (progress.strokeColor) {
            return progress.strokeColor;
        }

        if (progress.percent >= 80) {
            return "#52c41a";
        }
        if (progress.percent >= 60) {
            return "#faad14";
        }
        return "#ff4d4f";
    };

    return (
        <Card
            hoverable={!!onClick}
            className={styles.card}
            styles={{ body: { padding: 0 } }}
            onClick={onClick}
        >
            <div className={styles.cardBody}>
                <div className={styles.progressWrapper}>
                    <Progress
                        type="circle"
                        percent={progress.percent}
                        strokeColor={getStrokeColor()}
                        size={80}
                        format={progress.format || ((percent) => (
                            <div className={styles.progressContent}>
                                <div className={styles.iconInRing}>{icon}</div>
                                <div className={styles.percentText}>{percent}%</div>
                            </div>
                        ))}
                    />
                </div>
                <div className={styles.textContainer}>
                    <div className={styles.value}>{value}</div>
                    <div className={styles.label}>{label}</div>
                    {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                </div>
            </div>
        </Card>
    );
};

export default MetricCardWithRing;
