import React from 'react';
import { Heart, Loader2, CheckCircle } from 'lucide-react';
import styles from './Loading1.module.scss';

interface Loading1Props {
  currentStep?: number;
  steps?: string[];
}

const Loading1: React.FC<Loading1Props> = ({ 
  currentStep = 1, 
  steps = ['連接中', '載入中', '完成']
}) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.logo}>
        <Heart fill="currentColor" />
      </div>
      <h1 className={styles.appName}>一幣之力</h1>
      <p className={styles.appSubtitle}>讓愛心化為實際的力量</p>
      
      {/* 水平步驟進度條 */}
      <div className={styles.stepsContainer}>
        {steps.map((step, index) => (
          <div key={index} className={styles.stepWrapper}>
            <div className={`${styles.stepItem} ${index + 1 <= currentStep ? styles.active : ''} ${index + 1 < currentStep ? styles.completed : ''}`}>
              <div className={styles.stepIcon}>
                {index + 1 < currentStep ? (
                  <CheckCircle />
                ) : index + 1 === currentStep ? (
                  <Loader2 className={styles.spinner} />
                ) : (
                  <div className={styles.stepNumber}>{index + 1}</div>
                )}
              </div>
              <div className={styles.stepLabel}>{step}</div>
            </div>
            {index < steps.length - 1 && (
              <div className={`${styles.stepConnector} ${index + 1 < currentStep ? styles.completed : ''}`} />
            )}
          </div>
        ))}
      </div>
      
      <div className={styles.loadingText}>
        {steps[currentStep - 1]}...
      </div>
    </div>
  );
};

export default Loading1;
