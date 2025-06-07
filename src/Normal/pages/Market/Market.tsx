import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Package, 
  Gift, 
  ShoppingBag, 
  Plus, 
  Minus, 
  X, 
  ShoppingCart,
  Heart,
  Apple,
  Coffee,
  Book,
  Coins
} from 'lucide-react';
import Header from '../../components/Header/Header';
import styles from './Market.module.scss';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: React.ComponentType;
  tag?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const Market: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('全部');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 模擬商品數據
  const products: Product[] = [
    {
      id: '1',
      name: '愛心便當',
      description: '營養均衡的熱騰騰便當，包含主菜、配菜和湯品',
      price: 80,
      category: '餐飲',
      icon: Package,
      tag: '熱門'
    },
    {
      id: '2',
      name: '營養飲品',
      description: '高蛋白營養補充飲品，適合老人和兒童',
      price: 45,
      category: '飲品',
      icon: Coffee
    },
    {
      id: '3',
      name: '日用品包',
      description: '包含洗髮精、牙刷、牙膏等基本生活用品',
      price: 120,
      category: '日用品',
      icon: Gift,
      tag: '實用'
    },
    {
      id: '4',
      name: '學習用品',
      description: '筆記本、鉛筆、橡皮擦等學童必需用品',
      price: 200,
      category: '文具',
      icon: Book
    },
    {
      id: '5',
      name: '新鮮水果',
      description: '當季新鮮水果組合，富含維生素',
      price: 150,
      category: '食品',
      icon: Apple,
      tag: '新鮮'
    },
    {
      id: '6',
      name: '保暖衣物',
      description: '冬季保暖外套，適合各年齡層',
      price: 300,
      category: '衣物',
      icon: Gift
    }
  ];

  const filterCategories = ['全部', '餐飲', '日用品', '文具', '食品', '衣物', '飲品'];

  // 篩選商品
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
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

  // 加入購物車
  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const existingItem = cartItems.find(item => item.id === selectedProduct.id);
    
    if (existingItem) {
      setCartItems(prev => 
        prev.map(item => 
          item.id === selectedProduct.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems(prev => [...prev, { ...selectedProduct, quantity }]);
    }

    handleCloseModal();
    alert(`已將 ${selectedProduct.name} x${quantity} 加入愛心購物車！`);
  };

  // 快速加入購物車（商品卡片上的 + 按鈕）
  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(prev => 
        prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  // 計算購物車總數量
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // 點擊遮罩關閉 Modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
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
            const IconComponent = product.icon;
            return (
              <div 
                key={product.id} 
                className={styles.productCard}
                onClick={() => handleProductClick(product)}
              >
                <div className={styles.productImage}>
                  <IconComponent />
                  {product.tag && (
                    <div className={styles.productTag}>{product.tag}</div>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.productName}>{product.name}</div>
                  <div className={styles.productDesc}>{product.description}</div>
                  <div className={styles.productPrice}>
                    <span className={styles.price}>
                      <Coins size={14} style={{ marginRight: '4px' }} />
                      {product.price}幣
                    </span>
                    <button 
                      className={styles.addBtn}
                      onClick={(e) => handleQuickAdd(product, e)}
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
                <selectedProduct.icon />
              </div>
              
              <div className={styles.modalProductInfo}>
                <h3 className={styles.modalProductName}>{selectedProduct.name}</h3>
                <p className={styles.modalProductDesc}>{selectedProduct.description}</p>
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
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
              >
                <ShoppingCart />
                加入愛心購物車
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;
