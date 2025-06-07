import React, { useState, useEffect } from "react";
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
  Plus,
  Minus,
  X,
  Zap
} from "lucide-react";
import Header from "../../components/Header/Header";
import styles from "./Home.module.scss";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string | "無分類";
}

const Home: React.FC = () => {
  
  const navigation = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userBalance] = useState(1250); // 模擬用戶餘額

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
    { icon: Heart, number: "128", label: "總金額" },
    { icon: Users, number: "45", label: "幫助人數" },
    { icon: ShoppingBag, number: "23", label: "物資數量" },
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

  const products: Product[] = [
    { 
      id: '1',
      name: "愛心便當", 
      price: 80, 
      category: "餐飲",
      image: "/images/products/lunchbox.jpg"
    },
    { 
      id: '2',
      name: "營養飲品", 
      price: 45, 
      category: "飲品",
      image: "/images/products/nutrition-drink.jpg"
    },
    { 
      id: '3',
      name: "日用品包", 
      price: 120, 
      category: "日用品",
      image: "/images/products/daily-supplies.jpg"
    },
    { 
      id: '4',
      name: "學習用品", 
      price: 200, 
      category: "文具",
      image: "/images/products/study-supplies.jpg"
    },
  ];

  // 獲取商品圖標（作為後備方案）
  const getProductIcon = (category: string) => {
    switch (category) {
      case '餐飲':
        return Package;
      case '飲品':
        return Gift;
      case '日用品':
        return ShoppingBag;
      case '文具':
        return Package;
      default:
        return Package;
    }
  };

  // 開啟商品詳情 Modal
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsModalOpen(true);
  };

  // 關閉 Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // 數量控制
  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  // 直接購買
  const handleDirectPurchase = () => {
    if (!selectedProduct) return;

    const totalCost = selectedProduct.price * quantity;
    
    if (totalCost > userBalance) {
      alert('餘額不足，請先購買一幣之力！');
      return;
    }

    const confirmPurchase = window.confirm(
      `確認購買 ${selectedProduct.name} x${quantity}\n` +
      `總計：${totalCost.toLocaleString()} 一幣之力`
    );

    if (confirmPurchase) {
      // 這裡會實際調用購買 API
      alert(`購買成功！${selectedProduct.name} x${quantity} 將盡快為您處理`);
      handleCloseModal();
    }
  };

  // 點擊遮罩關閉 Modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // 阻止滾动穿透
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
            {products.map((product) => {
              const IconComponent = getProductIcon(product.category);
              return (
                <div 
                  key={product.id} 
                  className={styles.productCard}
                  onClick={() => handleProductClick(product)}
                >
                  <div className={styles.productImage}>
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
                        }}
                      />
                    ) : null}
                    <div className={`${styles.iconFallback} ${product.image ? styles.hidden : ''}`}>
                      <IconComponent />
                    </div>
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productName}>{product.name}</div>
                    <div className={styles.productPrice}>
                      <Coins size={12} style={{ marginRight: '2px' }} />
                      {product.price}幣
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 商品詳情 Modal */}
      {isModalOpen && selectedProduct && (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
          <div className={`${styles.modal} ${isModalOpen ? styles.open : ''}`}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>愛心商品詳情</h2>
              <button className={styles.closeBtn} onClick={handleCloseModal}>
                <X />
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.modalProductImage}>
                {selectedProduct.image ? (
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
                    }}
                  />
                ) : null}
                <div className={`${styles.modalIconFallback} ${selectedProduct.image ? styles.hidden : ''}`}>
                  {React.createElement(getProductIcon(selectedProduct.category))}
                </div>
              </div>
              
              <div className={styles.modalProductInfo}>
                <h3 className={styles.modalProductName}>{selectedProduct.name}</h3>
                <div className={styles.modalProductCategory}>分類：{selectedProduct.category}</div>
                <div className={styles.modalProductPrice}>
                  <Coins size={18} style={{ marginRight: '6px' }} />
                  {selectedProduct.price}幣
                </div>
              </div>
              
              <div className={styles.quantitySelector}>
                <span className={styles.quantityLabel}>兌換數量</span>
                <div className={styles.quantityControls}>
                  <button 
                    className={styles.quantityBtn}
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus />
                  </button>
                  <span className={styles.quantityValue}>{quantity}</span>
                  <button 
                    className={styles.quantityBtn}
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus />
                  </button>
                </div>
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <div className={styles.totalPrice}>
                <div className={styles.totalLabel}>總計</div>
                <div className={styles.totalAmount}>
                  <Coins size={16} style={{ marginRight: '4px' }} />
                  {(selectedProduct.price * quantity).toLocaleString()}幣
                </div>
              </div>
              <button 
                className={styles.purchaseBtn}
                onClick={handleDirectPurchase}
                disabled={(selectedProduct.price * quantity) > userBalance}
              >
                <Zap />
                立即購買
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
