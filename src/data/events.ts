export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  horario: string;
  dias: string;
}

export const eventos: Evento[] = [
  {
    id: 'after-office',
    titulo: 'After Office',
    descripcion: 'El cierre perfecto para tu jornada. Vení a desenchufarte con tragos, buena música y el mejor ambiente al aire libre de San Juan.',
    horario: 'Desde las 20:30',
    dias: 'Mar a Dom',
  },
  {
    id: 'happy-hour',
    titulo: 'Happy Hour',
    descripcion: 'Tragos de autor a precios especiales. Dos horas para brindar, compartir y empezar la noche con todo lo que 1592 tiene para ofrecerte.',
    horario: 'Hasta las 22:00',
    dias: 'Mar a Dom',
  },
  {
    id: 'noches-dj',
    titulo: 'Noches de DJ',
    descripcion: 'Los mejores sets en vivo para que la noche no tenga fin. Música que acompaña cada trago, cada charla y cada momento.',
    horario: 'Desde las 22:00',
    dias: 'Vie y Sáb',
  },
];
