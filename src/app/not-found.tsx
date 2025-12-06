"use client";

import { useRouter } from "next/navigation";
import { Button, Result } from "antd";
import { HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./not-found.module.css";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.animation}>
                    <div className={styles.toothIcon}>
                        <svg
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                            className={styles.toothSvg}
                        >
                            <path
                                d="M50 10 C35 10, 25 20, 25 35 C25 45, 28 55, 30 65 C32 75, 35 90, 40 90 C42 90, 43 85, 45 75 C47 65, 48 60, 50 60 C52 60, 53 65, 55 75 C57 85, 58 90, 60 90 C65 90, 68 75, 70 65 C72 55, 75 45, 75 35 C75 20, 65 10, 50 10 Z"
                                fill="currentColor"
                                className={styles.toothPath}
                            />
                        </svg>
                    </div>
                    <div className={styles.number404}>
                        <span className={styles.numberDigit}>4</span>
                        <span className={`${styles.numberDigit} ${styles.zero}`}>0</span>
                        <span className={styles.numberDigit}>4</span>
                    </div>
                </div>

                <Result
                    status="404"
                    title={<span className={styles.title}>¡Ups! Página no encontrada</span>}
                    subTitle={
                        <span className={styles.subtitle}>
                            Lo sentimos, la página que buscas no existe o ha sido movida.
                        </span>
                    }
                    extra={
                        <div className={styles.buttons}>
                            <Button
                                type="default"
                                size="large"
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.back()}
                            >
                                Volver atrás
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                icon={<HomeOutlined />}
                                onClick={() => router.push("/")}
                            >
                                Ir al inicio
                            </Button>
                        </div>
                    }
                />
            </div>
        </div>
    );
}
