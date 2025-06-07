import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Home, 
  ShoppingBag, 
  Gift, 
  TrendingUp, 
  ShoppingCart,
  History,
  User
} from 'lucide-react';
import styles from './Header.module.scss';

interface HeaderProps {
  cartCount?: number;
  onDonateClick?: () => void;
  onCartClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartCount = 3, 
  onDonateClick,
  onCartClick 
}) => {
  const location = useLocation();
  const navigation = useNavigate();
  
  const navigationItems = [
    { icon: Home, label: '首頁', href: '/', paths: ['/'] },
    { icon: ShoppingBag, label: '商城', href: '/shop', paths: ['/shop', '/market'] },
    { icon: Gift, label: '捐贈', href: '/donations', paths: ['/donations', '/donate'] },
    { icon: History, label: '紀錄', href: '/orders', paths: ['/orders', '/history'] },
    { icon: TrendingUp, label: '追蹤', href: '/tracking', paths: ['/tracking', '/coin-tracking'] },
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
            <span className={styles.logoText}>一幣之力</span>
          </div>

          <div className={styles.statusActions}>
            <button className={styles.donateBtn} onClick={() => navigation("/donations")}>
              <Heart />
              捐贈
            </button>

            {/* <button className={styles.cartBtn} onClick={() => navigation('/cart')}>
              <ShoppingCart />
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
            </button> */}

            <button className={styles.userAvatar} onClick={() => navigation('/profile') } >
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
              className={`${styles.navItem} ${isActiveRoute(item.paths) ? styles.active : ''}`}
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
