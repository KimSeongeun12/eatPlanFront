'use client'
import './changePwCss.css'
import React from "react";

export default function changePW() {
    const style = {
        color: '#FF0000',
    }

    // findPw와 changePw에 이메일 요청을 넣어야 함!
    // 새 비밀번호 찾기 기능이므로 스프링의 EmailController에서 이 링크로 들어올 권한을 준다


    const completed = () => {
        alert('비밀번호가 변경되었습니다.');
        location.href='./login'
    }

    return (
        <>
            <div className={"changePWTap"}>
                <span className={"changePWSpan"}>CHANGE PASSWORD</span>
                <div className={"newPwDiv"}>
                    <label>새 비밀번호<span style={style}> *</span></label><br/>
                    <input className={"newPWInput"} type={"password"} placeholder={"비밀번호를 입력해주세요."}/>
                </div>
                <div className={"pwCheckDiv"}>
                    <label>새 비밀번호 확인<span style={style}> *</span></label><br/>
                    <input className={"pwCheckInput"} type={"password"} placeholder={"비밀번호 재확인"}/>
                </div>
                <button onClick={completed} className={"nextButton"}>변경하기</button>
            </div>
        </>
    );
}