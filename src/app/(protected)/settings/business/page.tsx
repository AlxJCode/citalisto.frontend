"use client";

import { Form, Input, Button, Select, TimePicker, Divider } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

const BusinessPage = () => {
    const [form] = Form.useForm();

    const handleSubmit = (values: unknown) => {
        console.log('Business values:', values);
    };

    return (
        <div>
                <h2 className="text-xl font-semibold mb-1">Mi Negocio</h2>
                <p className="text-gray-500 mb-6">Configura la información de tu negocio</p>

                <Divider />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        businessName: 'Clínica Dental Sonrisas',
                        businessType: 'dental',
                        address: 'Av. Principal 123, Lima',
                        phone: '+51 01 234 5678',
                        description: 'Clínica dental especializada en tratamientos estéticos',
                        openTime: dayjs('09:00', 'HH:mm'),
                        closeTime: dayjs('18:00', 'HH:mm'),
                    }}
                >
                    <Form.Item
                        label="Nombre del Negocio"
                        name="businessName"
                        rules={[{ required: true, message: 'Ingresa el nombre del negocio' }]}
                    >
                        <Input size="large" placeholder="Nombre del negocio" />
                    </Form.Item>

                    <Form.Item
                        label="Tipo de Negocio"
                        name="businessType"
                        rules={[{ required: true, message: 'Selecciona el tipo de negocio' }]}
                    >
                        <Select size="large" placeholder="Selecciona un tipo">
                            <Select.Option value="dental">Clínica Dental</Select.Option>
                            <Select.Option value="medical">Clínica Médica</Select.Option>
                            <Select.Option value="beauty">Centro de Belleza</Select.Option>
                            <Select.Option value="other">Otro</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Dirección"
                        name="address"
                        rules={[{ required: true, message: 'Ingresa la dirección' }]}
                    >
                        <Input size="large" placeholder="Dirección completa" />
                    </Form.Item>

                    <Form.Item
                        label="Teléfono"
                        name="phone"
                        rules={[{ required: true, message: 'Ingresa el teléfono' }]}
                    >
                        <Input size="large" placeholder="Teléfono del negocio" />
                    </Form.Item>

                    <Form.Item
                        label="Descripción"
                        name="description"
                    >
                        <TextArea rows={4} placeholder="Describe tu negocio" />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="Horario de Apertura"
                            name="openTime"
                        >
                            <TimePicker size="large" format="HH:mm" className="w-full" />
                        </Form.Item>

                        <Form.Item
                            label="Horario de Cierre"
                            name="closeTime"
                        >
                            <TimePicker size="large" format="HH:mm" className="w-full" />
                        </Form.Item>
                    </div>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large">
                            Guardar cambios
                        </Button>
                    </Form.Item>
                </Form>
        </div>
    );
};

export default BusinessPage;
