import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      alert("로그인 메일 전송 실패!");
    } else {
      alert("📮 로그인 링크가 이메일로 전송되었어요!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>📮 로그인</h2>
        <p>다꾸를 저장하려면 이메일을 입력하세요</p>
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleLogin}>로그인 링크 보내기</button>
      </div>
    </div>
  );
}
