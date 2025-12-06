"use client";

import { useState, useMemo } from "react";
import { Card, Segmented, Space, Empty, Pagination, Spin, Skeleton } from "antd";
import dayjs from "dayjs";
import { ProfessionalAvailabilityException } from "@/features/schedules/availability-exception/types/professional-availability-exception.types";
import { ExceptionItem } from "./ExceptionItem";

interface ExceptionsListProps {
    exceptions: ProfessionalAvailabilityException[];
    loading: boolean;
    count: number;
    page: number;
    onDelete: (id: number) => void;
    onPageChange: (page: number) => void;
}

export const ExceptionsList = ({ exceptions, loading, count, page, onDelete, onPageChange }: ExceptionsListProps) => {
    const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");

    const sortedExceptions = useMemo(() => {
        const today = dayjs().startOf("day");

        const filtered = exceptions.filter((exception) => {
            const exceptionDate = dayjs(exception.date).startOf("day");
            return filter === "upcoming"
                ? exceptionDate.isAfter(today) || exceptionDate.isSame(today)
                : exceptionDate.isBefore(today);
        });

        return filtered.sort((a, b) => {
            const dateA = dayjs(a.date);
            const dateB = dayjs(b.date);
            return filter === "upcoming" ? dateA.diff(dateB) : dateB.diff(dateA);
        });
    }, [exceptions, filter]);

    return (
        <Card
            title="Excepciones Configuradas"
            extra={
                <Segmented
                    options={[
                        { label: "Próximas", value: "upcoming" },
                        { label: "Pasadas", value: "past" },
                    ]}
                    value={filter}
                    onChange={(value) => setFilter(value as "upcoming" | "past")}
                />
            }
        >
            {sortedExceptions.length === 0 ? (
                <Empty description="No hay excepciones" />
            ) : (
                loading ?(
                    <Skeleton active/>
                ): (
                    <>
                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                            {sortedExceptions.map((exception) => (
                                <ExceptionItem
                                    key={exception.id}
                                    exception={exception}
                                    loading={loading}
                                    onDelete={onDelete}
                                />
                            ))}
                        </Space>
                        {count > 10 && (
                            <div style={{ marginTop: 16, textAlign: "center" }}>
                                <Pagination
                                    current={page}
                                    total={count}
                                    pageSize={10}
                                    size="small"
                                    onChange={onPageChange}
                                    showSizeChanger={false}
                                    showTotal={(total) => `Total: ${total}`}
                                />
                            </div>
                        )}
                    </>
                )
            )}
        </Card>
    );
};
