'use client'
import './changePwCss.css'
import React from "react";

export default function changePW() {
    const style = {
        color: '#FF0000',
    }

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