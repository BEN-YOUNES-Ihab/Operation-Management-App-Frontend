import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'events',
    title: 'Calendrier',
    type: 'item',
    icon: 'calendar',
    url: '/pages/events'
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    translate: 'Dashboard',
    type: 'item',
    icon: 'pie-chart',
    url: '/pages/dashboard'
  },
  {
    id: 'domaine',
    title: 'Domaines',
    type: 'item',
    icon: 'rss',
    url: '/pages/domains'
  },
  {
    id: 'users',
    title: 'Utilisateurs',
    type: 'collapsible',
    icon: 'users',
    role: ['Admin'],
    children: [
      {
        id: 'users',
        title: "Liste d'utilisateurs",
        type: 'item',
        icon: 'user',
        url: '/admin/users',
      },
      {
        id: 'invites',
        title: 'Invitations',
        type: 'item',
        icon: 'user-plus',
        url: '/admin/invites',
      }
    ]
  }
]

