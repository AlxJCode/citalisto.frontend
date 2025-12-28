"use client";

import SettingsLayout from '@/components/layout/SettingsLayout';
import { Card, Switch, Select, Divider } from 'antd';

const SettingsPage = () => {
    return (
        <SettingsLayout>
            <div>
                <h2 className="text-xl font-semibold mb-1">Configuración General</h2>
                <p className="text-gray-500 mb-6">Preferencias generales de la aplicación</p>

                <Divider />

                    {/* Language & Region */}
                    <Card className="mb-4" bordered={false}>
                        <h3 className="text-lg font-semibold mb-4">Idioma y Región</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Idioma</label>
                                <Select
                                    size="large"
                                    defaultValue="es"
                                    className="w-full max-w-xs"
                                    options={[
                                        { value: 'es', label: 'Español' },
                                        { value: 'en', label: 'English' },
                                        { value: 'pt', label: 'Português' },
                                    ]}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Zona Horaria</label>
                                <Select
                                    size="large"
                                    defaultValue="america/lima"
                                    className="w-full max-w-xs"
                                    options={[
                                        { value: 'america/lima', label: 'Lima (GMT-5)' },
                                        { value: 'america/bogota', label: 'Bogotá (GMT-5)' },
                                        { value: 'america/mexico_city', label: 'Ciudad de México (GMT-6)' },
                                    ]}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Formato de Fecha</label>
                                <Select
                                    size="large"
                                    defaultValue="dd/mm/yyyy"
                                    className="w-full max-w-xs"
                                    options={[
                                        { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
                                        { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
                                        { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' },
                                    ]}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Appearance */}
                    <Card className="mb-4" bordered={false}>
                        <h3 className="text-lg font-semibold mb-4">Apariencia</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <div className="font-medium">Modo Oscuro</div>
                                    <div className="text-sm text-gray-500">Activa el tema oscuro</div>
                                </div>
                                <Switch />
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <div className="font-medium">Sidebar Compacto</div>
                                    <div className="text-sm text-gray-500">Reduce el ancho del menú lateral</div>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </Card>

                    {/* Advanced */}
                    <Card bordered={false}>
                        <h3 className="text-lg font-semibold mb-4">Avanzado</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <div className="font-medium">Confirmaciones automáticas</div>
                                    <div className="text-sm text-gray-500">Confirmar citas automáticamente al recibirlas</div>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <div className="font-medium">Recordatorios por defecto</div>
                                    <div className="text-sm text-gray-500">Activar recordatorios para nuevas citas</div>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <div className="font-medium">Modo desarrollador</div>
                                    <div className="text-sm text-gray-500">Muestra información técnica adicional</div>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </Card>
            </div>
        </SettingsLayout>
    );
};

export default SettingsPage;
