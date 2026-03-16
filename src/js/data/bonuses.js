const getPath = (path) => `${import.meta.env.BASE_URL}${path}`;

export const bonuses = [
  {
    id: 'casino',
    title: 'Bono de Bienvenida para Slotsde Casino',
    text: 'Bono de Slots de hasta el <strong>150%</strong> + <strong>60 FS</strong> con tu primer depósito',
    badge: 'Bono',
    icon: getPath('images/bono/bono_1@1x.webp'),
    icon2x: getPath('images/bono/bono_1@2x.webp')
  },
  {
    id: 'sports',
    title: 'Bono de Bienvenida para Deportes',
    text: 'Obtén un Bono de Bienvenida para Deportes de hasta el <strong>120%</strong> con tu primer depósito',
    badge: 'Bono',
    icon: getPath('images/bono/bono_2@1x.webp'),
    icon2x: getPath('images/bono/bono_2@2x.webp')
  },
  {
    id: 'live',
    title: 'Bono de Bienvenida para Casino en Vivo',
    text: 'Bono de Casino en Vivo de hasta el <strong>150%</strong> con tu primer depósito',
    badge: 'Bono',
    icon: getPath('images/bono/bono_3@1x.webp'),
    icon2x: getPath('images/bono/bono_3@2x.webp')
  }
];
