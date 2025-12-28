"use client";

import { Card, Switch, Divider } from 'antd';
import { BellOutlined, MailOutlined, MobileOutlined } from '@ant-design/icons';

const NotificationsPage = () => {
    return (
        <div>
                <h2 className="text-xl font-semibold mb-1">Notificaciones</h2>
                <p className="text-gray-500 mb-6">Configura cómo quieres recibir notificaciones</p>

                <Divider />

                {/* Email Notifications */}
                <Card className="mb-4" bordered={false}>
                    <div className="flex items-center gap-3 mb-4">
                        <MailOutlined className="text-xl text-blue-600" />
                        <h3 className="text-lg font-semibold">Notificaciones por Email</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <div className="font-medium">Nuevas citas</div>
                                <div className="text-sm text-gray-500">Recibe un email cuando se agenda una nueva cita</div>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div>
                                <div className="font-medium">Cancelaciones</div>
                                <div className="text-sm text-gray-500">Notificación cuando se cancela una cita</div>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div>
                                <div className="font-medium">Recordatorios</div>
                                <div className="text-sm text-gray-500">Recordatorios de citas próximas</div>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </Card>

                {/* WhatsApp Notifications */}
                <Card className="mb-4" bordered={false}>
                    <div className="flex items-center gap-3 mb-4">
                        <MobileOutlined className="text-xl text-green-600" />
                        <h3 className="text-lg font-semibold">Notificaciones por WhatsApp</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <div className="font-medium">Confirmaciones automáticas</div>
                                <div className="text-sm text-gray-500">Envía confirmación automática al cliente</div>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div>
                                <div className="font-medium">Recordatorios 24h antes</div>
                                <div className="text-sm text-gray-500">Envía recordatorio un día antes de la cita</div>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </div>
                </Card>

                {/* System Notifications */}
                <Card bordered={false}>
                    <div className="flex items-center gap-3 mb-4">
                        <BellOutlined className="text-xl text-orange-600" />
                        <h3 className="text-lg font-semibold">Notificaciones del Sistema</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <div className="font-medium">Actualizaciones del producto</div>
                                <div className="text-sm text-gray-500">Novedades y nuevas funcionalidades</div>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div>
                                <div className="font-medium">Consejos y tutoriales</div>
                                <div className="text-sm text-gray-500">Aprende a usar mejor la plataforma</div>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </Card>
        </div>
    );
};

export default NotificationsPage;
