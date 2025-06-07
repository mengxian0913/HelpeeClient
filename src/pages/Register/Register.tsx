import React, { useState } from 'react';
import { 
  Heart, 
  HandHeart, 
  Sprout, 
  Eye, 
  EyeOff, 
  UserPlus, 
  Loader2,
  Check,
  User,
  Mail,
  CreditCard
} from 'lucide-react';
import styles from './Register.module.scss';
import { apiRegister } from '@/API/auth';
import { useDispatch } from 'react-redux';
import { setLoading1 } from '@/state/loading/loading';

type UserType = 'normal' | 'disadvantaged' | null;

interface FormData {
  userType: UserType;
  idNumber: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    userType: null,
    idNumber: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const handleUserTypeSelect = (type: UserType) => {
    setSelectedUserType(type);
    setFormData(prev => ({ ...prev, userType: type }));
    setErrors({}); // 清除錯誤訊息
  };

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

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // 驗證身分證字號
  const validateIdNumber = (idNumber: string): boolean => {
    // 台灣身分證字號驗證邏輯
    const idRegex = /^[A-Z][1-2]\d{8}$/;
    if (!idRegex.test(idNumber)) {
      return false;
    }
    
    // 驗證檢查碼
    const letterMap: { [key: string]: number } = {
      'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16,
      'H': 17, 'I': 34, 'J': 18, 'K': 19, 'L': 20, 'M': 21, 'N': 22,
      'O': 35, 'P': 23, 'Q': 24, 'R': 25, 'S': 26, 'T': 27, 'U': 28,
      'V': 29, 'W': 32, 'X': 30, 'Y': 31, 'Z': 33
    };
    
    const firstLetter = idNumber.charAt(0);
    const letterValue = letterMap[firstLetter];
    
    let sum = Math.floor(letterValue / 10) + (letterValue % 10) * 9;
    for (let i = 1; i < 9; i++) {
      sum += parseInt(idNumber.charAt(i)) * (9 - i);
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(idNumber.charAt(9));
  };

  // 表單驗證
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.userType) {
      newErrors.userType = '請選擇您的身份';
    }

    if (!formData.idNumber) {
      newErrors.idNumber = '請輸入身分證字號';
    } else if (!validateIdNumber(formData.idNumber.toUpperCase())) {
      newErrors.idNumber = '請輸入有效的身分證字號';
    }

    if (!formData.name) {
      newErrors.name = '請輸入姓名';
    } else if (formData.name.length < 2) {
      newErrors.name = '姓名至少需要 2 個字元';
    }

    if (!formData.email) {
      newErrors.email = '請輸入 Email';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = '請輸入有效的 Email 格式';
      }
    }

    if (!formData.password) {
      newErrors.password = '請輸入密碼';
    } else if (formData.password.length < 8) {
      newErrors.password = '密碼至少需要 8 個字元';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '密碼需包含英文字母和數字';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '請確認密碼';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '兩次輸入的密碼不一致';
    }

    if (!agreedToTerms) {
      newErrors.terms = '請同意服務條款';
    }

    if (!agreedToPrivacy) {
      newErrors.privacy = '請同意隱私政策';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      dispatch(setLoading1(true));
      await apiRegister(formData.idNumber as string, formData.password, formData.email, formData.name, formData.userType!);
      dispatch(setLoading1(false));
    } catch (error) {
      console.error('Register error:', error);
      alert('註冊失敗，請重試');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserTypeConfig = () => {
    return [
      {
        type: 'normal' as const,
        icon: HandHeart,
        label: '愛心天使',
        desc: '我想透過一幣之力幫助需要的人，讓愛心化為實際行動'
      },
      {
        type: 'disadvantaged' as const,
        icon: Sprout,
        label: '希望種子',
        desc: '我需要社會的溫暖協助，讓愛心代幣成為生活的支援'
      }
    ];
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <Heart fill="currentColor" />
          </div>
          <h1 className={styles.appName}>一幣之力</h1>
          <p className={styles.appSubtitle}>讓愛心化為實際的力量</p>
        </div>

        <div className={styles.userTypeSection}>
          <h2 className={styles.sectionTitle}>選擇您的身份</h2>
          <p className={styles.sectionDesc}>
            請選擇最符合您需求的身份，我們將為您提供對應的服務
          </p>
          
          <div className={styles.userTypeButtons}>
            {getUserTypeConfig().map(({ type, icon: Icon, label, desc }) => (
              <button
                key={type}
                className={`${styles.userTypeBtn} ${
                  selectedUserType === type ? styles.active : ''
                }`}
                onClick={() => handleUserTypeSelect(type)}
                disabled={isLoading}
              >
                <div className={styles.userTypeIcon}>
                  <Icon />
                </div>
                <div className={styles.userTypeContent}>
                  <div className={styles.userTypeLabel}>{label}</div>
                  <div className={styles.userTypeDesc}>{desc}</div>
                </div>
              </button>
            ))}
          </div>
          {errors.userType && (
            <span className={styles.errorText}>{errors.userType}</span>
          )}
        </div>

        <div className={`${styles.formSection} ${selectedUserType ? styles.active : ''}`}>
          <form onSubmit={handleRegister}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <CreditCard size={16} style={{ marginRight: '6px' }} />
                身分證字號
              </label>
              <input
                type="text"
                name="idNumber"
                className={`${styles.formInput} ${errors.idNumber ? styles.error : ''}`}
                placeholder="請輸入身分證字號（例：A123456789）"
                value={formData.idNumber}
                onChange={handleInputChange}
                disabled={isLoading}
                maxLength={10}
                style={{ textTransform: 'uppercase' }}
              />
              {errors.idNumber && (
                <span className={styles.errorText}>{errors.idNumber}</span>
              )}
              <div className={styles.inputHint}>
                請輸入您的身分證字號，此資訊用於身份驗證
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <User size={16} style={{ marginRight: '6px' }} />
                姓名
              </label>
              <input
                type="text"
                name="name"
                className={`${styles.formInput} ${errors.name ? styles.error : ''}`}
                placeholder="請輸入您的真實姓名"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.name && (
                <span className={styles.errorText}>{errors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <Mail size={16} style={{ marginRight: '6px' }} />
                Email
              </label>
              <input
                type="email"
                name="email"
                className={`${styles.formInput} ${errors.email ? styles.error : ''}`}
                placeholder="請輸入您的 Email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.email && (
                <span className={styles.errorText}>{errors.email}</span>
              )}
              <div className={styles.inputHint}>
                Email 將用於接收重要通知和密碼重設
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>密碼</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword.password ? 'text' : 'password'}
                  name="password"
                  className={`${styles.formInput} ${errors.password ? styles.error : ''}`}
                  placeholder="請輸入密碼（至少 8 字元，包含英文和數字）"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => togglePasswordVisibility('password')}
                  disabled={isLoading}
                >
                  {showPassword.password ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <span className={styles.errorText}>{errors.password}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>確認密碼</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`${styles.formInput} ${errors.confirmPassword ? styles.error : ''}`}
                  placeholder="請再次輸入密碼"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  disabled={isLoading}
                >
                  {showPassword.confirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className={styles.errorText}>{errors.confirmPassword}</span>
              )}
            </div>

            <div className={styles.termsSection}>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="terms"
                  className={styles.checkbox}
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  disabled={isLoading}
                />
                <label htmlFor="terms" className={styles.checkboxLabel}>
                  我已閱讀並同意 <a href="#" target="_blank">服務條款</a>
                </label>
              </div>
              {errors.terms && (
                <span className={styles.errorText}>{errors.terms}</span>
              )}

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="privacy"
                  className={styles.checkbox}
                  checked={agreedToPrivacy}
                  onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                  disabled={isLoading}
                />
                <label htmlFor="privacy" className={styles.checkboxLabel}>
                  我已閱讀並同意 <a href="#" target="_blank">隱私政策</a>
                </label>
              </div>
              {errors.privacy && (
                <span className={styles.errorText}>{errors.privacy}</span>
              )}
            </div>

            <button
              type="submit"
              className={styles.registerBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className={styles.loadingSpinner} />
                  註冊中...
                </>
              ) : (
                <>
                  <UserPlus />
                  立即註冊
                </>
              )}
            </button>
          </form>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>已經有帳號了嗎？</p>
          <a href="/login" className={styles.footerLink}>
            立即登入
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
