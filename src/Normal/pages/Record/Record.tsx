import React, { useState, useMemo } from 'react';
import { 
  History, 
  Heart, 
  ShoppingBag, 
  ArrowUpDown, 
  TrendingUp, 
  Calendar, 
  Filter,
  ChevronDown,
  Gift,
  Users,
  Package,
  FileText
} from 'lucide-react';
import Header from '../../components/Header/Header';
import styles from './Record.module.scss';

interface Record {
  id: string;
  amount: number;
  type: 'donation' | 'purchase' | 'transfer';
  recipient: string;
  item: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'processing';
  description: string;
}

type FilterType = 'all' | 'donation' | 'purchase' | 'transfer';
type ChartType = 'category' | 'trend';

const Record: React.FC = () => {
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [chartType, setChartType] = useState<ChartType>('category');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [sortDesc, setSortDesc] = useState(true);

  // 模擬紀錄數據
  const records: Record[] = [
    {
      id: '1',
      amount: -80,
      type: 'donation',
      recipient: '陳奶奶',
      item: '愛心便當',
      timestamp: '2024-01-20T14:30:00Z',
      status: 'completed',
      description: '為獨居老人提供營養便當'
    },
    {
      id: '2',
      amount: -150,
      type: 'purchase',
      recipient: '小明',
      item: '學習用品包',
      timestamp: '2024-01-19T10:15:00Z',
      status: 'completed',
      description: '協助弱勢學童購買文具用品'
    },
    {
      id: '3',
      amount: -45,
      type: 'donation',
      recipient: '李爺爺',
      item: '營養飲品',
      timestamp: '2024-01-18T16:45:00Z',
      status: 'completed',
      description: '提供高蛋白營養補充品'
    },
    {
      id: '4',
      amount: -120,
      type: 'purchase',
      recipient: '小華家庭',
      item: '日用品包',
      timestamp: '2024-01-17T09:20:00Z',
      status: 'processing',
      description: '基本生活用品支援'
    },
    {
      id: '5',
      amount: -200,
      type: 'transfer',
      recipient: '育幼院',
      item: '教育基金',
      timestamp: '2024-01-16T13:10:00Z',
      status: 'completed',
      description: '支持兒童教育發展'
    },
    {
      id: '6',
      amount: -300,
      type: 'donation',
      recipient: '流浪動物之家',
      item: '醫療費用',
      timestamp: '2024-01-15T11:30:00Z',
      status: 'completed',
      description: '動物醫療救助費用'
    }
  ];

  // 篩選後的紀錄
  const filteredRecords = useMemo(() => {
    let filtered = records;
    
    // 按類型篩選
    if (activeFilter !== 'all') {
      filtered = filtered.filter(record => record.type === activeFilter);
    }
    
    // 按日期範圍篩選
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.timestamp);
        const startDate = dateRange.start ? new Date(dateRange.start) : new Date('1900-01-01');
        const endDate = dateRange.end ? new Date(dateRange.end) : new Date('2100-12-31');
        return recordDate >= startDate && recordDate <= endDate;
      });
    }
    
    // 排序
    return filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortDesc ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
  }, [records, activeFilter, dateRange, sortDesc]);

  // 統計數據
  const statistics = useMemo(() => {
    const totalSpent = Math.abs(records.reduce((sum, record) => sum + record.amount, 0));
    const totalRecords = records.length;
    const donationCount = records.filter(r => r.type === 'donation').length;
    const purchaseCount = records.filter(r => r.type === 'purchase').length;
    
    return {
      totalSpent,
      totalRecords,
      donationCount,
      purchaseCount
    };
  }, [records]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'donation':
        return Heart;
      case 'purchase':
        return ShoppingBag;
      case 'transfer':
        return ArrowUpDown;
      default:
        return Gift;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'donation':
        return '愛心捐贈';
      case 'purchase':
        return '商品購買';
      case 'transfer':
        return '轉帳捐助';
      default:
        return '其他';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'pending':
        return '處理中';
      case 'processing':
        return '進行中';
      default:
        return '未知';
    }
  };

  return (
    <div className={styles.recordPage}>
      
      <div className={styles.container}>
        {/* 統計卡片 */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <div className={styles.summaryIcon}>
              <History />
            </div>
            <h2 className={styles.summaryTitle}>我的愛心足跡</h2>
          </div>
          <div className={styles.summaryStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {statistics.totalSpent.toLocaleString()}
              </div>
              <div className={styles.statLabel}>總計一幣之力</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {statistics.totalRecords}
              </div>
              <div className={styles.statLabel}>愛心次數</div>
            </div>
          </div>
        </div>

        {/* 篩選區域 */}
        <div className={styles.filterSection}>
          <div className={styles.filterHeader}>
            <h3 className={styles.filterTitle}>篩選條件</h3>
            <button 
              className={`${styles.filterToggle} ${filterExpanded ? styles.expanded : ''}`}
              onClick={() => setFilterExpanded(!filterExpanded)}
            >
              <ChevronDown />
            </button>
          </div>
          
          <div className={`${styles.filterContent} ${filterExpanded ? styles.expanded : ''}`}>
            <div className={styles.filterTabs}>
              {[
                { key: 'all', label: '全部' },
                { key: 'donation', label: '捐贈' },
                { key: 'purchase', label: '購買' },
                { key: 'transfer', label: '轉帳' }
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
            
            <div className={styles.dateRange}>
              <input
                type="date"
                className={styles.dateInput}
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <input
                type="date"
                className={styles.dateInput}
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* 圖表區域 */}
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>統計分析</h3>
            <div className={styles.chartToggle}>
              <button 
                className={`${styles.chartToggleBtn} ${chartType === 'category' ? styles.active : ''}`}
                onClick={() => setChartType('category')}
              >
                分類
              </button>
              <button 
                className={`${styles.chartToggleBtn} ${chartType === 'trend' ? styles.active : ''}`}
                onClick={() => setChartType('trend')}
              >
                趨勢
              </button>
            </div>
          </div>
          
          <div className={styles.chartContainer}>
            <div className={styles.chartPlaceholder}>
              圖表功能開發中...
            </div>
          </div>
          
          <div className={styles.quickStats}>
            <div className={styles.quickStatItem}>
              <div className={styles.quickStatIcon}>
                <Heart />
              </div>
              <div className={styles.quickStatNumber}>
                {statistics.donationCount}
              </div>
              <div className={styles.quickStatLabel}>捐贈次數</div>
            </div>
            <div className={styles.quickStatItem}>
              <div className={styles.quickStatIcon}>
                <ShoppingBag />
              </div>
              <div className={styles.quickStatNumber}>
                {statistics.purchaseCount}
              </div>
              <div className={styles.quickStatLabel}>購買次數</div>
            </div>
            <div className={styles.quickStatItem}>
              <div className={styles.quickStatIcon}>
                <Users />
              </div>
              <div className={styles.quickStatNumber}>
                {new Set(records.map(r => r.recipient)).size}
              </div>
              <div className={styles.quickStatLabel}>受助人數</div>
            </div>
          </div>
        </div>

        {/* 紀錄列表 */}
        <div className={styles.recordList}>
          <div className={styles.recordHeader}>
            <h3 className={styles.recordTitle}>詳細紀錄</h3>
            <button 
              className={styles.sortBtn}
              onClick={() => setSortDesc(!sortDesc)}
            >
              <Calendar />
              {sortDesc ? '最新' : '最舊'}
            </button>
          </div>
          
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => {
              const IconComponent = getRecordIcon(record.type);
              return (
                <div key={record.id} className={styles.recordItem}>
                  <div className={`${styles.recordIcon} ${styles[record.type]}`}>
                    <IconComponent />
                  </div>
                  
                  <div className={styles.recordContent}>
                    <div className={styles.recordMain}>
                      <div className={styles.recordInfo}>
                        <div className={styles.recordTitle}>
                          {getTypeLabel(record.type)} - {record.item}
                        </div>
                        <div className={styles.recordDesc}>
                          受助者：{record.recipient} • {record.description}
                        </div>
                      </div>
                      <div className={`${styles.recordAmount} ${record.amount < 0 ? styles.negative : styles.positive}`}>
                        {record.amount < 0 ? '-' : '+'}{Math.abs(record.amount)}
                      </div>
                    </div>
                    
                    <div className={styles.recordMeta}>
                      <span className={styles.recordDate}>
                        {formatDate(record.timestamp)}
                      </span>
                      <span className={`${styles.recordStatus} ${styles[record.status]}`}>
                        {getStatusLabel(record.status)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <FileText />
              <div className={styles.emptyTitle}>暫無紀錄</div>
              <div className={styles.emptyDesc}>
                目前沒有符合條件的愛心紀錄<br />
                快去幫助需要的人吧！
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Record;
