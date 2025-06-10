'use client'
import './findChangePWCss.css';
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";

export default function ChangePw() {
    const style = {
        color: '#FF0000',
    }

    useEffect(() => {
        const user_id = sessionStorage.getItem('user_id');
        if (user_id) {
            setInfo(prev => ({
                ...prev,
                user_id: user_id
            }));
        }
    }, []);

    const [info, setInfo] = useState({
        user_id: '',
        existing_pass: '',
        pass: '',
    });

    const input = (e) => {
        const {name, value} = e.target;
        setInfo({
            ...info,
            [name]: value,
        });
    }

    const completed = async () => {
        if (!info.existing_pass || !info.pass) {
            alert("새 비밀번호 및 비밀번호 확인은 필수로 입력해야 하는 항목입니다.");
            return;
        }

        if (info.existing_pass !== info.pass) {
            alert('비밀번호가 일치하지 않습니다.');
            setInfo(prev => ({
                ...prev,
                pass: ''
            }));
            return; // 일치하지 않으면 요청 보내지 않음
        }

        const {data} = await axios.put('http://localhost/updatePassword', {
            user_id: info.user_id,
            pass: info.existing_pass,
        });
        console.log(data);
        if (data.success === true) {
            alert('비밀번호가 변경되었습니다.');
            location.href='./login'
        } else {
            alert('비밀번호 변경에 실패했습니다.');
        }
    }

    return (
        <>
            <div className={"changePWTap"}>
                <span className={"changePWSpan"}>CHANGE PASSWORD</span>
                <div className={"newPwDiv"}>
                    <label>새 비밀번호<span style={style}> *</span></label><br/>
                    <input className={"newPWInput"}
                           type={"password"}
                           value={info.existing_pass}
                           name="existing_pass"
                           onChange={input}
                           placeholder={"비밀번호를 입력해주세요."}/>
                </div>
                <div className={"pwCheckDiv"}>
                    <label>새 비밀번호 확인<span style={style}> *</span></label><br/>
                    <input className={"pwCheckInput"}
                           type={"password"}
                           value={info.pass}
                           name="pass"
                           onChange={input}
                           placeholder={"비밀번호 재확인"} />
                </div>
                <button onClick={completed} className={"nextButton"}>변경하기</button>
            </div>
        </>
    );
}