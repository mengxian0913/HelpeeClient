import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Heart, 
  Users, 
  Gift, 
  Clock, 
  Coins,
  Award,
  Sparkles,
  Package,
  Coffee,
  Book,
  Apple
} from 'lucide-react';
import Header from '../../components/Header/Header';
import styles from './Tracking.module.scss';

interface TrackingRecord {
  id: string;
  amount: number;
  recipient: string;
  itemName: string;
  timestamp: string;
  category: string;
}

const Tracking: React.FC = () => {
  // 模擬追蹤紀錄數據
  const trackingRecords: TrackingRecord[] = [
    {
      id: '1',
      amount: 80,
      recipient: '陳奶奶',
      itemName: '愛心便當',
      timestamp: '2024-01-20T14:30:00Z',
      category: '餐飲'
    },
    {
      id: '2',
      amount: 150,
      recipient: '小明同學',
      itemName: '學習用品包',
      timestamp: '2024-01-19T10:15:00Z',
      category: '文具'
    },
    {
      id: '3',
      amount: 45,
      recipient: '李爺爺',
      itemName: '營養飲品',
      timestamp: '2024-01-18T16:45:00Z',
      category: '飲品'
    },
    {
      id: '4',
      amount: 120,
      recipient: '小華家庭',
      itemName: '日用品包',
      timestamp: '2024-01-17T09:20:00Z',
      category: '日用品'
    },
    {
      id: '5',
      amount: 200,
      recipient: '育幼院孩子們',
      itemName: '新鮮水果包',
      timestamp: '2024-01-16T13:10:00Z',
      category: '食品'
    },
    {
      id: '6',
      amount: 300,
      recipient: '流浪動物之家',
      itemName: '保暖衣物',
      timestamp: '2024-01-15T11:30:00Z',
      category: '衣物'
    },
    {
      id: '7',
      amount: 90,
      recipient: '王阿姨',
      itemName: '營養便當',
      timestamp: '2024-01-14T12:00:00Z',
      category: '餐飲'
    },
    {
      id: '8',
      amount: 75,
      recipient: '張同學',
      itemName: '課外讀物',
      timestamp: '2024-01-13T15:30:00Z',
      category: '文具'
    }
  ];

  // 統計數據
  const statistics = useMemo(() => {
    const totalCoins = trackingRecords.reduce((sum, record) => sum + record.amount, 0);
    const totalPeople = new Set(trackingRecords.map(r => r.recipient)).size;
    const totalItems = trackingRecords.length;
    
    return {
      totalCoins,
      totalPeople,
      totalItems
    };
  }, [trackingRecords]);

  // 格式化日期
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return '今天';
    } else if (diffDays === 2) {
      return '昨天';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} 天前`;
    } else {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  // 根據類別選擇圖標
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '餐飲':
        return Package;
      case '飲品':
        return Coffee;
      case '文具':
        return Book;
      case '食品':
        return Apple;
      default:
        return Gift;
    }
  };

  // 生成影響力描述
  const getImpactMessage = (amount: number) => {
    if (amount >= 200) {
      return '巨大影響';
    } else if (amount >= 100) {
      return '深度幫助';
    } else if (amount >= 50) {
      return '溫暖關懷';
    } else {
      return '愛心傳遞';
    }
  };

  return (
    <div className={styles.trackingPage}>
      
      <div className={styles.container}>
        {/* 成就卡片 */}
        <div className={styles.achievementCard}>
          <div className={styles.achievementHeader}>
            <div className={styles.achievementIcon}>
              <Award />
            </div>
            <h2 className={styles.achievementTitle}>您的愛心成就</h2>
          </div>
          <div className={styles.achievementStats}>
            <div className={styles.achievementStat}>
              <div className={styles.statNumber}>
                {statistics.totalCoins.toLocaleString()}
              </div>
              <div className={styles.statLabel}>愛心幣之力</div>
            </div>
            <div className={styles.achievementStat}>
              <div className={styles.statNumber}>
                {statistics.totalPeople}
              </div>
              <div className={styles.statLabel}>受助朋友</div>
            </div>
          </div>
        </div>

        {/* 快速統計 */}
        <div className={styles.statsCards}>
          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.people}`}>
              <Users />
            </div>
            <div className={styles.statCardNumber}>{statistics.totalPeople}</div>
            <div className={styles.statCardLabel}>幫助人數</div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.heart}`}>
              <Heart />
            </div>
            <div className={styles.statCardNumber}>{statistics.totalItems}</div>
            <div className={styles.statCardLabel}>愛心次數</div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.gift}`}>
              <Gift />
            </div>
            <div className={styles.statCardNumber}>
              {Math.round(statistics.totalCoins / statistics.totalPeople)}
            </div>
            <div className={styles.statCardLabel}>平均貢獻</div>
          </div>
        </div>

        {/* 愛心足跡標題 */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <Sparkles />
          </div>
          <h3 className={styles.sectionTitle}>愛心足跡</h3>
        </div>

        {/* 追蹤列表 */}
        {trackingRecords.length > 0 ? (
          <div className={styles.trackingList}>
            {trackingRecords.map((record) => {
              const IconComponent = getCategoryIcon(record.category);
              return (
                <div key={record.id} className={styles.trackingItem}>
                  <div className={styles.trackingIcon}>
                    <IconComponent />
                  </div>
                  
                  <div className={styles.trackingContent}>
                    <div className={styles.trackingMain}>
                      <div className={styles.trackingInfo}>
                        <div className={styles.trackingTitle}>
                          {record.itemName} → {record.recipient}
                        </div>
                        <div className={styles.trackingDesc}>
                          您的愛心讓 {record.recipient} 收到了 {record.itemName}
                        </div>
                      </div>
                      <div className={styles.trackingAmount}>
                        <Coins className={styles.coinIcon} />
                        {record.amount}
                      </div>
                    </div>
                    
                    <div className={styles.trackingMeta}>
                      <span className={styles.trackingDate}>
                        <Clock />
                        {formatDate(record.timestamp)}
                      </span>
                      <span className={styles.impactBadge}>
                        {getImpactMessage(record.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Heart />
            </div>
            <div className={styles.emptyTitle}>還沒有愛心足跡</div>
            <div className={styles.emptyDesc}>
              開始您的第一次愛心行動<br />
              讓溫暖傳遞給需要的人
            </div>
            <button className={styles.emptyAction}>
              立即開始
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
