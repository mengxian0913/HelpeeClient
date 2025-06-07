import React, { useState, useEffect } from 'react';
import {
  User,
  Settings,
  CreditCard,
  Bell,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  Heart,
  Users,
  ShoppingBag,
  AlertTriangle
} from 'lucide-react';
import Header from '../../components/Header/Header';
import styles from './Profile.module.scss';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  name: string;
  type: 'normal' | 'disadvantaged';
  email: string;
  phone: string;
  joinDate: string;
  stats: {
    donations: number;
    helped: number;
    purchases: number;
  };
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 模擬用戶資料
  const [userProfile] = useState<UserProfile>({
    name: '王小明',
    type: 'normal',
    email: 'wang.xiaoming@example.com',
    phone: '0912345678',
    joinDate: '2024-01-15',
    stats: {
      donations: 128,
      helped: 45,
      purchases: 23
    }
  });

  // 選單項目配置
  const menuSections = [
    {
      title: '帳戶設定',
      items: [
        {
          icon: User,
          title: '個人資料',
          desc: '修改姓名、聯絡資訊等',
          action: () => console.log('前往個人資料設定')
        },
        {
          icon: CreditCard,
          title: '付款方式',
          desc: '管理信用卡、電子錢包',
          action: () => console.log('前往付款方式設定')
        },
        {
          icon: Bell,
          title: '通知設定',
          desc: '推播、郵件通知偏好',
          action: () => console.log('前往通知設定')
        }
      ]
    },
    {
      title: '服務與支援',
      items: [
        {
          icon: HelpCircle,
          title: '幫助中心',
          desc: '常見問題、使用教學',
          action: () => console.log('前往幫助中心')
        },
        {
          icon: Shield,
          title: '隱私政策',
          desc: '查看隱私保護條款',
          action: () => console.log('查看隱私政策')
        }
      ]
    }
  ];

  // 登出處理
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // 模擬登出API調用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 清除本地儲存的用戶資料
      localStorage.removeItem('userToken');
      localStorage.removeItem('userProfile');
      
      // 導向登入頁面
      navigate('/login');
      
    } catch (error) {
      console.error('登出失敗:', error);
      alert('登出失敗，請重試');
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // 點擊遮罩關閉 Modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      cancelLogout();
    }
  };

  // 格式化加入日期
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月加入`;
  };

  // 獲取用戶類型顯示名稱
  const getUserTypeLabel = (type: string) => {
    return type === 'normal' ? '愛心天使' : '希望種子';
  };

  // 阻止滾動穿透
  useEffect(() => {
    if (showLogoutModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLogoutModal]);

  return (
    <div className={styles.profilePage}>
      
      <div className={styles.container}>
        {/* 個人資料卡片 */}
        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            <User />
          </div>
          <div className={styles.userName}>{userProfile.name}</div>
          <div className={styles.userType}>
            {getUserTypeLabel(userProfile.type)} • {formatJoinDate(userProfile.joinDate)}
          </div>
          
          <div className={styles.userStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{userProfile.stats.donations}</div>
              <div className={styles.statLabel}>愛心次數</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{userProfile.stats.helped}</div>
              <div className={styles.statLabel}>幫助人數</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{userProfile.stats.purchases}</div>
              <div className={styles.statLabel}>購買商品</div>
            </div>
          </div>
        </div>

        {/* 選單區域 */}
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={styles.menuSection}>
            <h3 className={styles.sectionTitle}>{section.title}</h3>
            {section.items.map((item, itemIndex) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={itemIndex} 
                  className={styles.menuItem}
                  onClick={item.action}
                >
                  <div className={styles.menuIcon}>
                    <IconComponent />
                  </div>
                  <div className={styles.menuContent}>
                    <div className={styles.menuTitle}>{item.title}</div>
                    <div className={styles.menuDesc}>{item.desc}</div>
                  </div>
                  <div className={styles.menuArrow}>
                    <ChevronRight />
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* 登出選單 */}
        <div className={styles.menuSection}>
          <div 
            className={`${styles.menuItem} ${styles.danger}`}
            onClick={handleLogout}
          >
            <div className={styles.menuIcon}>
              <LogOut />
            </div>
            <div className={styles.menuContent}>
              <div className={styles.menuTitle}>登出</div>
              <div className={styles.menuDesc}>退出當前帳戶</div>
            </div>
            <div className={styles.menuArrow}>
              <ChevronRight />
            </div>
          </div>
        </div>

        {/* 版本資訊 */}
        <div className={styles.versionInfo}>
          <div className={styles.appVersion}>
            一幣之力 v1.0.0
          </div>
          <div className={styles.appCopyright}>
            © 2024 一幣之力 All Rights Reserved.
          </div>
        </div>
      </div>

      {/* 登出確認 Modal */}
      {showLogoutModal && (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
          <div className={`${styles.modal} ${showLogoutModal ? styles.open : ''}`}>
            <div className={styles.modalIcon}>
              <AlertTriangle />
            </div>
            <h3 className={styles.modalTitle}>確認登出</h3>
            <p className={styles.modalDesc}>
              您確定要登出嗎？<br />
              登出後需要重新輸入帳號密碼
            </p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn}
                onClick={cancelLogout}
                disabled={isLoggingOut}
              >
                取消
              </button>
              <button 
                className={styles.logoutBtn}
                onClick={confirmLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? '登出中...' : '確認登出'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
