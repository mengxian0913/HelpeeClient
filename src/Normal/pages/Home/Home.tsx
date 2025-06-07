import React from "react";
import {
  Heart,
  ShoppingBag,
  Users,
  TrendingUp,
  Gift,
  ArrowRight,
  Bell,
  Package,
  Coins,
} from "lucide-react";
import Header from "../../components/Header/Header";
import styles from "./Home.module.scss";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  
  const navigation = useNavigate();

  const handleDonateClick = () => {
    navigation("/donations");
    console.log("前往捐贈頁面");
  };

  const handleShopClick = () => {
    navigation("/shop");
    console.log("前往愛心商城");
  };

  const handleCartClick = () => {
    console.log("開啟購物車");
  };

  const stats = [
    { icon: Heart, number: "128", label: "一幣之力捐贈" },
    { icon: Users, number: "45", label: "幫助人數" },
    { icon: ShoppingBag, number: "23", label: "愛心兌換" },
    { icon: TrendingUp, number: "5★", label: "愛心等級" },
  ];

  const news = [
    {
      icon: Gift,
      text: "感謝您的愛心代幣捐贈，已成功幫助3位需要的朋友",
      time: "2小時前",
    },
    {
      icon: Package,
      text: "您用一幣之力兌換的愛心便當已送達受助者手中",
      time: "5小時前",
    },
    {
      icon: Bell,
      text: "新的愛心代幣活動開始了，快來獲得更多一幣之力！",
      time: "1天前",
    },
  ];

  const products = [
    { name: "愛心便當", price: "80幣", icon: Package },
    { name: "營養飲品", price: "45幣", icon: Gift },
    { name: "日用品包", price: "120幣", icon: ShoppingBag },
    { name: "學習用品", price: "200幣", icon: Package },
  ];

  return (
    <div className={styles.homePage}>

      {/* 問候區域 */}
      <section className={styles.greetingSection}>
        <div className={styles.greetingContent}>
          <div className={styles.greeting}>早安！</div>
          <div className={styles.userName}>愛心天使 王小明</div>
          <div className={styles.userBalance}>
            <Coins />
            <span>一幣之力餘額: 1,250 幣</span>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* 快速操作 */}
        <section className={styles.quickActions}>
          <button className={styles.actionCard} onClick={handleDonateClick}>
            <div className={styles.actionIcon}>
              <Heart />
            </div>
            <div className={styles.actionTitle}>獲得代幣</div>
            <div className={styles.actionDesc}>購買一幣之力</div>
          </button>

          <button
            className={`${styles.actionCard} ${styles.secondary}`}
            onClick={handleShopClick}
          >
            <div className={styles.actionIcon}>
              <ShoppingBag />
            </div>
            <div className={styles.actionTitle}>愛心兌換</div>
            <div className={styles.actionDesc}>用代幣換取愛心</div>
          </button>
        </section>

        {/* 統計數據 */}
        <section className={styles.statsCard}>
          <h3 className={styles.statsTitle}>我的愛心代幣足跡</h3>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statIcon}>
                  <stat.icon />
                </div>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 最新消息 */}
        <section className={styles.newsSection}>
          <h3 className={styles.newsTitle}>最新消息</h3>
          {news.map((item, index) => (
            <div key={index} className={styles.newsItem}>
              <div className={styles.newsIcon}>
                <item.icon />
              </div>
              <div className={styles.newsContent}>
                <div className={styles.newsText}>{item.text}</div>
                <div className={styles.newsTime}>{item.time}</div>
              </div>
            </div>
          ))}
        </section>

        {/* 推薦商品 */}
        <section className={styles.recommendSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>推薦兌換</h3>
            <a href="/shop" className={styles.viewMore}>
              查看更多 <ArrowRight />
            </a>
          </div>
          <div className={styles.productGrid}>
            {products.map((product, index) => (
              <div key={index} className={styles.productCard}>
                <div className={styles.productImage}>
                  <product.icon />
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.productName}>{product.name}</div>
                  <div className={styles.productPrice}>{product.price}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
