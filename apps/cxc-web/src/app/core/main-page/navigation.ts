export interface NavigationRoute {
  path: string;
  label: string;
  description: string;
  icon?: string;
}

export const MainNavigation: NavigationRoute[] = [
  {
    path: '/credito',
    label: 'Crédito',
    description: 'Cartera de Crédito',
  },
  {
    path: '/contado',
    label: 'Contado',
    description: 'Cartéra de contado',
  },
  {
    path: '/cheque',
    label: 'Cheques',
    description: 'Cartera de Cheques devueltos',
  },
  {
    path: '/juridico',
    label: 'Jurídico',
    description: 'Cartera de Jurídico',
  },
];
