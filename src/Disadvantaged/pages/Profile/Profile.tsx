import React, { useState, useRef } from 'react';
import {
  User,
  Camera,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Gift,
  Package,
  Settings,
  LogOut,
  Shield,
  Bell,
  FileText,
  HelpCircle,
  ChevronRight,
  Save,
  X,
  Heart
} from 'lucide-react';
import Header from '../../components/Header/Header';
import styles from './Profile.module.scss';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    id: '001',
    name: '李小華',
    email: 'li.xiaohua@example.com',
    phone: '0987-654-321',
    address: '新北市板橋區中山路二段88號',
    joinDate: '2023-03-20',
    avatar: '',
    totalReceived: 5,
    supportCount: 8,
    status: '受助中'
  });

  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address
  });

  const navigate = useNavigate();

  const stats = [
    { number: "12", label: "獲得幫助" },
    { number: "8", label: "申請中" }
  ];

  const functions = [
    {
      icon: Package,
      name: "我的申請",
      desc: "查看申請狀態",
      action: () => navigate('/applications')
    },
    {
      icon: Gift,
      name: "收到的幫助",
      desc: "查看獲得的援助",
      action: () => navigate('/received')
    },
    {
      icon: Calendar,
      name: "預約記錄",
      desc: "查看預約服務",
      action: () => navigate('/appointments')
    },
    {
      icon: Bell,
      name: "通知設定",
      desc: "管理推播通知",
      action: () => navigate('/notifications')
    }
  ];

  const settings = [
    {
      icon: Settings,
      name: "帳號設定",
      desc: "修改個人資料",
      action: () => navigate('/settings')
    },
    {
      icon: Shield,
      name: "隱私與安全",
      desc: "資料保護設定",
      action: () => navigate('/privacy')
    },
    {
      icon: HelpCircle,
      name: "幫助與回饋",
      desc: "常見問題與客服",
      action: () => navigate('/help')
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
      dispatch(setUserStateGetter(false)); // 切換使用者狀態
      console.log('使用者登出');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className={styles.profilePage}>
      
      <div className={styles.container}>
        

        {/* 功能列表 */}
        <div className={styles.functionList}>
          <div className={styles.functionTitle}>我的服務</div>
          {functions.map((func, index) => (
            <div 
              key={index} 
              className={styles.functionItem}
              onClick={func.action}
            >
              <div className={styles.functionIcon}>
                <func.icon />
              </div>
              <div className={styles.functionContent}>
                <div className={styles.functionName}>{func.name}</div>
                <div className={styles.functionDesc}>{func.desc}</div>
              </div>
              <div className={styles.functionArrow}>
                <ChevronRight />
              </div>
            </div>
          ))}
        </div>

        {/* 設定區域 */}
        <div className={styles.settingsCard}>
          <div className={styles.settingsTitle}>設定與幫助</div>
          {settings.map((setting, index) => (
            <div 
              key={index} 
              className={styles.functionItem}
              onClick={setting.action}
            >
              <div className={styles.functionIcon}>
                <setting.icon />
              </div>
              <div className={styles.functionContent}>
                <div className={styles.functionName}>{setting.name}</div>
                <div className={styles.functionDesc}>{setting.desc}</div>
              </div>
              <div className={styles.functionArrow}>
                <ChevronRight />
              </div>
            </div>
          ))}
          
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} style={{ marginRight: '8px' }} />
            登出帳號
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
