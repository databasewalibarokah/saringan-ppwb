import { Home, BarChart2, User } from 'lucide-react';

/**
 * Bottom navigation tab configuration.
 * Adding a new tab only requires adding an entry here.
 */
export const NAV_TABS = [
  { key: 'home', label: 'Beranda', icon: Home },
  { key: 'stats', label: 'Statistik', icon: BarChart2 },
  { key: 'account', label: 'Akun', icon: User },
];
