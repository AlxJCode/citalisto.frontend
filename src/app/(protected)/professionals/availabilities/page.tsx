"use client";

import { useState, useEffect } from "react";
import { Space, Row, Col, Empty, message } from "antd";
import { PageContainer } from "@/components/layout/PageContainer";
import { AvailabilityGuide } from "@/features/schedules/weekly-availability/components/AvailabilityGuide";
import { ProfessionalSelector } from "@/features/schedules/weekly-availability/components/ProfessionalSelector";
import { WeeklyScheduleEditor } from "@/features/schedules/weekly-availability/components/WeeklyScheduleEditor";
import { AvailabilityCalendar } from "@/features/schedules/weekly-availability/components/AvailabilityCalendar";
import { ExceptionsList } from "@/features/schedules/weekly-availability/components/ExceptionsList";
import { useAvailabilityExceptions } from "@/features/schedules/availability-exception/hooks/useAvailabilityExceptions";
import { Professional } from "@/features/professionals/professional/types/professional.types";

const ProfessionalsAvailabilitiesPage = () => {
    const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | undefined>();
    const [selectedProfessional, setSelectedProfessional] = useState<Professional | undefined>();
    const [page, setPage] = useState(1);
    const [changes, setChanges] = useState(false);
    const { availabilityExceptions, loading, count, fetchAvailabilityExceptions, deleteAvailabilityException } = useAvailabilityExceptions();

    useEffect(() => {
        if (selectedProfessionalId) {
            fetchAvailabilityExceptions({ professional: selectedProfessionalId, page, is_active: true });
        }
    }, [selectedProfessionalId, page, changes, fetchAvailabilityExceptions]);

    const handleProfessionalChange = (professionalId: number | undefined, professional?: Professional) => {
        setSelectedProfessionalId(professionalId);
        setSelectedProfessional(professional);
        setPage(1);
    };

    const handleDeleteException = async (id: number) => {
        const success = await deleteAvailabilityException(id);
        if (success) {
            message.success("Excepción eliminada");
            setChanges((prev) => !prev);
        }
    };

    const handleExceptionCreated = () => {
        setPage(1);
        setChanges((prev) => !prev);
    };

    return (
        <PageContainer
            title="Gestionar Disponibilidad"
            description="Configura los horarios y excepciones de disponibilidad de tus profesionales"
            actions={<AvailabilityGuide />}
        >
            <Space orientation="vertical" style={{ width: "100%" }} size="small">
                <ProfessionalSelector
                    value={selectedProfessionalId}
                    onChange={handleProfessionalChange}
                />

                {selectedProfessionalId ? (
                    <Space orientation="vertical" style={{ width: "100%" }} size="small">
                        <WeeklyScheduleEditor professionalId={selectedProfessionalId} />

                        <Row gutter={16}>
                            <Col xs={24} lg={12}>
                                <AvailabilityCalendar
                                    professionalId={selectedProfessionalId}
                                    exceptions={availabilityExceptions}
                                    onExceptionCreated={handleExceptionCreated}
                                />
                            </Col>

                            <Col xs={24} lg={12}>
                                <ExceptionsList
                                    exceptions={availabilityExceptions}
                                    loading={loading}
                                    count={count}
                                    page={page}
                                    onDelete={handleDeleteException}
                                    onPageChange={setPage}
                                />
                            </Col>
                        </Row>
                    </Space>
                ) : (
                    <Empty
                        description="Selecciona un profesional para gestionar su disponibilidad"
                        style={{ padding: "60px 0" }}
                    />
                )}
            </Space>
        </PageContainer>
    );
};

export default ProfessionalsAvailabilitiesPage;
