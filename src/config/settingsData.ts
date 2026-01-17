export const addOns = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Mensajes adicionales por mes',
    iconType: 'WhatsAppOutlined',
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
    active: false
  },
  {
    id: 'professionals',
    name: 'Profesionales',
    description: 'Profesionales adicionales',
    iconType: 'TeamOutlined',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    active: false
  },
  {
    id: 'locations',
    name: 'Sedes',
    description: 'Sedes adicionales',
    iconType: 'BankOutlined',
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    active: true
  }
];

export const addonPrices = {
  whatsapp: [
    { quantity: 50, price: 'S/. 12.00' },
    { quantity: 100, price: 'S/. 20.00' },
    { quantity: 300, price: 'S/. 50.00' },
    { quantity: 600, price: 'S/. 90.00' }
  ],
  professionals: [
    { quantity: 1, price: 'S/. 15.00' },
    { quantity: 2, price: 'S/. 28.00' },
    { quantity: 3, price: 'S/. 40.00' }
  ],
  locations: [
    { quantity: 1, price: 'S/. 35.00' },
    { quantity: 2, price: 'S/. 65.00' },
    { quantity: 3, price: 'S/. 90.00' }
  ]
};
