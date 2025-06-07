import React from 'react';
import styles from './Footer.module.scss';

// App 風格通常不需要傳統的 Footer，改為簡單的版權聲明
const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          © 2024 一幣之力 All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
