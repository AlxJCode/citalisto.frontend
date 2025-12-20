"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    Button,
    Select,
    Form,
    Input,
    Typography,
    Space,
    Tag,
    Alert,
    Row,
    Col,
    Spin,
    Divider,
    Calendar,
    Badge,
} from "antd";
import {
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    EnvironmentOutlined,
    MedicineBoxOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { usePublicBooking } from "../hooks/usePublicBooking";
import type {
    PublicProfessional,
    PublicService,
    CreatePublicBookingPayload,
    PublicBranch,
} from "../types/public-booking.types";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface PublicBookingWidgetProps {
    businessSlug: string;
    queryParams: {
        [key: string]: string | string[] | undefined;
    };
}

type ValidationState = "loading" | "valid" | "invalid" | "missing_params";

export function PublicBookingWidget({ businessSlug, queryParams }: PublicBookingWidgetProps) {
    const { loading, getProfessionals, getAvailability, createBooking, getBranches } =
        usePublicBooking(businessSlug);

    // Validation state
    const [validationState, setValidationState] = useState<ValidationState>("loading");
    const [selectedBranch, setSelectedBranch] = useState<PublicBranch | null>(null);
    const [selectedProfessional, setSelectedProfessional] = useState<PublicProfessional | null>(
        null
    );

    // Booking state
    const [selectedService, setSelectedService] = useState<PublicService | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [confirmationData, setConfirmationData] = useState<any>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Refs for smooth scrolling
    const dateRef = React.useRef<HTMLDivElement>(null);
    const timeRef = React.useRef<HTMLDivElement>(null);
    const formRef = React.useRef<HTMLDivElement>(null);

    // Validate params and load initial data on mount
    useEffect(() => {
        validateAndLoadInitialData();
    }, []);

    // Auto-scroll to next section when previous is completed
    useEffect(() => {
        if (selectedService && !selectedDate) {
            dateRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [selectedService]);

    useEffect(() => {
        if (selectedDate && availableSlots.length > 0 && !selectedSlot) {
            timeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [selectedDate, availableSlots, selectedSlot]);

    useEffect(() => {
        if (selectedSlot) {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [selectedSlot]);

    const validateAndLoadInitialData = async () => {
        setValidationState("loading");

        // Extract query params
        const branchId = Array.isArray(queryParams.branch)
            ? queryParams.branch[0]
            : queryParams.branch;
        const professionalId = Array.isArray(queryParams.professional)
            ? queryParams.professional[0]
            : queryParams.professional;

        // Check if params exist
        if (!branchId || !professionalId) {
            setValidationState("missing_params");
            return;
        }

        try {
            // Load branches
            const branchesResult = await getBranches();
            if (!branchesResult.success || !branchesResult.data) {
                setValidationState("invalid");
                return;
            }

            // Find matching branch
            const branch = branchesResult.data.find((b: PublicBranch) => b.id === branchId);
            if (!branch) {
                setValidationState("invalid");
                return;
            }

            // Load professionals for this branch
            const professionalsResult = await getProfessionals(branchId);
            if (!professionalsResult.success || !professionalsResult.data) {
                setValidationState("invalid");
                return;
            }

            // Find matching professional
            const professional = professionalsResult.data.find(
                (p: PublicProfessional) => p.id === professionalId
            );
            if (!professional) {
                setValidationState("invalid");
                return;
            }

            // Everything is valid - set state
            setSelectedBranch(branch);
            setSelectedProfessional(professional);
            setValidationState("valid");
        } catch (error) {
            console.error("Error validating params:", error);
            setValidationState("invalid");
        }
    };

    // Load availability when service and date are selected
    const loadAvailability = async () => {
        if (!selectedProfessional || !selectedService || !selectedDate) return;

        const result = await getAvailability(
            selectedProfessional.id,
            selectedService.id,
            selectedDate.format("YYYY-MM-DD")
        );

        if (result.success && result.data) {
            setAvailableSlots(result.data.slots);
        }
    };

    useEffect(() => {
        if (selectedProfessional && selectedService && selectedDate) {
            loadAvailability();
        }
    }, [selectedProfessional, selectedService, selectedDate]);

    // Handle service selection
    const handleServiceChange = (serviceId: string) => {
        const service = selectedProfessional?.services.find((s) => s.id === serviceId);
        setSelectedService(service || null);
        setSelectedDate(dayjs());
        setAvailableSlots([]);
        setSelectedSlot(null);
    };

    // Handle date selection from calendar
    const handleDateSelect = (date: Dayjs) => {
        // Only allow selection if service is selected
        if (!selectedService) return;

        const today = dayjs().startOf("day");
        const maxDate = dayjs().add(30, "days").endOf("day");

        // Don't allow past dates or dates beyond 30 days
        if (date.isBefore(today) || date.isAfter(maxDate)) return;

        setSelectedDate(date);
        setSelectedSlot(null);
    };

    // Disable dates in calendar
    const disabledDate = (current: Dayjs) => {
        // Disable if no service selected
        if (!selectedService) return true;

        const today = dayjs().startOf("day");
        const maxDate = dayjs().add(30, "days").endOf("day");

        // Disable if date is in the past or more than 30 days in the future
        return current.isBefore(today) || current.isAfter(maxDate);
    };

    // Group time slots by morning/afternoon/evening
    const getGroupedSlots = () => {
        const morning: string[] = [];
        const afternoon: string[] = [];
        const evening: string[] = [];

        availableSlots.forEach((slot) => {
            const hour = parseInt(slot.split(":")[0]);
            if (hour < 12) {
                morning.push(slot);
            } else if (hour < 18) {
                afternoon.push(slot);
            } else {
                evening.push(slot);
            }
        });

        return { morning, afternoon, evening };
    };

    // Handle form submission
    const handleSubmit = async (values: any) => {
        if (!selectedProfessional || !selectedService || !selectedDate || !selectedSlot) return;

        // Save user data to localStorage for future bookings
        const userData = {
            full_name: values.full_name,
            email: values.email,
            phone: values.phone,
        };
        localStorage.setItem("citalisto_user_data", JSON.stringify(userData));

        const payload: CreatePublicBookingPayload = {
            professional_id: selectedProfessional.id,
            service_id: selectedService.id,
            date: selectedDate.format("YYYY-MM-DD"),
            start_time: selectedSlot,
            full_name: values.full_name,
            email: values.email,
            phone: values.phone,
            notes: values.notes,
        };

        const result = await createBooking(payload);

        if (result.success && result.data) {
            setConfirmationData(result.data);
            setBookingSuccess(true);
        }
    };

    // Header Component with Branch and Professional Info
    const renderHeader = () => (
        <div
            style={{
                background: "linear-gradient(135deg, var(--ant-primary-color) 0%, var(--ant-primary-color) 100%)",
                padding: "clamp(20px, 4vw, 32px)",
                borderRadius: "12px 12px 0 0",
            }}
        >
            <Row justify="space-between" align="top" gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                    <div style={{ color: "white" }}>
                        <Title
                            level={2}
                            style={{
                                color: "white",
                                margin: 0,
                                marginBottom: 4,
                                fontSize: "clamp(20px, 4vw, 28px)",
                            }}
                        >
                            CitaListo
                        </Title>
                        <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
                            Reserva tu cita en línea
                        </Text>
                    </div>
                </Col>
                <Col xs={24} sm={12}>
                    <div
                        style={{
                            background: "rgba(255,255,255,0.15)",
                            backdropFilter: "blur(10px)",
                            padding: "clamp(12px, 3vw, 16px)",
                            borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.2)",
                        }}
                    >
                        <Space orientation="vertical" size={4} style={{ width: "100%" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <EnvironmentOutlined style={{ color: "white", fontSize: 16 }} />
                                <Text
                                    strong
                                    style={{
                                        color: "white",
                                        fontSize: "clamp(14px, 3vw, 16px)",
                                    }}
                                >
                                    {selectedBranch?.name}
                                </Text>
                            </div>
                            {selectedBranch?.address && (
                                <Text
                                    style={{
                                        color: "rgba(255,255,255,0.9)",
                                        fontSize: "clamp(12px, 2.5vw, 14px)",
                                        paddingLeft: 24,
                                    }}
                                >
                                    {`${selectedBranch.address} - ${selectedBranch.phone}`}
                                </Text>
                            )}
                            <Divider style={{ margin: "8px 0", borderColor: "rgba(255,255,255,0.2)" }} />
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <MedicineBoxOutlined style={{ color: "white", fontSize: 16 }} />
                                <Text
                                    strong
                                    style={{
                                        color: "white",
                                        fontSize: "clamp(14px, 3vw, 16px)",
                                    }}
                                >
                                    {selectedProfessional?.name} {selectedProfessional?.last_name}
                                </Text>
                            </div>
                            {selectedProfessional?.description && (
                                <Text
                                    style={{
                                        color: "rgba(255,255,255,0.9)",
                                        fontSize: "clamp(12px, 2.5vw, 14px)",
                                        paddingLeft: 24,
                                    }}
                                >
                                    {selectedProfessional.description}
                                </Text>
                            )}
                        </Space>
                    </div>
                </Col>
            </Row>
        </div>
    );

    // Sticky Summary Bar - Cal.com style
    const renderSummaryBar = () => {
        if (!selectedService && !selectedDate && !selectedSlot) return null;

        return (
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    background: "linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%)",
                    borderBottom: "1px solid #e8e8e8",
                    padding: "16px 24px",
                    marginBottom: 24,
                    borderRadius: "8px 8px 0 0",
                }}
            >
                <Row justify="space-between" align="middle" gutter={[16, 8]}>
                    <Col xs={24} md={16}>
                        <Space size={8} wrap>
                            {selectedService && (
                                <Tag color="blue" style={{ padding: "4px 12px", fontSize: 14 }}>
                                    <MedicineBoxOutlined style={{ marginRight: 4 }} />
                                    {selectedService.name}
                                </Tag>
                            )}
                            {selectedDate && (
                                <Tag color="green" style={{ padding: "4px 12px", fontSize: 14 }}>
                                    <CalendarOutlined style={{ marginRight: 4 }} />
                                    {selectedDate.format("DD MMM")}
                                </Tag>
                            )}
                            {selectedSlot && (
                                <Tag color="purple" style={{ padding: "4px 12px", fontSize: 14 }}>
                                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                                    {selectedSlot.substring(0, 5)}
                                </Tag>
                            )}
                        </Space>
                    </Col>
                    <Col xs={24} md={8} style={{ textAlign: "right" }}>
                        {selectedService && (
                            <Text strong style={{ fontSize: 18, color: "#52c41a" }}>
                                S/ {selectedService.price}
                            </Text>
                        )}
                    </Col>
                </Row>
            </div>
        );
    };

    // Main booking form - Cal.com style layout
    const renderBookingForm = () => {
        const { morning, afternoon, evening } = getGroupedSlots();

        return (
            <>
                {/* Sticky Summary Bar */}
                {renderSummaryBar()}
 
                <Row gutter={[24, 24]} style={{padding: "0.5rem 1.5rem"}}>
                    {/* Left Column - Compact Calendar + Service Selector */}
                    <Col xs={24} lg={10}>
                        <Space orientation="vertical" size="middle" style={{ width: "100%", position: "sticky", top: 80 }}>
                            {/* Service Selection */}
                            <div>
                                <Text strong style={{ display: "block", marginBottom: 12, fontSize: 16 }}>
                                    <MedicineBoxOutlined style={{ marginRight: 8 }} />
                                    Selecciona un servicio
                                </Text>
                                <Select
                                    size="large"
                                    placeholder="¿Qué servicio necesitas?"
                                    value={selectedService?.id}
                                    onChange={handleServiceChange}
                                    style={{ width: "100%" }}
                                    optionLabelProp="label"
                                >
                                    {selectedProfessional?.services
                                        .filter((s) => s.is_active && s.is_public)
                                        .map((service) => (
                                            <Select.Option key={service.id} value={service.id} label={service.name}>
                                                <div style={{ padding: "8px 0" }}>
                                                    <div style={{ fontWeight: 500, marginBottom: 4 }}>
                                                        {service.name}
                                                    </div>
                                                    <Space size={8}>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            {service.duration_minutes} min
                                                        </Text>
                                                        <Text strong style={{ fontSize: 12, color: "#52c41a" }}>
                                                            S/ {service.price}
                                                        </Text>
                                                    </Space>
                                                </div>
                                            </Select.Option>
                                        ))}
                                </Select>
                            </div>

                            {/* Compact Calendar */}
                            <div ref={dateRef}>
                                <Text strong style={{ display: "block", marginBottom: 12, fontSize: 16 }}>
                                    <CalendarOutlined style={{ marginRight: 8 }} />
                                    Elige una fecha
                                </Text>
                                {!selectedService && (
                                    <Alert
                                        title="Selecciona un servicio primero"
                                        type="info"
                                        showIcon
                                        style={{ marginBottom: 12 }}
                                    />
                                )}
                                <div
                                    style={{
                                        opacity: !selectedService ? 0.4 : 1,
                                        pointerEvents: !selectedService ? "none" : "auto",
                                        transition: "opacity 0.3s ease",
                                    }}
                                >
                                    <Calendar
                                        fullscreen={false}
                                        value={selectedDate || undefined}
                                        onSelect={handleDateSelect}
                                        disabledDate={disabledDate}
                                        fullCellRender={(date) => {
                                            const isSelected = selectedDate?.isSame(date, "day");
                                            const isToday = dayjs().isSame(date, "day");
                                            const isDisabled = disabledDate(date);

                                            return (
                                                <div
                                                    className={`ant-picker-cell-inner ${
                                                        isSelected ? "ant-picker-cell-selected" : ""
                                                    }`}
                                                    style={{
                                                        opacity: isDisabled ? 0.25 : 1,
                                                        cursor: isDisabled ? "not-allowed" : "pointer",
                                                        position: "relative",
                                                    }}
                                                >
                                                    {date.date()}
                                                    {isToday && !isSelected && (
                                                        <div
                                                            style={{
                                                                position: "absolute",
                                                                bottom: 2,
                                                                left: "50%",
                                                                transform: "translateX(-50%)",
                                                                width: 4,
                                                                height: 4,
                                                                borderRadius: "50%",
                                                                background: "var(--ant-primary-color)",
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </Space>
                    </Col>

                    {/* Right Column - Timeline Slots + Inline Form */}
                    <Col xs={24} lg={14}>
                        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                            {/* Time Slots Timeline */}
                            {selectedService && selectedDate && (
                                <div ref={timeRef}>
                                    <Text strong style={{ display: "block", marginBottom: 16, fontSize: 16 }}>
                                        <ClockCircleOutlined style={{ marginRight: 8 }} />
                                        Selecciona un horario
                                    </Text>

                                    {loading && (
                                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                                            <Spin size="large" />
                                            <Text type="secondary" style={{ display: "block", marginTop: 16 }}>
                                                Cargando horarios disponibles...
                                            </Text>
                                        </div>
                                    )}

                                    {!loading && availableSlots.length === 0 && (
                                        <Alert
                                            title="No hay horarios disponibles"
                                            description="Intenta con otra fecha."
                                            type="warning"
                                            showIcon
                                        />
                                    )}

                                    {!loading && availableSlots.length > 0 && (
                                        <div>
                                            {morning.length > 0 && (
                                                <div style={{ marginBottom: 24 }}>
                                                    <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
                                                        Mañana
                                                    </Text>
                                                    <Space wrap size={[8, 8]}>
                                                        {morning.map((slot) => (
                                                            <Button
                                                                key={slot}
                                                                size="large"
                                                                type={selectedSlot === slot ? "primary" : "default"}
                                                                onClick={() => setSelectedSlot(slot)}
                                                                style={{ minWidth: 80 }}
                                                            >
                                                                {slot.substring(0, 5)}
                                                            </Button>
                                                        ))}
                                                    </Space>
                                                </div>
                                            )}

                                            {afternoon.length > 0 && (
                                                <div style={{ marginBottom: 24 }}>
                                                    <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
                                                        Tarde
                                                    </Text>
                                                    <Space wrap size={[8, 8]}>
                                                        {afternoon.map((slot) => (
                                                            <Button
                                                                key={slot}
                                                                size="large"
                                                                type={selectedSlot === slot ? "primary" : "default"}
                                                                onClick={() => setSelectedSlot(slot)}
                                                                style={{ minWidth: 80 }}
                                                            >
                                                                {slot.substring(0, 5)}
                                                            </Button>
                                                        ))}
                                                    </Space>
                                                </div>
                                            )}

                                            {evening.length > 0 && (
                                                <div>
                                                    <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
                                                        Noche
                                                    </Text>
                                                    <Space wrap size={[8, 8]}>
                                                        {evening.map((slot) => (
                                                            <Button
                                                                key={slot}
                                                                size="large"
                                                                type={selectedSlot === slot ? "primary" : "default"}
                                                                onClick={() => setSelectedSlot(slot)}
                                                                style={{ minWidth: 80 }}
                                                            >
                                                                {slot.substring(0, 5)}
                                                            </Button>
                                                        ))}
                                                    </Space>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Inline Contact Form */}
                            {selectedSlot && (
                                <div ref={formRef} style={{ paddingTop: 24, borderTop: "1px solid #f0f0f0" }}>
                                    <Text strong style={{ display: "block", marginBottom: 16, fontSize: 16 }}>
                                        <UserOutlined style={{ marginRight: 8 }} />
                                        Completa tus datos
                                    </Text>

                                    <Form
                                        layout="vertical"
                                        onFinish={handleSubmit}
                                        size="large"
                                        initialValues={(() => {
                                            const savedData = localStorage.getItem("citalisto_user_data");
                                            if (savedData) {
                                                try {
                                                    return JSON.parse(savedData);
                                                } catch {
                                                    return {};
                                                }
                                            }
                                            return {};
                                        })()}
                                    >
                                        <Row gutter={16}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    name="full_name"
                                                    label="Nombre completo"
                                                    rules={[{ required: true, message: "Requerido" }]}
                                                >
                                                    <Input placeholder="Juan Pérez" />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    name="phone"
                                                    label="Teléfono"
                                                    rules={[
                                                        { required: true, message: "El teléfono es requerido" },
                                                        {
                                                            pattern: /^[0-9]{9}$/,
                                                            message: "El teléfono debe tener 9 dígitos",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="+51 999 888 777" />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Form.Item
                                            name="email"
                                            label="Email"
                                            rules={[
                                                { required: true, message: "Requerido" },
                                                { type: "email", message: "Email inválido" },
                                            ]}
                                        >
                                            <Input placeholder="juan@example.com" />
                                        </Form.Item>

                                        <Form.Item name="notes" label="Notas (opcional)">
                                            <TextArea rows={2} placeholder="Algo que debamos saber..." />
                                        </Form.Item>

                                        <Button
                                            type="primary"
                                            size="large"
                                            block
                                            htmlType="submit"
                                            loading={loading}
                                            icon={<CheckCircleOutlined />}
                                            style={{ height: 48, fontSize: 16 }}
                                        >
                                            Confirmar reserva
                                        </Button>
                                    </Form>
                                </div>
                            )}
                        </Space>
                    </Col>
                </Row>
            </>
        );
    };

    // Confirmation view
    const renderConfirmationStep = () => (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "1.5rem", textAlign: "center" }}>
            <CheckCircleOutlined style={{ fontSize: 64, color: "#52c41a", marginBottom: 24 }} />
            <Title level={2} style={{ fontSize: "clamp(20px, 4vw, 28px)" }}>
                ¡Reserva confirmada!
            </Title>
            <Paragraph type="secondary">
                Tu reserva ha sido creada exitosamente. Recibirás un email de confirmación.
            </Paragraph>

            <Card style={{ marginTop: 24, textAlign: "left" }}>
                <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                    <div>
                        <Text type="secondary">Código de confirmación</Text>
                        <Title level={3} style={{ margin: 0, fontSize: "clamp(18px, 3vw, 24px)" }}>
                            {confirmationData?.confirmation_code}
                        </Title>
                    </div>
                    <div>
                        <Text type="secondary">Profesional</Text>
                        <div>{confirmationData?.professional_name}</div>
                    </div>
                    <div>
                        <Text type="secondary">Servicio</Text>
                        <div>{confirmationData?.service_name}</div>
                    </div>
                    <div>
                        <Text type="secondary">Fecha y hora</Text>
                        <div>
                            {confirmationData?.date} -{" "}
                            {confirmationData?.start_time?.substring(0, 5)} a{" "}
                            {confirmationData?.end_time?.substring(0, 5)}
                        </div>
                    </div>
                    <div>
                        <Text type="secondary">Sucursal</Text>
                        <div>{confirmationData?.branch_name}</div>
                    </div>
                </Space>
            </Card>
        </div>
    );

    // Loading State
    const renderLoadingState = () => (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Spin size="large" />
            <Paragraph style={{ marginTop: 24 }} type="secondary">
                Validando información...
            </Paragraph>
        </div>
    );

    // Error State - Missing Parameters
    const renderMissingParamsError = () => (
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 16px", textAlign: "center" }}>
            <WarningOutlined style={{ fontSize: 64, color: "#faad14", marginBottom: 24 }} />
            <Title level={2} style={{ fontSize: "clamp(20px, 4vw, 28px)" }}>
                Enlace incompleto
            </Title>
            <Paragraph type="secondary" style={{ fontSize: "16px", marginBottom: 24 }}>
                Parece que falta información en el enlace. Para poder reservar una cita, necesitamos
                que el enlace incluya tanto la sucursal como el profesional.
            </Paragraph>
            <Alert
                message="¿Qué puedes hacer?"
                description={
                    <div style={{ textAlign: "left" }}>
                        <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
                            <li>Verifica que copiaste el enlace completo</li>
                            <li>Contacta con la clínica para obtener un nuevo enlace</li>
                            <li>Solicita ayuda al personal</li>
                        </ul>
                    </div>
                }
                type="info"
                showIcon
            />
        </div>
    );

    // Error State - Invalid Data
    const renderInvalidDataError = () => (
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 16px", textAlign: "center" }}>
            <WarningOutlined style={{ fontSize: 64, color: "#ff4d4f", marginBottom: 24 }} />
            <Title level={2} style={{ fontSize: "clamp(20px, 4vw, 28px)" }}>
                Enlace no válido
            </Title>
            <Paragraph type="secondary" style={{ fontSize: "16px", marginBottom: 24 }}>
                Lo sentimos, no pudimos encontrar la información de la sucursal o el profesional
                asociados a este enlace.
            </Paragraph>
            <Alert
                message="¿Qué puedes hacer?"
                description={
                    <div style={{ textAlign: "left" }}>
                        <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
                            <li>Es posible que el enlace haya expirado</li>
                            <li>El profesional o la sucursal ya no estén disponibles</li>
                            <li>Por favor, contacta con la clínica para obtener un nuevo enlace</li>
                        </ul>
                    </div>
                }
                type="error"
                showIcon
            />
            <div style={{ marginTop: 32 }}>
                <Text type="secondary">¿Necesitas ayuda?</Text>
                <div style={{ marginTop: 8 }}>
                    {selectedBranch?.phone && (
                        <Tag icon={<PhoneOutlined />} color="blue" style={{ padding: "4px 12px" }}>
                            {selectedBranch.phone}
                        </Tag>
                    )}
                </div>
            </div>
        </div>
    );

    // Show loading state
    if (validationState === "loading") {
        return (
            <div style={{ padding: "clamp(24px, 5vw, 48px)" }}>
                <Card
                    style={{
                        maxWidth: 900,
                        margin: "0 auto",
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                >
                    {renderLoadingState()}
                </Card>
            </div>
        );
    }

    // Show error state - missing params
    if (validationState === "missing_params") {
        return (
            <div style={{ padding: "clamp(24px, 5vw, 48px)" }}>
                <Card
                    style={{
                        maxWidth: 900,
                        margin: "0 auto",
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        padding: "clamp(20px, 4vw, 40px)",
                    }}
                >
                    {renderMissingParamsError()}
                </Card>
            </div>
        );
    }

    // Show error state - invalid data
    if (validationState === "invalid") {
        return (
            <div style={{ padding: "clamp(24px, 5vw, 48px)" }}>
                <Card
                    style={{
                        maxWidth: 900,
                        margin: "0 auto",
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        padding: "clamp(20px, 4vw, 40px)",
                    }}
                >
                    {renderInvalidDataError()}
                </Card>
            </div>
        );
    }

    // Valid state - show booking form or confirmation
    return (
        <div style={{ padding: "clamp(16px, 4vw, 48px)" }}>
            <Card
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    padding: 0,
                }}
                styles={{ body: { padding: 0 } }}
            >
                {/* Header with Branch and Professional Info */}
                {renderHeader()}

                {/* Main Content */}
                <div style={{ padding: "clamp(0, 4vw, 32px)" }}>
                    {bookingSuccess ? renderConfirmationStep() : renderBookingForm()}
                </div>
            </Card>
        </div>
    );
}
