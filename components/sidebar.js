import { useEffect, useState } from 'react';
import Link from 'next/link';
import classes from './sidebar.module.css';
import { useAuth } from '@/utils/auth_context';
import { useRouter } from 'next/router';

const Sidebar = ({ onToggle }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const { login_username, logout } = useAuth();
  
  const toggleSidebar = () => {
    onToggle(!isOpen);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (window.innerWidth <= 600) {
      setIsOpen(false);
      onToggle(false);
    }
  }, [router]);

  return (
    <>
      <div
        className={`${classes.toggleButton} ${isOpen ? classes.toggleButtonLong : classes.toggleButtonNormal}`}
        onClick={toggleSidebar}
      >
        {isOpen ? "메뉴 닫기" : "☰"}
      </div>
      <div className={`${classes.sidebar} ${isOpen ? classes.open : classes.closed}`}>
        {isOpen && (
          <>
            <div className={classes.content}>
              <div className={classes.links}>
                <Link href={'/law/1'} className={classes.link}><div key={1} className={classes.sidebarItem}>개인정보보호법</div></Link>
                <Link href={'/law/2'} className={classes.link}><div key={2} className={classes.sidebarItem}>전자서명법</div></Link>
                <Link href={'/law/3'} className={classes.link}><div key={3} className={classes.sidebarItem}>정보통신기반보호법</div></Link>
                <Link href={'/law/4'} className={classes.link}><div key={4} className={classes.sidebarItem}>정보통신망이용촉진및<br/>정보보호등에관한법률</div></Link>
                <Link href={'/law/5'} className={classes.link}><div key={5} className={classes.sidebarItem}>신용정보의이용및<br/>보호에관한법률</div></Link>
                <Link href={'/law/6'} className={classes.link}><div key={6} className={classes.sidebarItem}>전자금융거래법</div></Link>
                <Link href={'/law/7'} className={classes.link}><div key={7} className={classes.sidebarItem}>통신비밀보호법</div></Link>
                <Link href={'/law/8'} className={classes.link}><div key={8} className={classes.sidebarItem}>위치정보의보호및<br/>이용등에관한법률</div></Link>
                <Link href={'/mypage'} className={`${classes.link} ${classes.mypage}`}><div key={9} className={classes.sidebarItem}>마이페이지</div></Link>
              </div>
            </div>
            <div className={classes.userSection}>
              <p className={classes.loginStatus}>
                <span className={classes.webtitle}>MyLawNotes</span> <br/><small className={classes.username}>{login_username}</small>님 로그인 상태입니다.
              </p>
              <button onClick={logout} className={classes.logoutButton}>Logout</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
