import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/auth_context'
import classes from './login.module.css';

import Link from 'next/link';
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const { login, login_username, checkLoginStatus,logout } = useAuth();
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();


    if (username.length === 0) {
      setError('사용자 이름을 입력해 주세요')
      return;
    }
    if (password.length === 0) {
      setError('비밀번호를 입력해 주세요')
      return;
    }

    fetch('/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          password: password
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.ERROR) {
          setError(data.ERROR)
          return;
        }
        setError('')
        console.log(data.message)
        localStorage.setItem('token', data.data)
        login();
        checkLoginStatus();
        setLoading(true);
        router.push('../mypage');
      })
      .catch((err) => {
        setError("LOGIN FAILED")
        console.error('LOGIN FAILED', err)
      });

  };

  return loading ? (
    <h1 className={classes.loading}>로그인에 성공하였습니다. 페이지를 이동합니다...</h1>
  ) : (
    <div className={classes.container}>
      <div className={classes.loginBox}>
        <h1 className={classes.title}>로그인</h1>
        {error && <div className={classes.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.inputGroup}>
            <label>사용자 이름:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className={classes.inputGroup}>
            <label>비밀번호:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className={classes.loginButton}>로그인</button>
        </form>
        
        <button onClick={() => router.push('/auth/signup')} className={classes.signupButton}>회원가입</button>
        {login_username && (
          <div className={classes.loggedIn}>
            <hr/>
            {login_username}님 로그인 상태입니다.<button className={classes.logoutButton} onClick={logout}>로그아웃</button><br/>
            <Link href='/mypage'>마이페이지 이동</Link>
          </div>
        )}
      </div>
    </div>
  );
}