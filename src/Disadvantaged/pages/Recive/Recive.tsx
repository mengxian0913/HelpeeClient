import React, { useState, useMemo, useEffect } from 'react';
import { 
  Gift, 
  Calendar, 
  ArrowUpDown, 
  ChevronDown,
  X,
  Coins,
  User,
  Heart,
  FileText,
  Filter,
  Clock,
  ArrowRight,
  Check,
  RotateCcw
} from 'lucide-react';
import Header from '../../components/Header/Header';
import styles from './Recive.module.css';

interface Donor {
  id: string;
  name: string;
  amount: number;
  timestamp: string;
  isAnonymous?: boolean;
}

interface ReceiveRecord {
  id: string;
  amount: number;
  timestamp: string;
  type: 'government' | 'donation' | 'emergency';
  description: string;
  donors: Donor[];
  reference?: string;
}

type FilterPeriod = 'all' | 'today' | 'week' | 'month' | 'year';

const Recive: React.FC = () => {
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReceiveRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortDesc, setSortDesc] = useState(true);
  const [activePeriod, setActivePeriod] = useState<FilterPeriod>('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // 模擬接收記錄數據 - 橫跨六個月
  const receiveRecords: ReceiveRecord[] = [
    // 2024年1月
    {
      id: '1',
      amount: 850,
      timestamp: '2024-01-28T09:30:00Z',
      type: 'government',
      description: '政府生活補助代幣',
      donors: [
        {
          id: 'gov1',
          name: '政府補助系統',
          amount: 850,
          timestamp: '2024-01-28T09:30:00Z'
        }
      ],
      reference: 'GOV-2024-001234'
    },
    {
      id: '2',
      amount: 320,
      timestamp: '2024-01-25T15:20:00Z',
      type: 'donation',
      description: '愛心天使捐贈代幣',
      donors: [
        {
          id: 'd1',
          name: '王小明',
          amount: 200,
          timestamp: '2024-01-25T15:20:00Z'
        },
        {
          id: 'd2',
          name: '李小華',
          amount: 120,
          timestamp: '2024-01-25T15:18:00Z'
        }
      ]
    },
    {
      id: '3',
      amount: 500,
      timestamp: '2024-01-22T11:45:00Z',
      type: 'donation',
      description: '社區愛心活動捐贈',
      donors: [
        {
          id: 'd3',
          name: '張大同',
          amount: 300,
          timestamp: '2024-01-22T11:45:00Z'
        },
        {
          id: 'd4',
          name: '愛心媽媽',
          amount: 200,
          timestamp: '2024-01-22T11:42:00Z',
          isAnonymous: true
        }
      ]
    },
    {
      id: '4',
      amount: 1200,
      timestamp: '2024-01-15T14:10:00Z',
      type: 'emergency',
      description: '急難救助代幣',
      donors: [
        {
          id: 'emergency1',
          name: '急難救助基金',
          amount: 1200,
          timestamp: '2024-01-15T14:10:00Z'
        }
      ],
      reference: 'EMG-2024-005678'
    },
    {
      id: '5',
      amount: 680,
      timestamp: '2024-01-08T10:30:00Z',
      type: 'donation',
      description: '企業愛心捐贈',
      donors: [
        {
          id: 'd5',
          name: '好心企業',
          amount: 400,
          timestamp: '2024-01-08T10:30:00Z'
        },
        {
          id: 'd6',
          name: '員工愛心基金',
          amount: 280,
          timestamp: '2024-01-08T10:28:00Z'
        }
      ]
    },
    {
      id: '6',
      amount: 450,
      timestamp: '2024-01-03T16:45:00Z',
      type: 'donation',
      description: '新年愛心捐贈',
      donors: [
        {
          id: 'd7',
          name: '陳阿姨',
          amount: 250,
          timestamp: '2024-01-03T16:45:00Z'
        },
        {
          id: 'd8',
          name: '林先生',
          amount: 200,
          timestamp: '2024-01-03T16:40:00Z'
        }
      ]
    },

    // 2023年12月
    {
      id: '7',
      amount: 1000,
      timestamp: '2023-12-28T09:00:00Z',
      type: 'government',
      description: '政府生活補助代幣',
      donors: [
        {
          id: 'gov2',
          name: '政府補助系統',
          amount: 1000,
          timestamp: '2023-12-28T09:00:00Z'
        }
      ],
      reference: 'GOV-2023-012345'
    },
    {
      id: '8',
      amount: 580,
      timestamp: '2023-12-22T14:30:00Z',
      type: 'donation',
      description: '聖誕節愛心捐贈',
      donors: [
        {
          id: 'd9',
          name: '聖誕老公公',
          amount: 300,
          timestamp: '2023-12-22T14:30:00Z',
          isAnonymous: true
        },
        {
          id: 'd10',
          name: '愛心教會',
          amount: 280,
          timestamp: '2023-12-22T14:25:00Z'
        }
      ]
    },
    {
      id: '9',
      amount: 750,
      timestamp: '2023-12-18T11:20:00Z',
      type: 'donation',
      description: '冬季關懷活動',
      donors: [
        {
          id: 'd11',
          name: '志工團隊',
          amount: 400,
          timestamp: '2023-12-18T11:20:00Z'
        },
        {
          id: 'd12',
          name: '慈善基金會',
          amount: 350,
          timestamp: '2023-12-18T11:15:00Z'
        }
      ]
    },
    {
      id: '10',
      amount: 300,
      timestamp: '2023-12-10T15:45:00Z',
      type: 'donation',
      description: '個人愛心捐贈',
      donors: [
        {
          id: 'd13',
          name: '黃小姐',
          amount: 300,
          timestamp: '2023-12-10T15:45:00Z'
        }
      ]
    },
    {
      id: '11',
      amount: 2000,
      timestamp: '2023-12-05T10:00:00Z',
      type: 'emergency',
      description: '醫療急難救助',
      donors: [
        {
          id: 'emergency2',
          name: '醫療救助基金',
          amount: 2000,
          timestamp: '2023-12-05T10:00:00Z'
        }
      ],
      reference: 'EMG-2023-009876'
    },

    // 2023年11月
    {
      id: '12',
      amount: 850,
      timestamp: '2023-11-28T09:30:00Z',
      type: 'government',
      description: '政府生活補助代幣',
      donors: [
        {
          id: 'gov3',
          name: '政府補助系統',
          amount: 850,
          timestamp: '2023-11-28T09:30:00Z'
        }
      ],
      reference: 'GOV-2023-011234'
    },
    {
      id: '13',
      amount: 420,
      timestamp: '2023-11-20T13:15:00Z',
      type: 'donation',
      description: '感恩節愛心活動',
      donors: [
        {
          id: 'd14',
          name: '感恩基金會',
          amount: 250,
          timestamp: '2023-11-20T13:15:00Z'
        },
        {
          id: 'd15',
          name: '社區居民',
          amount: 170,
          timestamp: '2023-11-20T13:10:00Z'
        }
      ]
    },
    {
      id: '14',
      amount: 600,
      timestamp: '2023-11-15T16:30:00Z',
      type: 'donation',
      description: '企業回饋活動',
      donors: [
        {
          id: 'd16',
          name: '科技公司',
          amount: 600,
          timestamp: '2023-11-15T16:30:00Z'
        }
      ]
    },
    {
      id: '15',
      amount: 380,
      timestamp: '2023-11-08T12:45:00Z',
      type: 'donation',
      description: '學校愛心義賣',
      donors: [
        {
          id: 'd17',
          name: '國小師生',
          amount: 200,
          timestamp: '2023-11-08T12:45:00Z'
        },
        {
          id: 'd18',
          name: '家長會',
          amount: 180,
          timestamp: '2023-11-08T12:40:00Z'
        }
      ]
    },

    // 2023年10月
    {
      id: '16',
      amount: 900,
      timestamp: '2023-10-28T09:00:00Z',
      type: 'government',
      description: '政府生活補助代幣',
      donors: [
        {
          id: 'gov4',
          name: '政府補助系統',
          amount: 900,
          timestamp: '2023-10-28T09:00:00Z'
        }
      ],
      reference: 'GOV-2023-010123'
    },
    {
      id: '17',
      amount: 520,
      timestamp: '2023-10-22T14:20:00Z',
      type: 'donation',
      description: '重陽節敬老活動',
      donors: [
        {
          id: 'd19',
          name: '敬老協會',
          amount: 300,
          timestamp: '2023-10-22T14:20:00Z'
        },
        {
          id: 'd20',
          name: '青年志工',
          amount: 220,
          timestamp: '2023-10-22T14:15:00Z'
        }
      ]
    },
    {
      id: '18',
      amount: 1500,
      timestamp: '2023-10-15T11:30:00Z',
      type: 'emergency',
      description: '颱風災後救助',
      donors: [
        {
          id: 'emergency3',
          name: '災害救助基金',
          amount: 1500,
          timestamp: '2023-10-15T11:30:00Z'
        }
      ],
      reference: 'EMG-2023-007654'
    },
    {
      id: '19',
      amount: 340,
      timestamp: '2023-10-10T17:00:00Z',
      type: 'donation',
      description: '國慶日愛心捐贈',
      donors: [
        {
          id: 'd21',
          name: '愛國人士',
          amount: 340,
          timestamp: '2023-10-10T17:00:00Z',
          isAnonymous: true
        }
      ]
    },

    // 2023年9月
    {
      id: '20',
      amount: 850,
      timestamp: '2023-09-28T09:30:00Z',
      type: 'government',
      description: '政府生活補助代幣',
      donors: [
        {
          id: 'gov5',
          name: '政府補助系統',
          amount: 850,
          timestamp: '2023-09-28T09:30:00Z'
        }
      ],
      reference: 'GOV-2023-009123'
    },
    {
      id: '21',
      amount: 460,
      timestamp: '2023-09-18T15:40:00Z',
      type: 'donation',
      description: '中秋節團圓活動',
      donors: [
        {
          id: 'd22',
          name: '月餅工廠',
          amount: 260,
          timestamp: '2023-09-18T15:40:00Z'
        },
        {
          id: 'd23',
          name: '社區管委會',
          amount: 200,
          timestamp: '2023-09-18T15:35:00Z'
        }
      ]
    },
    {
      id: '22',
      amount: 320,
      timestamp: '2023-09-10T10:20:00Z',
      type: 'donation',
      description: '教師節感恩活動',
      donors: [
        {
          id: 'd24',
          name: '退休教師',
          amount: 180,
          timestamp: '2023-09-10T10:20:00Z'
        },
        {
          id: 'd25',
          name: '學生家長',
          amount: 140,
          timestamp: '2023-09-10T10:15:00Z'
        }
      ]
    },
    {
      id: '23',
      amount: 280,
      timestamp: '2023-09-05T13:50:00Z',
      type: 'donation',
      description: '開學關懷活動',
      donors: [
        {
          id: 'd26',
          name: '文具店老闆',
          amount: 280,
          timestamp: '2023-09-05T13:50:00Z'
        }
      ]
    },

    // 2023年8月
    {
      id: '24',
      amount: 800,
      timestamp: '2023-08-28T09:15:00Z',
      type: 'government',
      description: '政府生活補助代幣',
      donors: [
        {
          id: 'gov6',
          name: '政府補助系統',
          amount: 800,
          timestamp: '2023-08-28T09:15:00Z'
        }
      ],
      reference: 'GOV-2023-008123'
    },
    {
      id: '25',
      amount: 550,
      timestamp: '2023-08-20T16:25:00Z',
      type: 'donation',
      description: '夏日送清涼活動',
      donors: [
        {
          id: 'd27',
          name: '飲料店聯盟',
          amount: 350,
          timestamp: '2023-08-20T16:25:00Z'
        },
        {
          id: 'd28',
          name: '冰品製造商',
          amount: 200,
          timestamp: '2023-08-20T16:20:00Z'
        }
      ]
    },
    {
      id: '26',
      amount: 1200,
      timestamp: '2023-08-12T11:00:00Z',
      type: 'emergency',
      description: '熱浪急難救助',
      donors: [
        {
          id: 'emergency4',
          name: '氣候災害基金',
          amount: 1200,
          timestamp: '2023-08-12T11:00:00Z'
        }
      ],
      reference: 'EMG-2023-006543'
    },
    {
      id: '27',
      amount: 380,
      timestamp: '2023-08-08T14:30:00Z',
      type: 'donation',
      description: '父親節感恩活動',
      donors: [
        {
          id: 'd29',
          name: '單親爸爸互助會',
          amount: 200,
          timestamp: '2023-08-08T14:30:00Z'
        },
        {
          id: 'd30',
          name: '社工團體',
          amount: 180,
          timestamp: '2023-08-08T14:25:00Z'
        }
      ]
    },
    {
      id: '28',
      amount: 420,
      timestamp: '2023-08-01T09:45:00Z',
      type: 'donation',
      description: '八月關懷專案',
      donors: [
        {
          id: 'd31',
          name: '關懷基金會',
          amount: 420,
          timestamp: '2023-08-01T09:45:00Z'
        }
      ]
    }
  ];

  // 篩選後的記錄
  const filteredRecords = useMemo(() => {
    let filtered = receiveRecords;
    
    // 按期間篩選
    if (activePeriod !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (activePeriod) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(record => 
        new Date(record.timestamp) >= startDate
      );
    }
    
    // 按自定義日期範圍篩選
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
  }, [receiveRecords, activePeriod, dateRange, sortDesc]);

  // 統計數據
  const statistics = useMemo(() => {
    const totalAmount = receiveRecords.reduce((sum, record) => sum + record.amount, 0);
    const totalRecords = receiveRecords.length;
    const totalDonors = new Set(
      receiveRecords.flatMap(record => 
        record.donors.filter(donor => !donor.name.includes('政府') && !donor.name.includes('基金'))
                    .map(donor => donor.id)
      )
    ).size;
    
    return {
      totalAmount,
      totalRecords,
      totalDonors
    };
  }, [receiveRecords]);

  // 開啟詳情
  const handleRecordClick = (record: ReceiveRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  // 關閉 Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  // 點擊遮罩關閉 Modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // 格式化日期
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 格式化詳細日期
  const formatDetailDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 獲取類型標籤
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'government':
        return '政府補助';
      case 'donation':
        return '愛心捐贈';
      case 'emergency':
        return '急難救助';
      default:
        return '其他';
    }
  };

  // 阻止滾動穿透
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // 處理快速篩選
  const handleQuickFilter = (period: FilterPeriod) => {
    setActivePeriod(period);
    if (period !== 'all') {
      setDateRange({ start: '', end: '' }); // 清除自訂日期
    }
    updateFilterStatus();
  };

  // 處理自訂日期變更
  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
    if (value) {
      setActivePeriod('all'); // 清除快速篩選
    }
    updateFilterStatus();
  };

  // 清除所有篩選
  const clearFilters = () => {
    setActivePeriod('all');
    setDateRange({ start: '', end: '' });
    setHasActiveFilters(false);
  };

  // 更新篩選狀態
  const updateFilterStatus = () => {
    const hasFilters = activePeriod !== 'all' || dateRange.start || dateRange.end;
    setHasActiveFilters(Boolean(hasFilters));
  };

  // 獲取篩選摘要
  const getFilterSummary = () => {
    if (!hasActiveFilters) return null;
    
    if (activePeriod !== 'all') {
      const labels: Record<FilterPeriod, string> = {
        all: '',
        today: '今天',
        week: '最近一週',
        month: '最近一月',
        year: '最近一年'
      };
      return `篩選條件：${labels[activePeriod]}`;
    }
    
    if (dateRange.start || dateRange.end) {
      const start = dateRange.start ? new Date(dateRange.start).toLocaleDateString() : '不限';
      const end = dateRange.end ? new Date(dateRange.end).toLocaleDateString() : '不限';
      return `篩選條件：${start} ~ ${end}`;
    }
    
    return null;
  };

  return (
    <div className={styles.recivePage}>
      <div className={styles.container}>
        {/* 統計卡片 */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Gift />
          </div>
          <h2 className={styles.summaryTitle}>累計收到代幣</h2>
          <div className={styles.summaryAmount}>
            {statistics.totalAmount.toLocaleString()}
          </div>
          <div className={styles.summaryDesc}>一幣之力</div>
          
          <div className={styles.summaryStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{statistics.totalRecords}</div>
              <div className={styles.statLabel}>接收次數</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{statistics.totalDonors}</div>
              <div className={styles.statLabel}>愛心人數</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {Math.round(statistics.totalAmount / statistics.totalRecords)}
              </div>
              <div className={styles.statLabel}>平均金額</div>
            </div>
          </div>
        </div>

        {/* 篩選區域 */}
        <div className={styles.filterSection}>
          <div 
            className={styles.filterHeader}
            onClick={() => setFilterExpanded(!filterExpanded)}
          >
            <h3 className={styles.filterTitle}>
              <Filter />
              篩選條件
            </h3>
            <button 
              className={`${styles.filterToggle} ${filterExpanded ? styles.expanded : ''}`}
            >
              <ChevronDown />
            </button>
          </div>
          
          <div className={`${styles.filterContent} ${filterExpanded ? styles.expanded : ''}`}>
            {/* 快速篩選 */}
            <div className={styles.filterRow}>
              <div className={styles.filterLabel}>
                <Clock />
                快速篩選
              </div>
              <div className={styles.quickFilters}>
                {[
                  { key: 'all', label: '全部', icon: null },
                  { key: 'today', label: '今天', icon: Calendar },
                  { key: 'week', label: '一週', icon: Calendar },
                  { key: 'month', label: '一月', icon: Calendar },
                  { key: 'year', label: '一年', icon: Calendar }
                ].map(filter => (
                  <button
                    key={filter.key}
                    className={`${styles.quickFilterBtn} ${activePeriod === filter.key ? styles.active : ''}`}
                    onClick={() => handleQuickFilter(filter.key as FilterPeriod)}
                  >
                    {filter.icon && <filter.icon />}
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 自訂日期範圍 */}
            <div className={styles.filterRow}>
              <div className={styles.filterLabel}>
                <Calendar />
                自訂日期範圍
              </div>
              <div className={styles.dateRange}>
                <div className={styles.dateInputWrapper}>
                  <div className={styles.dateInputLabel}>開始日期</div>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={dateRange.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    placeholder="選擇開始日期"
                  />
                </div>
                <div className={styles.dateSeparator}>
                  <ArrowRight />
                </div>
                <div className={styles.dateInputWrapper}>
                  <div className={styles.dateInputLabel}>結束日期</div>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={dateRange.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    placeholder="選擇結束日期"
                  />
                </div>
              </div>
            </div>
            
            {/* 操作按鈕 */}
            {hasActiveFilters && (
              <div className={styles.filterActions}>
                <button 
                  className={styles.clearBtn}
                  onClick={clearFilters}
                >
                  <RotateCcw />
                  清除篩選
                </button>
                <button 
                  className={styles.applyBtn}
                  onClick={() => setFilterExpanded(false)}
                >
                  <Check />
                  確認篩選
                </button>
              </div>
            )}
          </div>
          
          {/* 篩選摘要 */}
          {hasActiveFilters && !filterExpanded && (
            <div className={styles.filterSummary}>
              <Filter />
              {getFilterSummary()}
            </div>
          )}
        </div>

        {/* 歷史記錄 */}
        <div className={styles.historySection}>
          <div className={styles.historyHeader}>
            <h3 className={styles.historyTitle}>接收記錄</h3>
            <button 
              className={styles.sortBtn}
              onClick={() => setSortDesc(!sortDesc)}
            >
              <Calendar />
              {sortDesc ? '最新' : '最舊'}
            </button>
          </div>
          
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <div 
                key={record.id} 
                className={styles.historyItem}
                onClick={() => handleRecordClick(record)}
              >
                <div className={styles.historyIcon}>
                  <Coins />
                </div>
                
                <div className={styles.historyContent}>
                  <div className={styles.historyMain}>
                    <div className={styles.historyInfo}>
                      <div className={styles.historyTitle}>
                        {record.description}
                      </div>
                      <div className={styles.historyDesc}>
                        共 {record.donors.length} 位捐贈者
                      </div>
                    </div>
                    <div className={styles.historyAmount}>
                      <Coins />
                      +{record.amount.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className={styles.historyMeta}>
                    <span className={styles.historyDate}>
                      {formatDate(record.timestamp)}
                    </span>
                    <span className={`${styles.historySource} ${styles[record.type]}`}>
                      {getTypeLabel(record.type)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <FileText />
              <div className={styles.emptyTitle}>暫無記錄</div>
              <div className={styles.emptyDesc}>
                目前沒有符合條件的接收記錄
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 詳情 Modal */}
      {isModalOpen && selectedRecord && (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
          <div className={`${styles.modal} ${isModalOpen ? styles.open : ''}`}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>代幣詳情</h2>
              <button className={styles.closeBtn} onClick={handleCloseModal}>
                <X />
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.modalSummary}>
                <div className={styles.modalAmount}>
                  <Coins />
                  {selectedRecord.amount.toLocaleString()}
                </div>
                <div className={styles.modalDate}>
                  {formatDetailDate(selectedRecord.timestamp)}
                </div>
                <span className={`${styles.modalType} ${styles[selectedRecord.type]}`}>
                  {getTypeLabel(selectedRecord.type)}
                </span>
              </div>
              
              <div className={styles.donorsSection}>
                <h3 className={styles.donorsTitle}>捐贈者詳情</h3>
                {selectedRecord.donors.map((donor) => (
                  <div key={donor.id} className={styles.donorItem}>
                    <div className={styles.donorAvatar}>
                      {donor.isAnonymous ? <Heart /> : <User />}
                    </div>
                    <div className={styles.donorInfo}>
                      <div className={styles.donorName}>
                        {donor.isAnonymous ? '匿名愛心天使' : donor.name}
                      </div>
                      <div className={styles.donorTime}>
                        {formatDate(donor.timestamp)}
                      </div>
                    </div>
                    <div className={styles.donorAmount}>
                      <Coins />
                      {donor.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedRecord.reference && (
                <div className={styles.referenceSection}>
                  <div className={styles.referenceLabel}>參考編號</div>
                  <div className={styles.referenceNumber}>{selectedRecord.reference}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recive;
