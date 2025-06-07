import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Home, 
  ShoppingBag, 
  Gift, 
  History, 
  User,
  Coins,
  Bell,
  Receipt
} from 'lucide-react';
import styles from './Header.module.scss';

interface HeaderProps {
  balance?: number;
  notificationCount?: number;
  onBalanceClick?: () => void;
  onNotificationClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  balance = 2850,
  notificationCount = 2, 
  onBalanceClick,
  onNotificationClick 
}) => {
  const location = useLocation();
  const navigation = useNavigate();
  
  const navigationItems = [
    { icon: Home, label: '首頁', href: '/', paths: ['/'] },
    { icon: Gift, label: '接收補助', href: '/receive', paths: ['/receive'], special: true },
    { icon: ShoppingBag, label: '購買', href: '/shop', paths: ['/shop', '/purchase'] },
    { icon: Receipt, label: '紀錄', href: '/records', paths: ['/records', '/history'] },
    { icon: User, label: '我的', href: '/profile', paths: ['/profile', '/account'] },
  ];

  // 判斷是否為 active 狀態
  const isActiveRoute = (paths: string[]) => {
    return paths.some(path => 
      path === '/' 
        ? location.pathname === '/' 
        : location.pathname.startsWith(path)
    );
  };

  return (
    <>
      {/* 頂部狀態欄 */}
      <header className={styles.header}>
        <div className={styles.statusBar}>
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <Heart fill="currentColor" />
            </div>
            <span className={styles.logoText}>希望小站</span>
          </div>

          <div className={styles.statusActions}>
            <button className={styles.balanceBtn} onClick={onBalanceClick}>
              <Coins />
              {balance.toLocaleString()}
            </button>

            <button className={styles.notificationBtn} onClick={() => navigation('/notifications')}>
              <Bell />
              {notificationCount > 0 && (
                <span className={styles.notificationBadge}>{notificationCount}</span>
              )}
            </button>

            <button className={styles.userAvatar} onClick={() => navigation('/profile')} >
              <User />
            </button>
          </div>
        </div>
      </header>

      {/* 底部導航 */}
      <nav className={styles.bottomNav}>
        <div className={styles.navContainer}>
          {navigationItems.map((item) => (
            <Link 
              key={item.label}
              to={item.href} 
              className={`${styles.navItem} ${isActiveRoute(item.paths) ? styles.active : ''} ${item.special ? styles.receiveItem : ''}`}
            >
              <item.icon />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Header;
