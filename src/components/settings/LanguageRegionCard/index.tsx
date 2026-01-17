import { Card, Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

const LanguageRegionCard = () => {
  return (
    <Card className="shadow-sm bg-gray-50/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gray-100 p-2 rounded-lg">
          <GlobalOutlined className="text-gray-500 text-lg" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700">Idioma y Región</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Idioma</label>
          <Select
            size="large"
            defaultValue="es"
            disabled
            className="w-full"
            options={[{ value: 'es', label: 'Español' }]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Zona Horaria</label>
          <Select
            size="large"
            defaultValue="america/lima"
            disabled
            className="w-full"
            options={[{ value: 'america/lima', label: 'Lima (GMT-5)' }]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Formato de Fecha</label>
          <Select
            size="large"
            defaultValue="dd/mm/yyyy"
            disabled
            className="w-full"
            options={[{ value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' }]}
          />
        </div>
      </div>
    </Card>
  );
};

export default LanguageRegionCard;
