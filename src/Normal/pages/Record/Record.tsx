import React, { useState, useMemo, useEffect } from "react";
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
  FileText,
} from "lucide-react";
import Header from "../../components/Header/Header";
import styles from "./Record.module.scss";
import { apiGetProductHistory } from "@/Normal/API/product";
import { useDispatch } from "react-redux";
import { setLoading1 } from "@/state/loading/loading";

interface Record {
  id: string;
  amount: number;
  itemName: string;
  timestamp: string;
}

type FilterType = "all" | "recent" | "thisMonth" | "lastMonth";

const Record: React.FC = () => {
  const dispatch = useDispatch();
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [sortDesc, setSortDesc] = useState(true);
  const [records, setRecords] = useState<Record[]>([]);

  const handleGetProductRecords = async () => {
    try {
      dispatch(setLoading1(true));
      const res = await apiGetProductHistory();
      setRecords(res);
    } catch (err) {
      console.error("獲取產品紀錄失敗:", err);
      alert("無法獲取購買紀錄，請稍後再試");
    } finally {
      dispatch(setLoading1(false));
    }
  };

  useEffect(() => {
    handleGetProductRecords();
  }, []);

  // 篩選後的紀錄
  const filteredRecords = useMemo(() => {
    let filtered = records;

    // 按時間範圍篩選
    if (activeFilter !== "all") {
      const now = new Date();
      let startDate: Date;

      switch (activeFilter) {
        case "recent":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 最近7天
          break;
        case "thisMonth":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "lastMonth":
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
          filtered = filtered.filter((record) => {
            const recordDate = new Date(record.timestamp);
            return recordDate >= startDate && recordDate <= endDate;
          });
          break;
        default:
          startDate = new Date(0);
      }

      if (activeFilter !== "lastMonth") {
        filtered = filtered.filter((record) => {
          const recordDate = new Date(record.timestamp);
          return recordDate >= startDate;
        });
      }
    }

    // 按自定義日期範圍篩選
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.timestamp);
        const startDate = dateRange.start
          ? new Date(dateRange.start)
          : new Date("1900-01-01");
        const endDate = dateRange.end
          ? new Date(dateRange.end)
          : new Date("2100-12-31");
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    // 排序
    return filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortDesc
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });
  }, [records, activeFilter, dateRange, sortDesc]);

  // 統計數據
  const statistics = useMemo(() => {
    const totalSpent = Math.abs(
      records.reduce((sum, record) => sum + record.amount, 0)
    );
    const totalRecords = records.length;
    const uniqueItems = new Set(records.map((r) => r.itemName)).size;
    const totalItems = records.reduce((sum, record) => sum + Math.abs(record.amount), 0);

    return {
      totalSpent,
      totalRecords,
      uniqueItems,
      totalItems,
    };
  }, [records]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const getRecordIcon = () => {
    return ShoppingBag; // 統一使用購物圖標，因為都是購買紀錄
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
            <h2 className={styles.summaryTitle}>我的購買紀錄</h2>
          </div>
          <div className={styles.summaryStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {statistics.totalSpent.toLocaleString()}
              </div>
              <div className={styles.statLabel}>總花費一幣之力</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{statistics.totalRecords}</div>
              <div className={styles.statLabel}>購買次數</div>
            </div>
          </div>
        </div>

        {/* 篩選區域 */}
        <div className={styles.filterSection}>
          <div className={styles.filterHeader}>
            <h3 className={styles.filterTitle}>篩選條件</h3>
            <button
              className={`${styles.filterToggle} ${
                filterExpanded ? styles.expanded : ""
              }`}
              onClick={() => setFilterExpanded(!filterExpanded)}
            >
              <ChevronDown />
            </button>
          </div>

          <div
            className={`${styles.filterContent} ${
              filterExpanded ? styles.expanded : ""
            }`}
          >
            <div className={styles.filterTabs}>
              {[
                { key: "all", label: "全部" },
                { key: "recent", label: "最近7天" },
                { key: "thisMonth", label: "本月" },
                { key: "lastMonth", label: "上月" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  className={`${styles.filterTab} ${
                    activeFilter === filter.key ? styles.active : ""
                  }`}
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
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
              />
              <input
                type="date"
                className={styles.dateInput}
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        {/* 快速統計 */}
        <div className={styles.quickStats}>
          <div className={styles.quickStatItem}>
            <div className={styles.quickStatIcon}>
              <ShoppingBag />
            </div>
            <div className={styles.quickStatNumber}>
              {statistics.totalRecords}
            </div>
            <div className={styles.quickStatLabel}>購買次數</div>
          </div>
          <div className={styles.quickStatItem}>
            <div className={styles.quickStatIcon}>
              <Package />
            </div>
            <div className={styles.quickStatNumber}>
              {statistics.uniqueItems}
            </div>
            <div className={styles.quickStatLabel}>不同商品</div>
          </div>
          <div className={styles.quickStatItem}>
            <div className={styles.quickStatIcon}>
              <Gift />
            </div>
            <div className={styles.quickStatNumber}>
              {statistics.totalItems}
            </div>
            <div className={styles.quickStatLabel}>商品總量</div>
          </div>
        </div>

        {/* 紀錄列表 */}
        <div className={styles.recordList}>
          <div className={styles.recordHeader}>
            <h3 className={styles.recordTitle}>購買明細</h3>
            <button
              className={styles.sortBtn}
              onClick={() => setSortDesc(!sortDesc)}
            >
              <Calendar />
              {sortDesc ? "最新" : "最舊"}
            </button>
          </div>

          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => {
              const IconComponent = getRecordIcon();

              return (
                <div key={record.id} className={styles.recordItem}>
                  <div className={`${styles.recordIcon} ${styles.purchase}`}>
                    <IconComponent />
                  </div>

                  <div className={styles.recordContent}>
                    <div className={styles.recordMain}>
                      <div className={styles.recordInfo}>
                        <div className={styles.recordTitle}>{record.itemName}</div>
                        <div className={styles.recordDesc}>
                          購買數量：{Math.abs(record.amount)} 個
                        </div>
                      </div>
                      <div className={`${styles.recordAmount} ${styles.negative}`}>
                        {record.amount < 0 ? "-" : "+"}
                        {Math.abs(record.amount).toLocaleString()}
                      </div>
                    </div>

                    <div className={styles.recordMeta}>
                      <span className={styles.recordDate}>
                        {formatDate(record.timestamp)}
                      </span>
                      <span className={`${styles.recordStatus} ${styles.completed}`}>
                        已完成
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <FileText />
              <div className={styles.emptyTitle}>暫無購買紀錄</div>
              <div className={styles.emptyDesc}>
                您還沒有購買過任何商品
                <br />
                快去愛心商城看看吧！
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Record;
