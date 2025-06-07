import React, { useState } from 'react';
import { 
  Heart, 
  Smartphone, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  Send,
  ShieldCheck,
  Lock,
  ArrowLeft
} from 'lucide-react';
import styles from './ForgotPassword.module.scss';

type VerificationMethod = 'phone' | 'email';
type Step = 'input' | 'verify' | 'reset' | 'success';

const ForgotPassword: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('phone');
  const [formData, setFormData] = useState({
    account: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除對應的錯誤訊息
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleMethodChange = (method: VerificationMethod) => {
    setVerificationMethod(method);
    setFormData(prev => ({ ...prev, account: '' }));
    setErrors({});
  };

  const validateAccount = () => {
    const { account } = formData;
    if (!account) {
      setErrors({ account: '請輸入帳號' });
      return false;
    }
    
    if (verificationMethod === 'phone') {
      const phoneRegex = /^09\d{8}$/;
      if (!phoneRegex.test(account)) {
        setErrors({ account: '請輸入有效的手機號碼' });
        return false;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(account)) {
        setErrors({ account: '請輸入有效的 Email' });
        return false;
      }
    }
    
    return true;
  };

  const handleSendCode = () => {
    if (!validateAccount()) return;
    
    // 模擬發送驗證碼
    console.log('發送驗證碼到:', formData.account);
    setCurrentStep('verify');
    startCountdown();
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyCode = () => {
    if (!formData.verificationCode) {
      setErrors({ verificationCode: '請輸入驗證碼' });
      return;
    }
    
    if (formData.verificationCode.length !== 6) {
      setErrors({ verificationCode: '驗證碼為 6 位數字' });
      return;
    }
    
    // 模擬驗證
    console.log('驗證碼:', formData.verificationCode);
    setCurrentStep('reset');
  };

  const validatePassword = () => {
    const { newPassword, confirmPassword } = formData;
    const errors: Record<string, string> = {};
    
    if (!newPassword) {
      errors.newPassword = '請輸入新密碼';
    } else if (newPassword.length < 8) {
      errors.newPassword = '密碼至少需要 8 個字元';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = '請確認新密碼';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = '兩次輸入的密碼不一致';
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResetPassword = () => {
    if (!validatePassword()) return;
    
    // 模擬重設密碼
    console.log('重設密碼');
    setCurrentStep('success');
  };

  const togglePasswordVisibility = (field: 'new' | 'confirm') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'input':
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>忘記密碼了嗎？</h2>
            <p className={styles.stepDesc}>
              別擔心！請選擇驗證方式，我們將協助您重設密碼
            </p>
            
            <div className={styles.methodTabs}>
              <button
                className={`${styles.methodTab} ${verificationMethod === 'phone' ? styles.active : ''}`}
                onClick={() => handleMethodChange('phone')}
              >
                <Smartphone />
                手機驗證
              </button>
              <button
                className={`${styles.methodTab} ${verificationMethod === 'email' ? styles.active : ''}`}
                onClick={() => handleMethodChange('email')}
              >
                <Mail />
                Email 驗證
              </button>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {verificationMethod === 'phone' ? '手機號碼' : 'Email 地址'}
              </label>
              <input
                type={verificationMethod === 'phone' ? 'tel' : 'email'}
                name="account"
                className={`${styles.formInput} ${errors.account ? styles.error : ''}`}
                placeholder={verificationMethod === 'phone' ? '請輸入註冊的手機號碼' : '請輸入註冊的 Email'}
                value={formData.account}
                onChange={handleInputChange}
              />
              {errors.account && (
                <span className={styles.errorText}>{errors.account}</span>
              )}
            </div>
            
            <button 
              className={styles.primaryBtn}
              onClick={handleSendCode}
            >
              <Send size={16} />
              發送驗證碼
            </button>
          </div>
        );
        
      case 'verify':
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>輸入驗證碼</h2>
            <p className={styles.stepDesc}>
              我們已將驗證碼發送至<br />
              <strong>{formData.account}</strong>
            </p>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>6 位數驗證碼</label>
              <input
                type="text"
                name="verificationCode"
                className={`${styles.formInput} ${styles.codeInput} ${errors.verificationCode ? styles.error : ''}`}
                placeholder="000000"
                maxLength={6}
                value={formData.verificationCode}
                onChange={handleInputChange}
              />
              {errors.verificationCode && (
                <span className={styles.errorText}>{errors.verificationCode}</span>
              )}
            </div>
            
            <div className={styles.resendSection}>
              {countdown > 0 ? (
                <span className={styles.countdown}>
                  {countdown} 秒後可重新發送
                </span>
              ) : (
                <button 
                  className={styles.linkBtn}
                  onClick={startCountdown}
                >
                  重新發送驗證碼
                </button>
              )}
            </div>
            
            <button 
              className={styles.primaryBtn}
              onClick={handleVerifyCode}
            >
              <ShieldCheck size={16} />
              驗證
            </button>
            
            <button 
              className={styles.secondaryBtn}
              onClick={() => setCurrentStep('input')}
            >
              <ArrowLeft size={16} />
              返回上一步
            </button>
          </div>
        );
        
      case 'reset':
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>設定新密碼</h2>
            <p className={styles.stepDesc}>
              請設定您的新密碼，建議使用英文字母、數字組合
            </p>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>新密碼</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  name="newPassword"
                  className={`${styles.formInput} ${errors.newPassword ? styles.error : ''}`}
                  placeholder="請輸入新密碼（至少 8 個字元）"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPassword.new ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.newPassword && (
                <span className={styles.errorText}>{errors.newPassword}</span>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>確認新密碼</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`${styles.formInput} ${errors.confirmPassword ? styles.error : ''}`}
                  placeholder="請再次輸入新密碼"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPassword.confirm ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className={styles.errorText}>{errors.confirmPassword}</span>
              )}
            </div>
            
            <button 
              className={styles.primaryBtn}
              onClick={handleResetPassword}
            >
              <Lock size={16} />
              重設密碼
            </button>
          </div>
        );
        
      case 'success':
        return (
          <div className={styles.stepContent}>
            <div className={styles.successIcon}>
              <CheckCircle />
            </div>
            <h2 className={styles.stepTitle}>密碼重設成功！</h2>
            <p className={styles.stepDesc}>
              您的密碼已成功重設，現在可以使用新密碼登入囉！
            </p>
            
            <button 
              className={styles.primaryBtn}
              onClick={() => {
                // 導向登入頁面
                console.log('返回登入頁面');
              }}
            >
              返回登入
            </button>
          </div>
        );
    }
  };

  return (
    <div className={styles.forgotPasswordPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Heart fill="currentColor" />
          </div>
          <h1 className={styles.appName}>一幣之力</h1>
        </div>
        
        <div className={styles.progressBar}>
          <div 
            className={`${styles.progressStep} ${
              ['input', 'verify', 'reset', 'success'].includes(currentStep) ? styles.active : ''
            }`}
          />
          <div 
            className={`${styles.progressStep} ${
              ['verify', 'reset', 'success'].includes(currentStep) ? styles.active : ''
            }`}
          />
          <div 
            className={`${styles.progressStep} ${
              ['reset', 'success'].includes(currentStep) ? styles.active : ''
            }`}
          />
          <div 
            className={`${styles.progressStep} ${
              currentStep === 'success' ? styles.active : ''
            }`}
          />
        </div>
        
        {renderStep()}
        
        <div className={styles.footer}>
          <a href="#" className={styles.footerLink}>返回登入</a>
          <span className={styles.separator}>•</span>
          <a href="#" className={styles.footerLink}>聯絡客服</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;