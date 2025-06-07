import React from "react";
import {
  Heart,
  Gift,
  ShoppingBag,
  User,
  HelpCircle,
  AlertTriangle,
  Coins,
  ArrowRight,
  MapPin,
  Bell,
  FileText
} from "lucide-react";
import Header from "../../components/Header/Header";
import styles from "./Home.module.scss";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigation = useNavigate();

  const handleBalanceClick = () => {
    console.log("查看餘額詳情");
  };

  const handleNotificationClick = () => {
    console.log("查看通知");
  };

  const handleReceiveClick = () => {
    navigation("/receive");
    console.log("前往接收補助頁面");
  };

  const handleShopClick = () => {
    navigation("/shop");
    console.log("前往購物頁面");
  };

  const handleProfileClick = () => {
    navigation("/profile");
    console.log("前往個人設定");
  };

  const handleHelpClick = () => {
    console.log("前往幫助中心");
  };

  // 最近補助記錄
  const recentSupports = [
    {
      icon: Gift,
      text: "政府生活補助代幣",
      time: "今天 09:30",
      amount: 3000
    },
    {
      icon: Heart,
      text: "愛心天使捐贈代幣",
      time: "昨天 15:20",
      amount: 500
    },
    {
      icon: Gift,
      text: "急難救助代幣",
      time: "3天前",
      amount: 2000
    }
  ];

  // 政府公告
  const announcements = [
    {
      icon: Bell,
      text: "本月生活補助代幣已發放，請至指定據點領取或查看帳戶餘額",
      time: "1小時前"
    },
    {
      icon: FileText,
      text: "新增合作商店：全聯福利中心，現可使用一幣之力購買",
      time: "2天前"
    },
    {
      icon: MapPin,
      text: "社福據點服務時間異動通知",
      time: "1週前"
    }
  ];

  // 附近服務據點
  const servicePoints = [
    {
      name: "中正區社福中心",
      address: "台北市中正區重慶南路一段122號",
      status: "open"
    },
    {
      name: "萬華區公所",
      address: "台北市萬華區長沙街二段171號",
      status: "open"
    },
    {
      name: "大同區服務處",
      address: "台北市大同區昌吉街57號",
      status: "closed"
    }
  ];

  return (
    <div className={styles.homePage}>

      {/* 歡迎區域 */}
      <section className={styles.welcomeSection}>
        <div className={styles.welcomeContent}>
          <div className={styles.greeting}>早安！</div>
          <div className={styles.userName}>陳小華</div>
          <div className={styles.balanceInfo}>
            <Coins />
            <span>可用代幣: 2,850 一幣之力</span>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* 重要提醒 */}
        <div className={styles.alertCard}>
          <div className={styles.alertIcon}>
            <AlertTriangle />
          </div>
          <div className={styles.alertContent}>
            <div className={styles.alertTitle}>本月補助代幣已發放</div>
            <div className={styles.alertDesc}>請至指定據點領取或確認帳戶餘額</div>
          </div>
        </div>

        {/* 最近補助記錄 */}
        <section className={styles.recentSection}>
          <div className={styles.recentHeader}>
            <h3 className={styles.recentTitle}>最近收到的補助代幣</h3>
            <a href="/receive" className={styles.viewAllBtn}>
              查看全部 <ArrowRight />
            </a>
          </div>
          {recentSupports.map((item, index) => (
            <div key={index} className={styles.recentItem}>
              <div className={styles.recentIcon}>
                <item.icon />
              </div>
              <div className={styles.recentContent}>
                <div className={styles.recentText}>{item.text}</div>
                <div className={styles.recentTime}>{item.time}</div>
              </div>
              <div className={styles.recentAmount}>
                <Coins />
                +{item.amount.toLocaleString()}幣
              </div>
            </div>
          ))}
        </section>

        {/* 政府公告 */}
        <section className={styles.announcementSection}>
          <h3 className={styles.sectionTitle}>重要公告</h3>
          {announcements.map((item, index) => (
            <div key={index} className={styles.announcementItem}>
              <div className={styles.announcementIcon}>
                <item.icon />
              </div>
              <div className={styles.announcementContent}>
                <div className={styles.announcementText}>{item.text}</div>
                <div className={styles.announcementTime}>{item.time}</div>
              </div>
            </div>
          ))}
        </section>

        {/* 附近服務據點 */}
        <section className={styles.serviceSection}>
          <h3 className={styles.sectionTitle}>附近服務據點</h3>
          {servicePoints.map((point, index) => (
            <div key={index} className={styles.serviceItem}>
              <div className={styles.serviceInfo}>
                <div className={styles.serviceName}>{point.name}</div>
                <div className={styles.serviceAddr}>{point.address}</div>
              </div>
              <div className={`${styles.serviceStatus} ${styles[point.status]}`}>
                {point.status === 'open' ? '營業中' : '已關閉'}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Home;
