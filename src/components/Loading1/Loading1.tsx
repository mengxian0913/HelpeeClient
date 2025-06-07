import React, { useEffect } from 'react';
import { Heart, Loader2, Package, ShoppingCart, CreditCard, Coins } from 'lucide-react';
import styles from './Loading1.module.scss';

interface LoadingProps {
  // 是否顯示 Loading
  visible?: boolean;
  // Loading 文字
  text?: string;
  // 描述文字
  description?: string;
  // 動畫類型
  type?: 'heart' | 'dots' | 'wave' | 'circular' | 'spinner';
  // 尺寸
  size?: 'small' | 'medium' | 'large';
  // 主題色彩
  theme?: 'primary' | 'success' | 'warning';
  // 關閉回調
  onClose?: () => void;
  // 是否可以點擊背景關閉
  closable?: boolean;
}

const Loading1: React.FC<LoadingProps> = ({
  visible = true,
  text = '載入中...',
  description,
  type = 'heart',
  size = 'medium',
  theme = 'primary',
  onClose,
  closable = false
}) => {
  
  // 阻止滾動穿透
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [visible]);

  // 點擊背景關閉
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closable && e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  // 渲染不同類型的動畫
  const renderAnimation = () => {
    switch (type) {
      case 'heart':
        return (
          <div className={styles.heartLoader}>
            <div className={styles.heartContainer}>
              <div className={styles.heartRing}></div>
              <div className={`${styles.heartRing} ${styles.secondary}`}></div>
              <Heart className={`${styles.heartIcon} ${styles.filled}`} />
            </div>
          </div>
        );
        
      case 'dots':
        return (
          <div className={styles.dotsLoader}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        );
        
      case 'wave':
        return (
          <div className={styles.waveLoader}>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
          </div>
        );
        
      case 'circular':
        return (
          <div className={styles.circularProgress}>
            <svg className={styles.progressCircle}>
              <circle
                className={styles.progressTrack}
                cx="30"
                cy="30"
                r="25"
              />
              <circle
                className={styles.progressBar}
                cx="30"
                cy="30"
                r="25"
              />
            </svg>
            <Coins className={styles.progressIcon} />
          </div>
        );
        
      case 'spinner':
        return (
          <div className={styles.heartLoader}>
            <Loader2 className={`${styles.heartIcon} ${styles.spinner}`} />
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <div className={styles.loadingOverlay} onClick={handleOverlayClick}>
      <div className={`${styles.loadingContainer} ${styles[size]} ${styles[theme]}`}>
        {renderAnimation()}
        
        <div className={styles.loadingText}>{text}</div>
        
        {description && (
          <div className={styles.loadingDesc}>{description}</div>
        )}
      </div>
    </div>
  );
};

export default Loading1;

// 預設的 Loading 組件變體
export const HeartLoading: React.FC<Omit<LoadingProps, 'type'>> = (props) => (
  <Loading1 {...props} type="heart" />
);

export const DotsLoading: React.FC<Omit<LoadingProps, 'type'>> = (props) => (
  <Loading1 {...props} type="dots" />
);

export const WaveLoading: React.FC<Omit<LoadingProps, 'type'>> = (props) => (
  <Loading1 {...props} type="wave" />
);

export const CircularLoading: React.FC<Omit<LoadingProps, 'type'>> = (props) => (
  <Loading1 {...props} type="circular" />
);

// 針對特定場景的 Loading - 強調代幣概念
export const PaymentLoading: React.FC<Omit<LoadingProps, 'type' | 'text'>> = (props) => (
  <Loading1 
    {...props} 
    type="circular" 
    text="處理一幣之力轉移中..." 
    description="正在為您傳遞愛心代幣"
  />
);

export const PurchaseLoading: React.FC<Omit<LoadingProps, 'type' | 'text'>> = (props) => (
  <Loading1 
    {...props} 
    type="wave" 
    text="兌換愛心商品中..." 
    description="正在使用您的一幣之力"
  />
);

export const DonationLoading: React.FC<Omit<LoadingProps, 'type' | 'text'>> = (props) => (
  <Loading1 
    {...props} 
    type="heart" 
    text="愛心代幣發送中..." 
    description="您的一幣之力正在傳遞"
  />
);

export const SubmitLoading: React.FC<Omit<LoadingProps, 'type' | 'text'>> = (props) => (
  <Loading1 
    {...props} 
    type="dots" 
    text="提交中..." 
    description="請稍候片刻"
  />
);
