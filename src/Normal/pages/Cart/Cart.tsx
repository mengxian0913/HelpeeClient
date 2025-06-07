import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Heart, 
  Coins,
  CreditCard,
  Package,
  Gift,
  Coffee,
  Book,
  Apple
} from 'lucide-react';
import Header from '../../components/Header/Header';
import styles from './Cart.module.scss';

interface CartItem {
  id: string;
  name: string;
  imagePath?: string;
  price: number;
  amount: number;
}

const Cart: React.FC = () => {
  // 模擬購物車數據
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: '愛心便當',
      imagePath: '/images/lunchbox.jpg',
      price: 80,
      amount: 2
    },
    {
      id: '2',
      name: '營養飲品',
      imagePath: '/images/drink.jpg',
      price: 45,
      amount: 1
    },
    {
      id: '3',
      name: '日用品包',
      imagePath: '/images/dailypack.jpg',
      price: 120,
      amount: 1
    },
    {
      id: '4',
      name: '學習用品',
      imagePath: '/images/stationery.jpg',
      price: 200,
      amount: 1
    }
  ]);

  // 根據商品名稱獲取對應圖標
  const getItemIcon = (name: string) => {
    if (name.includes('便當') || name.includes('餐')) return Package;
    if (name.includes('飲品') || name.includes('咖啡')) return Coffee;
    if (name.includes('學習') || name.includes('文具')) return Book;
    if (name.includes('水果') || name.includes('食品')) return Apple;
    return Gift;
  };

  // 計算統計數據
  const statistics = useMemo(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.amount), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.amount, 0);
    
    return {
      total,
      totalItems
    };
  }, [cartItems]);

  // 更新商品數量
  const updateQuantity = (id: string, change: number) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newAmount = Math.max(1, item.amount + change);
          return { ...item, amount: newAmount };
        }
        return item;
      })
    );
  };

  // 移除商品
  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // 清空購物車
  const clearCart = () => {
    if (window.confirm('確定要清空購物車嗎？')) {
      setCartItems([]);
    }
  };

  // 結帳
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('購物車是空的，請先添加商品');
      return;
    }

    const confirmMessage = `
確認購買以下商品：
${cartItems.map(item => `• ${item.name} x${item.amount} = ${item.price * item.amount}元`).join('\n')}

總計: ${statistics.total}元

是否確認結帳？
    `;

    if (window.confirm(confirmMessage)) {
      alert('結帳成功！感謝您的愛心，商品將盡快送達受助者手中。');
      setCartItems([]);
    }
  };

  return (
    <div className={styles.cartPage}>
      
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>愛心購物車</h1>
        <p className={styles.itemCount}>
          {statistics.totalItems > 0 ? `共 ${statistics.totalItems} 件愛心商品` : '購物車是空的'}
        </p>
      </div>

      <div className={styles.container}>
        {cartItems.length > 0 ? (
          <>
            {/* 購物車項目列表 */}
            <div className={styles.cartList}>
              {cartItems.map((item) => {
                const IconComponent = getItemIcon(item.name);
                return (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      {item.imagePath ? (
                        <img src={item.imagePath} alt={item.name} />
                      ) : (
                        <IconComponent />
                      )}
                    </div>
                    
                    <div className={styles.itemContent}>
                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemName}>{item.name}</h3>
                        <div className={styles.itemPrice}>{item.price}元</div>
                        <div className={styles.itemSubtotal}>
                          小計: {(item.price * item.amount).toLocaleString()}元
                        </div>
                      </div>
                      
                      <div className={styles.itemActions}>
                        <div className={styles.quantityControls}>
                          <button
                            className={styles.quantityBtn}
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.amount <= 1}
                          >
                            <Minus />
                          </button>
                          <span className={styles.quantityValue}>{item.amount}</span>
                          <button
                            className={styles.quantityBtn}
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus />
                          </button>
                        </div>
                        
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 清空購物車按鈕 */}
            <button className={styles.clearCartBtn} onClick={clearCart}>
              <Trash2 />
              清空購物車
            </button>
          </>
        ) : (
          /* 空購物車狀態 */
          <div className={styles.emptyCart}>
            <div className={styles.emptyIcon}>
              <ShoppingCart />
            </div>
            <h2 className={styles.emptyTitle}>購物車是空的</h2>
            <p className={styles.emptyDesc}>
              還沒有選擇任何愛心商品<br />
              快去商城選購，讓愛心化為實際行動吧！
            </p>
            <button className={styles.shopBtn} onClick={() => window.location.href = '/shop'}>
              <ShoppingBag />
              前往商城
            </button>
          </div>
        )}
      </div>

      {/* 底部結算區域 */}
      {cartItems.length > 0 && (
        <div className={styles.checkoutSection}>
          <div className={styles.checkoutContainer}>
            {/* 總價區域 */}
            <div className={styles.totalSection}>
              <div className={styles.totalInfo}>
                <div className={styles.totalAmount}>
                  <Coins className={styles.coinIcon} />
                  總計: {statistics.total.toLocaleString()}元
                </div>
              </div>
              
              <button className={styles.checkoutBtn} onClick={handleCheckout}>
                <CreditCard />
                結帳
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
