import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Package, 
  Gift, 
  ShoppingBag, 
  Plus, 
  Minus, 
  X, 
  Zap,
  Heart,
  Apple,
  Coffee,
  Book,
  Coins
} from 'lucide-react';
import Header from '../../components/Header/Header';
import styles from './Market.module.scss';
import { useDispatch } from 'react-redux';
import { setLoading1 } from '@/state/loading/loading';
import { apiAddProduct, apiGetProducts } from '@/Normal/API/product';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string | "無分類";
}

const Market: React.FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('全部');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userBalance] = useState(1250); // 模擬用戶餘額
  const [products, setProducts] = useState<Product[]>([]);

  const handleGetProducts = async () => {
    try {
      dispatch(setLoading1(true));
      const res = await apiGetProducts();
      setProducts(res);
    } catch ( err ) {
      console.error('獲取商品失敗:', err);
      alert('無法獲取商品列表，請稍後再試。');
    } finally {
      dispatch(setLoading1(false));
    }
  }

  useEffect(() => {
    handleGetProducts();
  }, [])
  

  const filterCategories = ['全部', '餐飲', '日用品', '文具', '食品', '衣物', '飲品'];

  // 篩選商品
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === '全部' || product.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

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
  const handleDirectPurchase = async () => {
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
      handleCloseModal();
      try {
        dispatch(setLoading1(true));
        await apiAddProduct(selectedProduct.id, quantity);
        alert(`購買成功！${selectedProduct.name} 將盡快為您處理`);
        // 這裡可以添加成功購買後的其他處理邏輯，比如更新購物車狀態等
      } catch ( err ) {
        console.error('購買失敗:', err);
        alert('購買失敗，請稍後再試。');
      } finally {
        dispatch(setLoading1(false));
      }
      
    }
  };

  // 快速購買（商品卡片上的 + 按鈕）
  const handleQuickPurchase = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (product.price > userBalance) {
      alert('餘額不足，請先購買一幣之力！');
      return;
    }

    const confirmPurchase = window.confirm(
      `確認購買 ${product.name} x1\n` +
      `總計：${product.price} 一幣之力`
    );

    if (confirmPurchase) {
      // 這裡會實際調用購買 API
      alert(`購買成功！${product.name} 將盡快為您處理`);
    }
  };

  // 獲取商品圖標（作為後備方案）
  const getProductIcon = (category: string) => {
    switch (category) {
      case '餐飲':
        return Package;
      case '飲品':
        return Coffee;
      case '日用品':
        return Gift;
      case '文具':
        return Book;
      case '食品':
        return Apple;
      case '衣物':
        return ShoppingBag;
      default:
        return Package;
    }
  };

  // 計算購物車總數量
  // const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

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
    <div className={styles.marketPage}>
      
      {/* 搜尋區域 */}
      <section className={styles.searchSection}>
        <div className={styles.searchBar}>
          <div className={styles.searchIcon}>
            <Search />
          </div>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="搜尋愛心商品..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filterTabs}>
          {filterCategories.map(category => (
            <button
              key={category}
              className={`${styles.filterTab} ${activeFilter === category ? styles.active : ''}`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <div className={styles.container}>
        {/* 商品網格 */}
        <section className={styles.productsGrid}>
          {filteredProducts.map(product => {
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
                        // 如果圖片載入失敗，顯示圖標
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
                  <div className={styles.productCategory}>{product.category}</div>
                  <div className={styles.productPrice}>
                    <span className={styles.price}>
                      <Coins size={14} style={{ marginRight: '4px' }} />
                      {product.price}幣
                    </span>
                    <button 
                      className={styles.addBtn}
                      onClick={(e) => handleQuickPurchase(product, e)}
                    >
                      <Plus />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
                <span className={styles.quantityLabel}>購買數量</span>
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
                f立即購買
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;
