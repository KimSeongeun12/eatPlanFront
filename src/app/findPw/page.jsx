'use client'
import './findPWCss.css';
import React from "react";

export default function FindPasswordPage() {
    const style = {
        color: '#FF0000',
    }

    const send = () => {
        alert('인증 메일이 발송되었습니다.');
        location.href="/changePw";
    }

    return (
        <>
            <div className={"findPWTap"}>
                <span className={"changePWSpan"}>CHANGE PASSWORD</span>
                <div className={"idDiv"}>
                    <label>아이디<span style={style}> *</span></label><br/>
                    <input className={"idInput"} type={"text"} placeholder={"아이디를 입력해주세요."}/>
                </div>
                <div className={"emailDiv"}>
                    <label>이메일<span style={style}> *</span></label><br/>
                    <input className={"emailInput"} type={"text"} placeholder={"이메일을 입력해주세요."}/>
                </div>
                <button onClick={send} className={"nextButton"}>인증 메일 발송</button>
            </div>
        </>
    );
}