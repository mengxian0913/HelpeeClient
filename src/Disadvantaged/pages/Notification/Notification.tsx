import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  BellDot, 
  Gift, 
  AlertCircle, 
  Clock, 
  Settings, 
  X,
  Check,
  Trash2,
  Heart,
  Coins,
  Calendar,
  MapPin,
  User
} from 'lucide-react';
import Header from '../../components/Header/Header';
import styles from './Notification.module.scss';

interface Notification {
  id: string;
  type: 'donation' | 'system' | 'reminder' | 'emergency';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category: string;
  details?: {
    amount?: number;
    location?: string;
    donor?: string;
    reference?: string;
  };
}

type FilterType = 'all' | 'unread' | 'donation' | 'system' | 'reminder' | 'emergency';

const Notification: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'donation',
      title: '收到愛心代幣捐贈',
      message: '感謝愛心天使王小明的捐贈，您收到了200一幣之力！快去查看您的愛心錢包吧。',
      timestamp: '2024-01-20T14:30:00Z',
      isRead: false,
      category: '捐贈通知',
      details: {
        amount: 200,
        donor: '王小明',
        reference: 'DON-2024-001234'
      }
    },
    {
      id: '2',
      type: 'system',
      title: '帳戶安全提醒',
      message: '您的帳戶於今日14:25在新北市登入，如非本人操作請立即聯繫客服。',
      timestamp: '2024-01-20T14:25:00Z',
      isRead: false,
      category: '系統通知',
      details: {
        location: '新北市',
        reference: 'SEC-2024-001'
      }
    },
    {
      id: '3',
      type: 'donation',
      title: '政府補助代幣發放',
      message: '本月政府生活補助代幣已發放至您的帳戶，共計850一幣之力，請查收。',
      timestamp: '2024-01-19T09:00:00Z',
      isRead: true,
      category: '政府補助',
      details: {
        amount: 850,
        donor: '政府補助系統',
        reference: 'GOV-2024-001234'
      }
    },
    {
      id: '4',
      type: 'reminder',
      title: '代幣使用提醒',
      message: '您有1200一幣之力即將到期，請盡快使用以免過期失效。有效期限至2024年2月15日。',
      timestamp: '2024-01-18T16:00:00Z',
      isRead: true,
      category: '使用提醒'
    },
    {
      id: '5',
      type: 'donation',
      title: '愛心企業捐贈',
      message: '好心企業透過員工愛心基金捐贈了680一幣之力給您，讓我們一起感謝這份溫暖！',
      timestamp: '2024-01-17T11:30:00Z',
      isRead: true,
      category: '企業捐贈',
      details: {
        amount: 680,
        donor: '好心企業',
        reference: 'CORP-2024-005'
      }
    },
    {
      id: '6',
      type: 'emergency',
      title: '急難救助通知',
      message: '您的急難救助申請已通過審核，將於3個工作日內發放1500一幣之力至您的帳戶。',
      timestamp: '2024-01-16T13:45:00Z',
      isRead: true,
      category: '急難救助',
      details: {
        amount: 1500,
        reference: 'EMG-2024-007'
      }
    },
    {
      id: '7',
      type: 'system',
      title: '系統維護通知',
      message: '系統將於1月21日02:00-05:00進行例行維護，期間可能無法正常使用服務，敬請見諒。',
      timestamp: '2024-01-15T18:00:00Z',
      isRead: true,
      category: '系統維護'
    },
    {
      id: '8',
      type: 'donation',
      title: '社區愛心捐贈',
      message: '感謝張大同和愛心媽媽的聯合捐贈，您收到了500一幣之力！',
      timestamp: '2024-01-14T20:15:00Z',
      isRead: true,
      category: '社區捐贈',
      details: {
        amount: 500,
        donor: '張大同等2人',
        reference: 'COM-2024-003'
      }
    }
  ]);

  // 篩選通知
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'unread') return !notification.isRead;
      return notification.type === activeFilter;
    });
  }, [notifications, activeFilter]);

  // 未讀通知數量
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // 格式化時間
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (diffDays === 2) {
      return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (diffDays <= 7) {
      return `${diffDays - 1}天前`;
    } else {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  // 獲取通知圖示
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'donation':
        return Heart;
      case 'system':
        return Settings;
      case 'reminder':
        return Clock;
      case 'emergency':
        return AlertCircle;
      default:
        return Bell;
    }
  };

  // 開啟通知詳情
  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
    
    // 標記為已讀
    if (!notification.isRead) {
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    }
  };

  // 關閉Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  // 標記所有為已讀
  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  // 刪除通知
  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== notificationId)
    );
    handleCloseModal();
  };

  return (
    <div className={styles.notificationPage}>
      {/* 頁面標題 */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <Bell />
          通知中心
        </h1>
        <p className={styles.pageSubtitle}>查看所有重要訊息與通知</p>
      </div>

      <div className={styles.container}>
        {/* 未讀統計 */}
        <div className={styles.unreadStats}>
          <div className={styles.unreadInfo}>
            <div className={styles.unreadIcon}>
              <BellDot />
            </div>
            <div className={styles.unreadText}>
              <div className={styles.unreadCount}>{unreadCount}</div>
              <div className={styles.unreadLabel}>則未讀通知</div>
            </div>
          </div>
          {unreadCount > 0 && (
            <button className={styles.markAllRead} onClick={handleMarkAllRead}>
              全部標示為已讀
            </button>
          )}
        </div>

        {/* 篩選區域 */}
        <div className={styles.filterSection}>
          <div className={styles.filterTabs}>
            {[
              { key: 'all', label: '全部' },
              { key: 'unread', label: '未讀' },
              { key: 'donation', label: '捐贈' },
              { key: 'system', label: '系統' },
              { key: 'reminder', label: '提醒' },
              { key: 'emergency', label: '急難' }
            ].map(filter => (
              <button
                key={filter.key}
                className={`${styles.filterTab} ${activeFilter === filter.key ? styles.active : ''}`}
                onClick={() => setActiveFilter(filter.key as FilterType)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* 通知列表 */}
        <div className={styles.notificationList}>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`${styles.notificationIcon} ${styles[notification.type]}`}>
                    <IconComponent />
                  </div>
                  
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationHeader}>
                      <div className={styles.notificationTitle}>
                        {notification.title}
                      </div>
                      <div className={styles.notificationTime}>
                        {formatTimestamp(notification.timestamp)}
                      </div>
                    </div>
                    
                    <div className={styles.notificationMessage}>
                      {notification.message}
                    </div>
                    
                    <div className={styles.notificationMeta}>
                      <span className={`${styles.notificationCategory} ${styles[notification.type]}`}>
                        {notification.category}
                      </span>
                      {!notification.isRead && (
                        <div className={styles.unreadBadge} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <Bell />
              <div className={styles.emptyTitle}>暫無通知</div>
              <div className={styles.emptyDesc}>
                目前沒有符合條件的通知訊息
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 通知詳情 Modal */}
      {isModalOpen && selectedNotification && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleSection}>
                <h2 className={styles.modalTitle}>
                  {selectedNotification.title}
                </h2>
                <div className={styles.modalTime}>
                  <Calendar />
                  {new Date(selectedNotification.timestamp).toLocaleString('zh-TW', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <button className={styles.closeBtn} onClick={handleCloseModal}>
                <X />
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.modalMessage}>
                {selectedNotification.message}
              </div>
              
              {selectedNotification.details && (
                <div className={styles.modalDetails}>
                  {selectedNotification.details.amount && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        <Coins size={12} style={{ marginRight: '4px' }} />
                        金額
                      </span>
                      <span className={styles.detailValue}>
                        {selectedNotification.details.amount.toLocaleString()} 一幣之力
                      </span>
                    </div>
                  )}
                  
                  {selectedNotification.details.donor && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        <User size={12} style={{ marginRight: '4px' }} />
                        捐贈者
                      </span>
                      <span className={styles.detailValue}>
                        {selectedNotification.details.donor}
                      </span>
                    </div>
                  )}
                  
                  {selectedNotification.details.location && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        <MapPin size={12} style={{ marginRight: '4px' }} />
                        位置
                      </span>
                      <span className={styles.detailValue}>
                        {selectedNotification.details.location}
                      </span>
                    </div>
                  )}
                  
                  {selectedNotification.details.reference && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>參考編號</span>
                      <span className={styles.detailValue}>
                        {selectedNotification.details.reference}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={`${styles.actionBtn} ${styles.secondary}`}
                onClick={() => handleDeleteNotification(selectedNotification.id)}
              >
                <Trash2 />
                刪除
              </button>
              <button 
                className={`${styles.actionBtn} ${styles.primary}`}
                onClick={handleCloseModal}
              >
                <Check />
                確認
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
