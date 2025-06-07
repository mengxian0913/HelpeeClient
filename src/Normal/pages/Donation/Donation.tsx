import React, { useEffect, useState } from "react";
import {
  Coins,
  CreditCard,
  Smartphone,
  Wallet,
  ShoppingCart,
  Gift,
  History,
  Package,
  Zap,
} from "lucide-react";
import Header from "../../components/Header/Header";
import styles from "./Donation.module.scss";
import { useDispatch } from "react-redux";
import { setLoading1 } from "@/state/loading/loading";
import { apiGetCoinHistory, apiPurchaseCoin } from "@/Normal/API/coin";

interface CoinPackage {
  id: string;
  coins: number;
  price: number;
  bonus?: number;
  popular?: boolean;
  tag?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType;
}

interface PurchaseHistory {
  id: string;
  createTime: string;
  amount: number;
}

const Donation: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("credit-card");
  const [userBalance] = useState(1250); // 模擬用戶餘額

  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);

  const getTotalCoins = () => {
    let res = 0;
    purchaseHistory.forEach((item) => {
      res += item.amount;
    });
    return (res + userBalance).toLocaleString();
  }


  const handleGetCoinHistory = async () => {
    try {
      const res = await apiGetCoinHistory();
      setPurchaseHistory(res);
    } catch ( err ) {
      console.error("獲取購買紀錄失敗:", err);
    }
  }

  useEffect(() => {
    handleGetCoinHistory();
  }, [])


  // 愛心代幣包選項
  const coinPackages: CoinPackage[] = [
    {
      id: "small",
      coins: 100,
      price: 100,
      tag: "入門包",
    },
    {
      id: "medium",
      coins: 500,
      price: 480,
      bonus: 20,
      popular: true,
    },
    {
      id: "large",
      coins: 1000,
      price: 900,
      bonus: 100,
      tag: "超值包",
    },
    {
      id: "extra",
      coins: 2000,
      price: 1700,
      bonus: 300,
      tag: "愛心包",
    },
    {
      id: "mega",
      coins: 5000,
      price: 4000,
      bonus: 1000,
      tag: "天使包",
    },
    {
      id: "ultimate",
      coins: 10000,
      price: 7500,
      bonus: 2500,
      tag: "聖人包",
    },
  ];

  // 付款方式
  const paymentMethods: PaymentMethod[] = [
    { id: "credit-card", name: "信用卡", icon: CreditCard },
    { id: "line-pay", name: "LINE Pay", icon: Smartphone },
    { id: "apple-pay", name: "Apple Pay", icon: Wallet },
    { id: "google-pay", name: "Google Pay", icon: Smartphone },
  ];

  // 購買紀錄
  
  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setCustomAmount(""); // 清除自訂金額
  };


  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setCustomAmount(value);
      setSelectedPackage(""); // 清除選中的套餐
    }
  };

  const handlePurchase = async () => {
    let coins = 0;
    let price = 0;

    if (selectedPackage) {
      const pkg = coinPackages.find((p) => p.id === selectedPackage);
      if (pkg) {
        coins = pkg.coins + (pkg.bonus || 0);
        price = pkg.price;
      }
    } else if (customAmount) {
      coins = parseInt(customAmount);
      price = parseInt(customAmount);
    }

    if (coins === 0) {
      alert("請選擇購買方案或輸入金額");
      return;
    }

    const paymentMethodName = paymentMethods.find(
      (p) => p.id === selectedPayment
    )?.name;

    // 模擬購買流程
    const confirmPurchase = window.confirm(
      `確認購買 ${coins} 一幣之力\n金額：NT$ ${price}\n付款方式：${paymentMethodName}`
    );

    if (confirmPurchase) {
      // 這裡會實際調用付款 API

      try {
        dispatch(setLoading1(true));
        await apiPurchaseCoin(coins)
        alert("購買成功！一幣之力已加入您的愛心錢包");
        setSelectedPackage("");
        setCustomAmount("");
      } catch (err) {
        console.error("購買失敗:", err);
        alert("購買失敗，請稍後再試");
      } finally {
        dispatch(setLoading1(false));
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className={styles.donationPage}>
      <div className={styles.container}>
        {/* 餘額卡片 */}
        <div className={styles.balanceCard}>
          <div className={styles.balanceIcon}>
            <Coins />
          </div>
          <div className={styles.balanceTitle}>全部的愛心</div>
          <div className={styles.balanceAmount}>
            {getTotalCoins()}
          </div>
          <div className={styles.balanceDesc}>一幣之力</div>
        </div>

        {/* 購買區域 */}
        <div className={styles.purchaseSection}>
          <h2 className={styles.sectionTitle}>購買愛心代幣</h2>
          <p className={styles.sectionDesc}>
            選擇合適的代幣包，開始您的愛心之旅
            <br />每 1 元 = 1 一幣之力，購買大包更划算！
          </p>

          {/* 代幣包選擇 */}
          <div className={styles.coinsGrid}>
            {coinPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`${styles.coinPackage} ${
                  selectedPackage === pkg.id ? styles.selected : ""
                } ${pkg.popular ? styles.popular : ""} ${
                  pkg.bonus && pkg.bonus >= 100 ? styles.bonus : ""
                }`}
                onClick={() => handlePackageSelect(pkg.id)}
              >
                <div className={styles.packageIcon}>
                  <Zap />
                </div>
                <div className={styles.packageCoins}>
                  {pkg.coins.toLocaleString()}幣
                </div>
                <div className={styles.packagePrice}>NT$ {pkg.price}</div>
                {pkg.bonus && (
                  <div className={styles.packageBonus}>+{pkg.bonus}幣 贈送</div>
                )}
                <div className={styles.packageDesc}>{pkg.tag}</div>
              </div>
            ))}
          </div>

          {/* 自訂金額 */}
          <div className={styles.customAmount}>
            <div className={styles.customTitle}>自訂購買金額</div>
            <input
              type="text"
              className={styles.amountInput}
              placeholder="輸入金額"
              value={customAmount}
              onChange={handleCustomAmountChange}
            />
            <div className={styles.conversionRate}>1 元 = 1 一幣之力</div>
          </div>

          {/* 購買按鈕 */}
          <button
            className={styles.purchaseBtn}
            onClick={handlePurchase}
            disabled={!selectedPackage && !customAmount}
          >
            <ShoppingCart />
            立即購買愛心代幣
          </button>
        </div>

        {/* 付款方式 */}
        <div className={styles.paymentMethods}>
          <h3 className={styles.sectionTitle}>選擇付款方式</h3>
          <div className={styles.methodGrid}>
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={method.id}
                  className={`${styles.paymentMethod} ${
                    selectedPayment === method.id ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <div className={styles.methodIcon}>
                    <IconComponent />
                  </div>
                  <div className={styles.methodName}>{method.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 購買紀錄 */}
        <div className={styles.historySection}>
          <h3 className={styles.sectionTitle}>
            <History />
            代幣購買紀錄
          </h3>
          {purchaseHistory.length > 0 ? (
            purchaseHistory.map((item) => (
              <div key={item.id} className={styles.historyItem}>
                <div className={styles.historyInfo}>
                  <div className={styles.historyDate}>
                    {formatDate(item.createTime)}
                  </div>
                  {/* <div className={styles.historyDesc}>{item.description}</div> */}
                </div>
                <div className={styles.historyAmount}>
                  +{item.amount.toLocaleString()}幣
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyHistory}>
              <Package />
              <div>尚無購買紀錄</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donation;
