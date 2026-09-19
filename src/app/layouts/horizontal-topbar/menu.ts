import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },
  {
    id: 2,
    label: 'MENUITEMS.FARMERS.TEXT',
    icon: 'ri-group-line',
    link: '/farmers'
  },
  {
    id: 3,
    label: 'MENUITEMS.BLOCKS.TEXT',
    icon: 'ri-stack-line',
    link: '/blocks'
  },
  {
    id: 4,
    label: 'MENUITEMS.REWARDS.TEXT',
    icon: 'ri-wallet-line',
    link: '/rewards'
  },
  {
    id: 5,
    label: 'MENUITEMS.PARTIALS.TEXT',
    icon: 'ri-bring-to-front',
    link: '/partials'
  },
  {
    id: 6,
    label: 'MENUITEMS.CHIA.TEXT',
    icon: 'ri-plant-line',
    subItems: [
      {
        id: 61,
        label: 'MENUITEMS.CHIA.LIST.BLOCKCHAIN_STATE',
        link: 'https://dashboard.chia.net/d/CL1X4UWnk/blockchain-state?orgId=1',
        parentId: 6
      },
      {
        id: 62,
        label: 'MENUITEMS.CHIA.LIST.ECOSYSTEM_ACT',
        link: 'https://dashboard.chia.net/d/bede53ff-3d90-4c35-bad0-3154f121ac2b/ecosystem-activity?orgId=1',
        parentId: 6
      },
      {
        id: 63,
        label: 'MENUITEMS.CHIA.LIST.MEMPOOL_TXS_FEES',
        link: 'https://dashboard.chia.net/d/46EAA05E/mempool-transactions-and-fees?orgId=1',
        parentId: 6
      },
      {
        id: 64,
        label: 'MENUITEMS.CHIA.LIST.NAKAMOTO_COEF',
        link: 'https://dashboard.chia.net/d/6S16D9AVk/nakamoto-coefficient?orgId=1',
        parentId: 6
      },
      {
        id: 65,
        label: 'MENUITEMS.CHIA.LIST.PEER_INFO',
        link: 'https://dashboard.chia.net/d/em15uQ47k/peer-info?orgId=1',
        parentId: 6
      },
    ]
  },
  {
    id: 7,
    label: 'MENUITEMS.POOL.TEXT',
    icon: 'ri-dashboard-2-line',
    subItems: [
      {
        id: 71,
        label: 'MENUITEMS.POOL.LIST.STATUS',
        link: '/pool/status',
        parentId: 7
      },
      {
        id: 72,
        label: 'MENUITEMS.POOL.LIST.STATS',
        link: '/pool/stats',
        parentId: 7
      },
      {
        id: 73,
        label: 'MENUITEMS.POOL.LIST.LOGS',
        link: '/pool/logs',
        parentId: 7
      },
      {
        id: 74,
        label: 'MENUITEMS.POOL.LIST.PARTIALS',
        link: '/partials',
        parentId: 7
      }
    ]
  },
  {
    id: 8,
    label: 'MENUITEMS.API.TEXT',
    icon: 'ri-stackshare-line',
    subItems: [
      {
        id: 81,
        label: 'MENUITEMS.API.LIST.SWAGGER',
        link: 'https://pool.energy/api/doc/',
        parentId: 8
      },
      {
        id: 82,
        label: 'MENUITEMS.API.LIST.REDOC',
        link: 'https://pool.energy/api/redoc/',
        parentId: 8
      },
      {
        id: 83,
        label: 'MENUITEMS.API.LIST.BROWSER',
        link: 'https://pool.energy/api/v1.0/',
        parentId: 8
      }
    ]
  },
  {
    id: 9,
    label: 'MENUITEMS.INFO.TEXT',
    icon: 'ri-information-line',
    subItems: [
      {
        id: 91,
        label: 'MENUITEMS.INFO.LIST.FAQ',
        link: '/info/faq',
        parentId: 9
      },
      {
        id: 92,
        label: 'MENUITEMS.INFO.LIST.FEE',
        link: '/info/fee',
        parentId: 9
      },
      {
        id: 93,
        label: 'MENUITEMS.INFO.LIST.TEAM',
        link: '/info/team',
        parentId: 9
      },
      {
        id: 94,
        label: 'MENUITEMS.INFO.LIST.GITHUB',
        link: 'https://github.com/Pool-Energy',
        parentId: 9
      }
    ]
  },
  {
    id: 10,
    label: 'MENUITEMS.CONTACT.TEXT',
    icon: 'ri-headphone-line',
    subItems: [
      {
        id: 101,
        label: 'MENUITEMS.CONTACT.LIST.TELEGRAM',
        icon: 'ri-telegram-line',
        link: 'https://t.me/chiapoolenergy',
        parentId: 10
      },
      {
        id: 102,
        label: 'MENUITEMS.CONTACT.LIST.BLUESKY',
        icon: 'ri-bluesky-line',
        link: 'https://bsky.app/profile/pool.energy',
        parentId: 10
      },
      {
        id: 103,
        label: 'MENUITEMS.CONTACT.LIST.XING',
        icon: 'ri-xing-line',
        link: 'https://x.com/pool_energy',
        parentId: 10
      },
      {
        id: 104,
        label: 'MENUITEMS.CONTACT.LIST.REDDIT',
        icon: 'ri-reddit-line',
        link: 'https://www.reddit.com/r/chia/comments/thv366/new_chia_pool_poolenergy/',
        parentId: 10
      },
      {
        id: 105,
        label: 'MENUITEMS.CONTACT.LIST.YOUTUBE',
        icon: 'ri-youtube-line',
        link: 'https://www.youtube.com/channel/UCCHIIBGO-PA-UfxJDlcz0aw',
        parentId: 10
      },
      {
        id: 106,
        label: 'MENUITEMS.CONTACT.LIST.FACEBOOK',
        icon: 'ri-facebook-line',
        link: 'https://www.facebook.com/pool.energy/',
        parentId: 10
      },
      {
        id: 107,
        label: 'MENUITEMS.CONTACT.LIST.DISCORD',
        icon: 'ri-discord-line',
        link: 'https://discord.gg/arZDWsY5xZ',
        parentId: 10
      },
      {
        id: 108,
        label: 'MENUITEMS.CONTACT.LIST.GITHUB',
        icon: 'ri-github-line',
        link: 'https://github.com/Pool-Energy',
        parentId: 10
      }
    ]
  }
];
