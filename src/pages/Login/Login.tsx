import React, { useState } from "react";
import {
  Heart,
  HandHeart,
  Sprout,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
} from "lucide-react";
import styles from "./Login.module.scss";

type UserType = "normal" | "disadvantaged" | null;

const Login: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    account: "",
    password: "",
  });

  const handleUserTypeSelect = (type: UserType) => {
    setSelectedUserType(type);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserType) {
      alert("請先選擇您的身份");
      return;
    }

    setIsLoading(true);

    try {
      // 模擬 API 呼叫
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 這裡處理登入邏輯
      console.log("Login as:", selectedUserType);
      console.log("Form data:", formData);
      alert(
        `歡迎您，${selectedUserType === "normal" ? "愛心天使" : "希望種子"}！`
      );
    } catch (error) {
      console.error("Login error:", error);
      alert("登入失敗，請重試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <Heart fill="currentColor" />
          </div>
          <h1 className={styles.appName}>一幣之力</h1>
          <p className={styles.appSubtitle}>讓愛心化為實際的力量</p>
        </div>

        <div className={styles.userTypeSection}>
          <p className={styles.sectionTitle}>請選擇您的身份</p>
          <div className={styles.userTypeButtons}>
            <button
              className={`${styles.userTypeBtn} ${
                selectedUserType === "normal" ? styles.active : ""
              }`}
              onClick={() => handleUserTypeSelect("normal")}
              disabled={isLoading}
            >
              <div className={styles.userTypeIcon}>
                <HandHeart />
              </div>
              <div className={styles.userTypeLabel}>愛心天使</div>
              <div className={styles.userTypeDesc}>我想幫助他人</div>
            </button>
            <button
              className={`${styles.userTypeBtn} ${
                selectedUserType === "disadvantaged" ? styles.active : ""
              }`}
              onClick={() => handleUserTypeSelect("disadvantaged")}
              disabled={isLoading}
            >
              <div className={styles.userTypeIcon}>
                <Sprout />
              </div>
              <div className={styles.userTypeLabel}>希望種子</div>
              <div className={styles.userTypeDesc}>我需要協助</div>
            </button>
          </div>
        </div>

        <div
          className={`${styles.formSection} ${
            selectedUserType ? styles.active : ""
          }`}
        >
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>身分證字號</label>
              <input
                type="text"
                name="account"
                className={styles.formInput}
                placeholder="請輸入身分證字號"
                value={formData.account}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>密碼</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={styles.formInput}
                  placeholder="請輸入密碼"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePassword}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className={styles.loginBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className={styles.loadingSpinner} />
                  登入中...
                </>
              ) : (
                <>
                  <LogIn />
                  登入
                </>
              )}
            </button>
          </form>

          <div className={styles.helperLinks}>
            <a href="#" className={styles.helperLink}>
              忘記密碼？
            </a>
            <a href="#" className={styles.helperLink}>
              註冊新帳號
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
