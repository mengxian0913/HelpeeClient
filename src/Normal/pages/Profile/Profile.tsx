import React, { useState, useRef } from 'react';
import {
  User,
  Camera,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Heart,
  Settings,
  LogOut,
  Shield,
  Bell,
  Coins,
  History,
  HelpCircle,
  ChevronRight,
  Save,
  X
} from 'lucide-react';
import Header from '../../components/Header/Header';
import styles from './Profile.module.css';
import { useDispatch } from 'react-redux';
import { setUserStateGetter } from '@/state/getter/getter';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  avatar: string;
  totalDonated: number;
  helpedCount: number;
  rank: string;
}

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: '001',
    name: '王小明',
    email: 'wang.xiaoming@example.com',
    phone: '0912-345-678',
    address: '台北市信義區忠孝東路四段123號',
    joinDate: '2023-01-15',
    avatar: '',
    totalDonated: 12500,
    helpedCount: 45,
    rank: '愛心天使'
  });

  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address
  });

  const menuItems = [
    {
      icon: Coins,
      title: '我的錢包',
      subtitle: '查看一幣之力餘額',
      action: () => console.log('前往錢包'),
      badge: '1,250'
    },
    {
      icon: History,
      title: '交易紀錄',
      subtitle: '查看購買與捐贈紀錄',
      action: () => console.log('前往紀錄')
    },
    {
      icon: Bell,
      title: '通知設定',
      subtitle: '管理推播通知偏好',
      action: () => console.log('通知設定')
    },
    {
      icon: Shield,
      title: '帳號安全',
      subtitle: '修改密碼與安全設定',
      action: () => console.log('安全設定')
    },
    {
      icon: HelpCircle,
      title: '幫助中心',
      subtitle: '常見問題與客服聯絡',
      action: () => console.log('幫助中心')
    },
    {
      icon: Settings,
      title: '應用程式設定',
      subtitle: '偏好設定與隱私選項',
      action: () => console.log('設定')
    }
  ];

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile(prev => ({
          ...prev,
          avatar: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // 取消編輯，恢復原始資料
      setEditForm({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setProfile(prev => ({
      ...prev,
      ...editForm
    }));
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    const confirmed = window.confirm('確定要登出嗎？');
    if (confirmed) {
      localStorage.removeItem('token');
      dispatch(setUserStateGetter(false)); // toggle
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        {/* 個人資料卡片 */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper} onClick={handleAvatarClick}>
                {profile.avatar ? (
                  <img src={profile.avatar} alt="頭像" className={styles.avatar} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <User />
                  </div>
                )}
                <div className={styles.avatarOverlay}>
                  <Camera />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className={styles.hiddenInput}
              />
            </div>
            
            <button 
              className={styles.editBtn}
              onClick={handleEditToggle}
            >
              {isEditing ? <X /> : <Edit3 />}
            </button>
          </div>

          <div className={styles.profileInfo}>
            {isEditing ? (
              <div className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label>姓名</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className={styles.editInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className={styles.editInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>電話</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    className={styles.editInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>地址</label>
                  <input
                    type="text"
                    name="address"
                    value={editForm.address}
                    onChange={handleInputChange}
                    className={styles.editInput}
                  />
                </div>
                <button className={styles.saveBtn} onClick={handleSave}>
                  <Save />
                  儲存變更
                </button>
              </div>
            ) : (
              <>
                <h2 className={styles.userName}>{profile.name}</h2>
                <div className={styles.userRank}>
                  <Award />
                  {profile.rank}
                </div>
                
                <div className={styles.contactInfo}>
                  <div className={styles.infoItem}>
                    <Mail />
                    <span>{profile.email}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <Phone />
                    <span>{profile.phone}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <MapPin />
                    <span>{profile.address}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <Calendar />
                    <span>加入時間：{formatDate(profile.joinDate)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 愛心統計 */}
        <div className={styles.statsCard}>
          <h3 className={styles.statsTitle}>我的愛心足跡</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <Coins />
              </div>
              <div className={styles.statNumber}>
                {profile.totalDonated.toLocaleString()}
              </div>
              <div className={styles.statLabel}>總捐贈金額</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <Heart />
              </div>
              <div className={styles.statNumber}>
                {profile.helpedCount}
              </div>
              <div className={styles.statLabel}>幫助人次</div>
            </div>
          </div>
        </div>

        {/* 功能選單 */}
        <div className={styles.menuCard}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={styles.menuItem}
              onClick={item.action}
            >
              <div className={styles.menuIcon}>
                <item.icon />
              </div>
              <div className={styles.menuContent}>
                <div className={styles.menuTitle}>{item.title}</div>
                <div className={styles.menuSubtitle}>{item.subtitle}</div>
              </div>
              {item.badge && (
                <div className={styles.menuBadge}>{item.badge}</div>
              )}
              <ChevronRight className={styles.menuArrow} />
            </button>
          ))}
        </div>

        {/* 登出按鈕 */}
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut />
          登出帳號
        </button>
      </div>
    </div>
  );
};

export default Profile;
