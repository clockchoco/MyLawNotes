import { getFullLaw } from "@/utils/get_law";
import { useEffect, useState, useRef } from "react";
import pathData from '@/data/paths'
import classes from "./[law_page].module.css"
import { useAuth } from "@/utils/auth_context";
import ParseIndexToClassName from "@/utils/parseIndexToClassName";
import Sidebar from "@/components/sidebar";
import { ToggleButton, ScrollToTopButton } from "@/components/button";
function GetLaw(props) {
  const [buttonState, setButtonState] = useState(false);
  const [selectedElements, setSelectedElements] = useState([]);
  const [fetchFlag, setFetchFlag] = useState(false);
  const { login_username } = useAuth();
  const { raw_law_data, law_page } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mainContentRef = useRef(null);
  
  useEffect(() => {
    if (!login_username) return;

    fetch(`/api/get-user-selections/${law_page}?username=${login_username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((res) => res.json())
      .then((data) => setSelectedElements(data))
      .catch((error) => console.error('GET METHOD FAILED', error));
  }, [fetchFlag, law_page, login_username]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'z' || event.key === 'Z') {
        handleClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [buttonState]);


  
  
  function handleClick() {
    setButtonState(!buttonState);
  }



  function handler(index) {
    for (const el of selectedElements) {
      if (el.index === index.toString()) return classes.selected;
    }
    return "";
  }

  function handleSelect(event) {
    if (buttonState) {
      if (!event.target.classList.contains(classes.selected)) {
        fetch(`/api/get-user-selections/${law_page}`, {
          method: 'POST',
          body: JSON.stringify({
            username: login_username,
            index: event.target.getAttribute('index'),
            text: event.target.firstChild.textContent
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((res) => res.json())
          .then((data) => console.log(data))
          .catch((error) => console.error('POST METHOD FAILED', error));
      }
      else {
        fetch(`/api/get-user-selections/${law_page}`, {
          method: 'DELETE',
          body: JSON.stringify({
            username: login_username,
            index: event.target.getAttribute('index')
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((res) => res.json())
          .then((data) => console.log(data))
          .catch((error) => console.error('DELETE METHOD FAILED', error))
      }

      setFetchFlag(!fetchFlag);
    }
    else {

    }

  }

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  function handleScrollToTop() {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div className={classes.container}>
      <Sidebar onToggle={handleSidebarToggle} />
      <main ref={mainContentRef} className={`${classes.mainContent} ${isSidebarOpen ? classes.open : classes.closed}`}>
      <ToggleButton buttonState={buttonState} handleClick={handleClick} />
      <ScrollToTopButton handleScrollToTop={handleScrollToTop} />
        {raw_law_data.map(d => (
          <h2
            onClick={handleSelect}
            index={d.index}
            key={d.index}
            className={`${handler(d.index)} ${buttonState ? classes.active : ""} ${classes[ParseIndexToClassName(d.index)]}`}>{d.text}
          </h2>))
        }
      </main>
    </div>
  )
}
export function getStaticPaths() {

  const paths = pathData.map((item) => ({
    params: {
      law_page: item.page_num.toString()
    },
  }));
  return {
    paths,
    fallback: false,
  };
}
export async function getStaticProps({ params }) {
  const data = await getFullLaw(pathData[params.law_page - 1]["law_num"], params.law_page);
  return {
    props: {
      raw_law_data: data,
      law_page: params.law_page,
    },
    revalidate: 604800
  }
}

export default GetLaw;


