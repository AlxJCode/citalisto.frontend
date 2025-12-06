"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";

interface GlobalLoaderProps {
    isVisible: boolean;
    text?: string;
}

export const GlobalLoader = ({ isVisible, text = "Cargando..." }: GlobalLoaderProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !isVisible) return null;

    const loaderContent = (
        <div className={`${styles.overlay} ${isVisible ? styles.visible : ""}`}>
            <div className={styles.content}>
                <div className={styles.spinnerContainer}>
                    <svg className={styles.spinner} viewBox="0 0 100 100">
                        <circle
                            className={styles.circle}
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className={styles.logo}>
                        <span className={styles.logoText}>C</span>
                    </div>
                </div>
                {text && <p className={styles.text}>{text}</p>}
            </div>
        </div>
    );

    return createPortal(loaderContent, document.body);
};
