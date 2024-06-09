import { useState } from 'react';
import { useRouter } from 'next/router';
import classes from './signup.module.css';
export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
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
    if (username.length >= 5 && password.length >= 5 && username.length < 15 && password.length < 15) {
      fetch('/api/auth/signup',
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
          console.log(data)
          setError(data.ERROR)
          if (data.message) {
            router.push('login')
            setLoading(true)
          }
        })
        .catch((err) => {
          console.error('SIGNUP FAILED', err)
        });
    } else if (username.length < 5) {
      setError("사용자 이름이 너무 짧습니다.");
    } else if (username.length > 15) {
      setError("사용자 이름이 너무 깁니다.");
    } else if (password.length < 5) {
      setError("비밀번호가 너무 짧습니다.");
    } else if (password.length > 15) {
      setError("비밀번호가 너무 깁니다.");
    }
  }


  return loading ? (
    <h1 className={classes.loading}>회원가입에 성공하였습니다. 페이지를 이동합니다...</h1>
  ) : (
    <div className={classes.container}>
      <div className={classes.signupBox}>
        <h1 className={classes.title}>회원가입</h1>
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
          <button type="submit" className={classes.signupButton}>가입</button>
        </form>
        <button onClick={() => router.push('/auth/login')} className={classes.loginButton}>로그인으로 돌아가기</button>
      </div>
    </div>
  );


}
