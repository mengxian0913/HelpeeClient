import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  Coins,
  Receipt,
  TrendingDown,
  Package,
  FileText
} from 'lucide-react';
import Header from '../../components/Header/Header';
import styles from './Record.module.css';

interface PurchaseItem {
  name: string;
  quantity: number;
  price: number;
}

interface ConsumptionRecord {
  id: string;
  date: string;
  location: string;
  items: PurchaseItem[];
  totalAmount: number;
  timestamp: string;
}

interface MonthData {
  month: string;
  displayName: string;
  totalSpent: number;
  recordCount: number;
}

const Record: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('2024-01');

  // 模擬消費記錄數據 - 橫跨六個月
  const consumptionRecords: ConsumptionRecord[] = [
    // 2024年1月
    {
      id: '1',
      date: '2024-01-29',
      location: '全聯福利中心 中正店',
      items: [
        { name: '愛心便當', quantity: 1, price: 80 },
        { name: '牛奶', quantity: 2, price: 30 }
      ],
      totalAmount: 140,
      timestamp: '2024-01-29T12:30:00Z'
    },
    {
      id: '2',
      date: '2024-01-26',
      location: '7-ELEVEN 民生門市',
      items: [
        { name: '麵包', quantity: 2, price: 25 },
        { name: '礦泉水', quantity: 1, price: 15 }
      ],
      totalAmount: 65,
      timestamp: '2024-01-26T15:45:00Z'
    },
    {
      id: '3',
      date: '2024-01-24',
      location: '家樂福 台北店',
      items: [
        { name: '日用品包', quantity: 1, price: 120 },
        { name: '洗髮精', quantity: 1, price: 45 }
      ],
      totalAmount: 165,
      timestamp: '2024-01-24T10:20:00Z'
    },
    {
      id: '4',
      date: '2024-01-20',
      location: '康是美 忠孝店',
      items: [
        { name: '營養飲品', quantity: 3, price: 45 }
      ],
      totalAmount: 135,
      timestamp: '2024-01-20T14:10:00Z'
    },
    {
      id: '5',
      date: '2024-01-17',
      location: '全聯福利中心 萬華店',
      items: [
        { name: '愛心便當', quantity: 2, price: 80 },
        { name: '水果包', quantity: 1, price: 60 }
      ],
      totalAmount: 220,
      timestamp: '2024-01-17T18:00:00Z'
    },
    {
      id: '6',
      date: '2024-01-14',
      location: '屈臣氏 信義店',
      items: [
        { name: '衛生紙', quantity: 2, price: 50 },
        { name: '洗衣精', quantity: 1, price: 65 }
      ],
      totalAmount: 165,
      timestamp: '2024-01-14T16:30:00Z'
    },
    {
      id: '7',
      date: '2024-01-10',
      location: '美廉社 中山店',
      items: [
        { name: '米', quantity: 1, price: 150 },
        { name: '罐頭', quantity: 3, price: 40 }
      ],
      totalAmount: 270,
      timestamp: '2024-01-10T11:15:00Z'
    },
    {
      id: '8',
      date: '2024-01-05',
      location: '7-ELEVEN 復興門市',
      items: [
        { name: '熱食', quantity: 1, price: 70 },
        { name: '飲料', quantity: 1, price: 25 }
      ],
      totalAmount: 95,
      timestamp: '2024-01-05T19:30:00Z'
    },

    // 2023年12月
    {
      id: '9',
      date: '2023-12-30',
      location: '全聯福利中心 板橋店',
      items: [
        { name: '年菜便當', quantity: 2, price: 120 },
        { name: '水果', quantity: 1, price: 80 }
      ],
      totalAmount: 320,
      timestamp: '2023-12-30T13:45:00Z'
    },
    {
      id: '10',
      date: '2023-12-28',
      location: '家樂福 新莊店',
      items: [
        { name: '保暖衣物', quantity: 1, price: 300 },
        { name: '襪子', quantity: 3, price: 20 }
      ],
      totalAmount: 360,
      timestamp: '2023-12-28T14:20:00Z'
    },
    {
      id: '11',
      date: '2023-12-25',
      location: '7-ELEVEN 聖誕門市',
      items: [
        { name: '聖誕便當', quantity: 1, price: 100 },
        { name: '熱湯', quantity: 1, price: 30 }
      ],
      totalAmount: 130,
      timestamp: '2023-12-25T12:00:00Z'
    },
    {
      id: '12',
      date: '2023-12-22',
      location: '美廉社 三重店',
      items: [
        { name: '日用品', quantity: 1, price: 150 },
        { name: '清潔用品', quantity: 2, price: 45 }
      ],
      totalAmount: 240,
      timestamp: '2023-12-22T16:15:00Z'
    },
    {
      id: '13',
      date: '2023-12-18',
      location: '康是美 大安店',
      items: [
        { name: '維他命', quantity: 1, price: 200 },
        { name: '感冒藥', quantity: 1, price: 120 }
      ],
      totalAmount: 320,
      timestamp: '2023-12-18T10:30:00Z'
    },
    {
      id: '14',
      date: '2023-12-15',
      location: '全聯福利中心 士林店',
      items: [
        { name: '便當', quantity: 3, price: 80 },
        { name: '湯品', quantity: 2, price: 25 }
      ],
      totalAmount: 290,
      timestamp: '2023-12-15T18:45:00Z'
    },
    {
      id: '15',
      date: '2023-12-10',
      location: '7-ELEVEN 天母門市',
      items: [
        { name: '早餐', quantity: 1, price: 60 },
        { name: '咖啡', quantity: 1, price: 35 }
      ],
      totalAmount: 95,
      timestamp: '2023-12-10T07:30:00Z'
    },
    {
      id: '16',
      date: '2023-12-05',
      location: '屈臣氏 內湖店',
      items: [
        { name: '醫療用品', quantity: 1, price: 180 },
        { name: '營養補給', quantity: 2, price: 90 }
      ],
      totalAmount: 360,
      timestamp: '2023-12-05T15:20:00Z'
    },

    // 2023年11月
    {
      id: '17',
      date: '2023-11-30',
      location: '全聯福利中心 淡水店',
      items: [
        { name: '感恩便當', quantity: 1, price: 90 },
        { name: '熱茶', quantity: 1, price: 20 }
      ],
      totalAmount: 110,
      timestamp: '2023-11-30T12:30:00Z'
    },
    {
      id: '18',
      date: '2023-11-27',
      location: '家樂福 汐止店',
      items: [
        { name: '冬季用品', quantity: 1, price: 250 },
        { name: '暖暖包', quantity: 5, price: 10 }
      ],
      totalAmount: 300,
      timestamp: '2023-11-27T14:45:00Z'
    },
    {
      id: '19',
      date: '2023-11-23',
      location: '美廉社 蘆洲店',
      items: [
        { name: '營養便當', quantity: 2, price: 85 },
        { name: '水果', quantity: 1, price: 50 }
      ],
      totalAmount: 220,
      timestamp: '2023-11-23T17:10:00Z'
    },
    {
      id: '20',
      date: '2023-11-20',
      location: '7-ELEVEN 文山門市',
      items: [
        { name: '熱食', quantity: 1, price: 75 },
        { name: '溫開水', quantity: 2, price: 0 }
      ],
      totalAmount: 75,
      timestamp: '2023-11-20T13:25:00Z'
    },
    {
      id: '21',
      date: '2023-11-15',
      location: '康是美 松山店',
      items: [
        { name: '保健食品', quantity: 1, price: 180 },
        { name: '維生素C', quantity: 1, price: 120 }
      ],
      totalAmount: 300,
      timestamp: '2023-11-15T11:40:00Z'
    },
    {
      id: '22',
      date: '2023-11-10',
      location: '全聯福利中心 中和店',
      items: [
        { name: '便當', quantity: 1, price: 80 },
        { name: '蔬菜包', quantity: 1, price: 60 }
      ],
      totalAmount: 140,
      timestamp: '2023-11-10T19:15:00Z'
    },
    {
      id: '23',
      date: '2023-11-05',
      location: '屈臣氏 新店區',
      items: [
        { name: '日用品', quantity: 1, price: 120 },
        { name: '清潔用品', quantity: 1, price: 80 }
      ],
      totalAmount: 200,
      timestamp: '2023-11-05T16:50:00Z'
    },

    // 2023年10月
    {
      id: '24',
      date: '2023-10-31',
      location: '7-ELEVEN 萬聖門市',
      items: [
        { name: '萬聖便當', quantity: 1, price: 95 },
        { name: '南瓜湯', quantity: 1, price: 35 }
      ],
      totalAmount: 130,
      timestamp: '2023-10-31T18:30:00Z'
    },
    {
      id: '25',
      date: '2023-10-28',
      location: '全聯福利中心 永和店',
      items: [
        { name: '重陽便當', quantity: 2, price: 90 },
        { name: '長壽麵', quantity: 1, price: 40 }
      ],
      totalAmount: 220,
      timestamp: '2023-10-28T12:15:00Z'
    },
    {
      id: '26',
      date: '2023-10-25',
      location: '美廉社 樹林店',
      items: [
        { name: '秋季用品', quantity: 1, price: 200 },
        { name: '保暖衣物', quantity: 1, price: 180 }
      ],
      totalAmount: 380,
      timestamp: '2023-10-25T14:30:00Z'
    },
    {
      id: '27',
      date: '2023-10-20',
      location: '家樂福 桃園店',
      items: [
        { name: '營養便當', quantity: 1, price: 85 },
        { name: '熱湯', quantity: 2, price: 25 }
      ],
      totalAmount: 135,
      timestamp: '2023-10-20T17:45:00Z'
    },
    {
      id: '28',
      date: '2023-10-15',
      location: '康是美 中壢店',
      items: [
        { name: '感冒藥', quantity: 1, price: 150 },
        { name: '喉糖', quantity: 2, price: 30 }
      ],
      totalAmount: 210,
      timestamp: '2023-10-15T10:20:00Z'
    },
    {
      id: '29',
      date: '2023-10-10',
      location: '7-ELEVEN 國慶門市',
      items: [
        { name: '國慶便當', quantity: 1, price: 100 },
        { name: '國旗飲料', quantity: 1, price: 30 }
      ],
      totalAmount: 130,
      timestamp: '2023-10-10T12:00:00Z'
    },
    {
      id: '30',
      date: '2023-10-05',
      location: '全聯福利中心 基隆店',
      items: [
        { name: '便當', quantity: 1, price: 80 },
        { name: '水果', quantity: 1, price: 50 }
      ],
      totalAmount: 130,
      timestamp: '2023-10-05T15:30:00Z'
    },

    // 2023年9月
    {
      id: '31',
      date: '2023-09-30',
      location: '美廉社 宜蘭店',
      items: [
        { name: '中秋便當', quantity: 1, price: 110 },
        { name: '柚子', quantity: 2, price: 40 }
      ],
      totalAmount: 190,
      timestamp: '2023-09-30T19:00:00Z'
    },
    {
      id: '32',
      date: '2023-09-25',
      location: '7-ELEVEN 中秋門市',
      items: [
        { name: '月餅', quantity: 1, price: 150 },
        { name: '茶葉', quantity: 1, price: 80 }
      ],
      totalAmount: 230,
      timestamp: '2023-09-25T16:20:00Z'
    },
    {
      id: '33',
      date: '2023-09-20',
      location: '全聯福利中心 花蓮店',
      items: [
        { name: '便當', quantity: 2, price: 80 },
        { name: '湯品', quantity: 1, price: 30 }
      ],
      totalAmount: 190,
      timestamp: '2023-09-20T13:15:00Z'
    },
    {
      id: '34',
      date: '2023-09-15',
      location: '家樂福 台東店',
      items: [
        { name: '學用品', quantity: 1, price: 200 },
        { name: '文具', quantity: 3, price: 25 }
      ],
      totalAmount: 275,
      timestamp: '2023-09-15T11:30:00Z'
    },
    {
      id: '35',
      date: '2023-09-10',
      location: '康是美 教師店',
      items: [
        { name: '教師便當', quantity: 1, price: 95 },
        { name: '感謝卡', quantity: 5, price: 10 }
      ],
      totalAmount: 145,
      timestamp: '2023-09-10T12:45:00Z'
    },
    {
      id: '36',
      date: '2023-09-05',
      location: '7-ELEVEN 開學門市',
      items: [
        { name: '開學便當', quantity: 1, price: 85 },
        { name: '筆記本', quantity: 2, price: 30 }
      ],
      totalAmount: 145,
      timestamp: '2023-09-05T08:30:00Z'
    },

    // 2023年8月
    {
      id: '37',
      date: '2023-08-31',
      location: '全聯福利中心 屏東店',
      items: [
        { name: '夏日便當', quantity: 1, price: 80 },
        { name: '涼飲', quantity: 2, price: 25 }
      ],
      totalAmount: 130,
      timestamp: '2023-08-31T17:30:00Z'
    },
    {
      id: '38',
      date: '2023-08-25',
      location: '美廉社 高雄店',
      items: [
        { name: '清涼用品', quantity: 1, price: 150 },
        { name: '電風扇', quantity: 1, price: 300 }
      ],
      totalAmount: 450,
      timestamp: '2023-08-25T14:45:00Z'
    },
    {
      id: '39',
      date: '2023-08-20',
      location: '7-ELEVEN 消暑門市',
      items: [
        { name: '冰品', quantity: 3, price: 40 },
        { name: '冷飲', quantity: 2, price: 30 }
      ],
      totalAmount: 180,
      timestamp: '2023-08-20T15:15:00Z'
    },
    {
      id: '40',
      date: '2023-08-15',
      location: '家樂福 台南店',
      items: [
        { name: '夏季衣物', quantity: 2, price: 120 },
        { name: '涼鞋', quantity: 1, price: 150 }
      ],
      totalAmount: 390,
      timestamp: '2023-08-15T11:00:00Z'
    },
    {
      id: '41',
      date: '2023-08-10',
      location: '康是美 父親店',
      items: [
        { name: '父親便當', quantity: 1, price: 120 },
        { name: '感謝禮品', quantity: 1, price: 80 }
      ],
      totalAmount: 200,
      timestamp: '2023-08-10T18:20:00Z'
    },
    {
      id: '42',
      date: '2023-08-05',
      location: '全聯福利中心 嘉義店',
      items: [
        { name: '便當', quantity: 1, price: 80 },
        { name: '飲料', quantity: 1, price: 25 }
      ],
      totalAmount: 105,
      timestamp: '2023-08-05T13:40:00Z'
    },
    {
      id: '43',
      date: '2023-08-01',
      location: '屈臣氏 雲林店',
      items: [
        { name: '防曬用品', quantity: 1, price: 180 },
        { name: '涼感商品', quantity: 2, price: 60 }
      ],
      totalAmount: 300,
      timestamp: '2023-08-01T16:10:00Z'
    }
  ];

  // 生成月份數據
  const monthsData: MonthData[] = useMemo(() => {
    const monthMap = new Map<string, { totalSpent: number; recordCount: number }>();
    
    consumptionRecords.forEach(record => {
      const month = record.date.substring(0, 7); // YYYY-MM
      const existing = monthMap.get(month) || { totalSpent: 0, recordCount: 0 };
      monthMap.set(month, {
        totalSpent: existing.totalSpent + record.totalAmount,
        recordCount: existing.recordCount + 1
      });
    });

    return Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        displayName: formatMonthDisplay(month),
        totalSpent: data.totalSpent,
        recordCount: data.recordCount
      }))
      .sort((a, b) => b.month.localeCompare(a.month)); // 最新月份在前
  }, [consumptionRecords]);

  // 篩選當前月份的記錄
  const currentMonthRecords = useMemo(() => {
    return consumptionRecords
      .filter(record => record.date.startsWith(selectedMonth))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [consumptionRecords, selectedMonth]);

  // 當前月份統計
  const currentMonthStats = useMemo(() => {
    const totalSpent = currentMonthRecords.reduce((sum, record) => sum + record.totalAmount, 0);
    const recordCount = currentMonthRecords.length;
    const avgSpent = recordCount > 0 ? Math.round(totalSpent / recordCount) : 0;
    const itemCount = currentMonthRecords.reduce((sum, record) => 
      sum + record.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    
    return {
      totalSpent,
      recordCount,
      avgSpent,
      itemCount
    };
  }, [currentMonthRecords]);

  // 總統計
  const totalStats = useMemo(() => {
    const totalSpent = consumptionRecords.reduce((sum, record) => sum + record.totalAmount, 0);
    const totalRecords = consumptionRecords.length;
    const totalMonths = monthsData.length;
    
    return {
      totalSpent,
      totalRecords,
      totalMonths
    };
  }, [consumptionRecords, monthsData]);

  // 格式化月份顯示
  function formatMonthDisplay(month: string): string {
    const [year, monthNum] = month.split('-');
    return `${year}年${parseInt(monthNum)}月`;
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 格式化詳細時間
  const formatDetailTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.recordPage}>
      <div className={styles.container}>
        {/* 統計卡片 */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Receipt />
          </div>
          <h2 className={styles.summaryTitle}>累計消費記錄</h2>
          <div className={styles.summaryAmount}>
            {totalStats.totalSpent.toLocaleString()}
          </div>
          <div className={styles.summaryDesc}>一幣之力</div>
          
          <div className={styles.summaryStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{totalStats.totalRecords}</div>
              <div className={styles.statLabel}>消費次數</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{totalStats.totalMonths}</div>
              <div className={styles.statLabel}>消費月份</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {totalStats.totalRecords > 0 ? Math.round(totalStats.totalSpent / totalStats.totalRecords) : 0}
              </div>
              <div className={styles.statLabel}>平均消費</div>
            </div>
          </div>
        </div>

        {/* 月份滾動條 */}
        <div className={styles.monthScrollSection}>
          <div className={styles.monthScrollContainer}>
            <h3 className={styles.monthScrollTitle}>選擇月份</h3>
            <div className={styles.monthScrollBar}>
              {monthsData.map((monthData) => (
                <button
                  key={monthData.month}
                  className={`${styles.monthItem} ${selectedMonth === monthData.month ? styles.active : ''}`}
                  onClick={() => setSelectedMonth(monthData.month)}
                >
                  <div className={styles.monthText}>{monthData.displayName}</div>
                  <div className={styles.monthAmount}>
                    {monthData.totalSpent}幣 · {monthData.recordCount}次
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 當月統計 */}
        <div className={styles.monthStatsSection}>
          <h3 className={styles.monthStatsTitle}>{formatMonthDisplay(selectedMonth)} 消費統計</h3>
          <div className={styles.monthStatsGrid}>
            <div className={styles.monthStatItem}>
              <div className={styles.monthStatIcon}>
                <TrendingDown />
              </div>
              <div className={styles.monthStatNumber}>{currentMonthStats.totalSpent}</div>
              <div className={styles.monthStatLabel}>總消費</div>
            </div>
            <div className={styles.monthStatItem}>
              <div className={styles.monthStatIcon}>
                <ShoppingBag />
              </div>
              <div className={styles.monthStatNumber}>{currentMonthStats.recordCount}</div>
              <div className={styles.monthStatLabel}>消費次數</div>
            </div>
            <div className={styles.monthStatItem}>
              <div className={styles.monthStatIcon}>
                <Package />
              </div>
              <div className={styles.monthStatNumber}>{currentMonthStats.itemCount}</div>
              <div className={styles.monthStatLabel}>購買商品</div>
            </div>
            <div className={styles.monthStatItem}>
              <div className={styles.monthStatIcon}>
                <Coins />
              </div>
              <div className={styles.monthStatNumber}>{currentMonthStats.avgSpent}</div>
              <div className={styles.monthStatLabel}>平均消費</div>
            </div>
          </div>
        </div>

        {/* 消費記錄列表 */}
        <div className={styles.recordsSection}>
          <div className={styles.recordsHeader}>
            <h3 className={styles.recordsTitle}>消費明細</h3>
            <div className={styles.monthInfo}>
              <Calendar />
              {formatMonthDisplay(selectedMonth)}
            </div>
          </div>
          
          {currentMonthRecords.length > 0 ? (
            currentMonthRecords.map((record) => (
              <div key={record.id} className={styles.recordItem}>
                <div className={styles.recordIcon}>
                  <ShoppingBag />
                </div>
                
                <div className={styles.recordContent}>
                  <div className={styles.recordHeader}>
                    <div className={styles.recordInfo}>
                      <div className={styles.recordTitle}>
                        {record.items.map(item => item.name).join('、')}
                      </div>
                      <div className={styles.recordLocation}>
                        <MapPin />
                        {record.location}
                      </div>
                      <div className={styles.recordDate}>
                        {formatDate(record.date)} {formatDetailTime(record.timestamp)}
                      </div>
                    </div>
                    <div className={styles.recordAmount}>
                      <Coins />
                      -{record.totalAmount.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className={styles.recordDetails}>
                    <div className={styles.itemsList}>
                      {record.items.map((item, index) => (
                        <span key={index} className={styles.itemTag}>
                          {item.name} x{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <FileText />
              <div className={styles.emptyTitle}>本月暫無消費記錄</div>
              <div className={styles.emptyDesc}>
                您在 {formatMonthDisplay(selectedMonth)} 還沒有使用一幣之力消費
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Record;
