import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },
  {
    id: 2,
    label: 'MENUITEMS.BLOCKS.TEXT',
    icon: 'ri-stack-line',
    link: '/blocks'
  },
  {
    id: 3,
    label: 'MENUITEMS.FARMERS.TEXT',
    icon: 'ri-group-line',
    link: '/farmers'
  },
  {
    id: 4,
    label: 'MENUITEMS.REWARDS.TEXT',
    icon: 'ri-wallet-line',
    link: '/rewards'
  },
  {
    id: 5,
    label: 'MENUITEMS.CHIA.TEXT',
    icon: 'ri-plant-line',
    link: '/chia'
  },
  {
    id: 6,
    label: 'MENUITEMS.POOL.TEXT',
    icon: 'ri-dashboard-2-line',
    subItems: [
      {
        id: 61,
        label: 'MENUITEMS.POOL.LIST.STATUS',
        link: '/pool-status',
        parentId: 6
      },
      {
        id: 62,
        label: 'MENUITEMS.POOL.LIST.STATS',
        link: '/pool-stats',
        parentId: 6
      }
    ]
  },
  {
    id: 7,
    label: 'MENUITEMS.INFO.TEXT',
    icon: 'ri-information-line',
    subItems: [
      {
        id: 71,
        label: 'MENUITEMS.INFO.LIST.FAQ',
        link: '/info-faq',
        parentId: 7
      },
      {
        id: 72,
        label: 'MENUITEMS.INFO.LIST.API',
        link: '/info-api',
        parentId: 7
      },
      {
        id: 73,
        label: 'MENUITEMS.INFO.LIST.FEE',
        link: '/info-fee',
        parentId: 7
      },
      {
        id: 74,
        label: 'MENUITEMS.INFO.LIST.TEAM',
        link: '/info-team',
        parentId: 7
      }
    ]
  },
  {
    id: 8,
    label: 'MENUITEMS.CONTACT.TEXT',
    icon: 'ri-headphone-line',
    subItems: [
      {
        id: 81,
        label: 'MENUITEMS.CONTACT.LIST.TELEGRAM',
        icon: 'ri-telegram-line',
        link: 'https://t.me/chiapoolenergy',
        parentId: 8
      },
      {
        id: 82,
        label: 'MENUITEMS.CONTACT.LIST.TWITTER',
        icon: 'ri-twitter-line',
        link: 'https://twitter.com/pool_energy',
        parentId: 8
      },
      {
        id: 83,
        label: 'MENUITEMS.CONTACT.LIST.REDDIT',
        icon: 'ri-reddit-line',
        link: 'https://www.reddit.com/r/chia/comments/thv366/new_chia_pool_poolenergy/',
        parentId: 8
      },
      {
        id: 84,
        label: 'MENUITEMS.CONTACT.LIST.YOUTUBE',
        icon: 'ri-youtube-line',
        link: 'https://www.youtube.com/channel/UCCHIIBGO-PA-UfxJDlcz0aw',
        parentId: 8
      },
      {
        id: 85,
        label: 'MENUITEMS.CONTACT.LIST.FACEBOOK',
        icon: 'ri-facebook-line',
        link: 'https://www.facebook.com/pool.energy/',
        parentId: 8
      }
    ]
  }
];
