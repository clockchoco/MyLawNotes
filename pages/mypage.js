import { useEffect, useState, useRef } from 'react';

import { useAuth } from '@/utils/auth_context';
import Sidebar from '@/components/sidebar';
import classes from './mypage.module.css';
import { ScrollToTopButton } from "@/components/button";

export default function MyPage(props) {

  const [user_data, set_user_data] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDataEmpty, setIsDataEmpty] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mainContentRef = useRef(null);
  const { login_username } = useAuth();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!login_username) return;

    const promises = [];
    for (let page_num = 1; page_num <= 8; page_num++) {
      promises.push(
        fetch(`/api/get-user-selections/${page_num}?username=${login_username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        }).then((res) => res.json())
      );
    }
    Promise.all(promises)
      .then((results) => {
        const newData = results.flat();
        set_user_data(newData);
        if(user_data.length === 0) setIsDataEmpty(true);
        else setIsDataEmpty(false); 
      })
      .catch((error) => {
        console.error('GET METHOD FAILED', error);
      });

  }, [login_username]);

  useEffect(() => {
    if (window.innerWidth <= 600) {
      setIsMobile(true);
    }
  }, []);

  function handleScrollToTop() {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };




  const handleDelete = (index) => {
    if (!index) return;
    const fetchLawPageId = index.charAt(0);
    fetch(`/api/get-user-selections/${fetchLawPageId}?username=${login_username}`, {
      method: 'DELETE',
      body: JSON.stringify({
        username: login_username,
        index: index
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json())
      .then(() => set_user_data(user_data.filter(data => data.index !== index)))
      .catch((error) => console.error('DELETE METHOD FAILED', error));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (index) => {
    if (touchStartX.current - touchEndX.current > 150) {  
      const element = document.querySelector(`[index="${index}"]`);
      if (element) {
        element.classList.add(classes.swiped);
        setTimeout(() => handleDelete(index), 300);  
      }
    }
  };

  return (
    <div className={classes.container}>
      <Sidebar onToggle={handleSidebarToggle} />
      <main ref={mainContentRef} className={`${classes.mainContent} ${isSidebarOpen ? classes.mainContentOpen : classes.mainContentClosed}`}>
        <ScrollToTopButton handleScrollToTop={handleScrollToTop} />
        <h1 className={classes.pageTitle}>
          {login_username}님의 {isMobile ? <br /> : ''}마이페이지
        </h1>
        {isDataEmpty ? <h3 className={classes.noDataMessage}>아직 저장된 항목이 없습니다. {isMobile ? <br /> : ''}법률 항목을 추가해보세요!</h3> : ''}
        {user_data.map((data) => (
          <div
            key={data.index}
            onDoubleClick={() => handleDelete(data.index)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => handleTouchEnd(data.index)}
            index={data.index}
            className={classes.swipeableItem}
          >
            <h2 className={classes.itemTitle}>{data.text}</h2>
          </div>
        ))}
      </main>
    </div>
  );
}