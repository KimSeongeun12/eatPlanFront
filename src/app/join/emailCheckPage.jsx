import './joinCss.css'
import {useEffect} from "react";

export default function emailCheckPage({input, setInput, confirmPass, setConfirmPass}) {

    const style = {
        color: '#FF0000',
    }

    // input onChange
    const handleChange = (e) => {
        const {name, value} = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        console.log(confirmPass);
    }, [confirmPass]);

    return (
        <>
            <div className={"emailDiv"}>
                <label>이메일<span style={style}> *</span></label><br/>
                <input className={"emailInput"} type={"text"}
                       placeholder={"이메일을 입력해주세요."} name={"email"}
                       value={input.email} onChange={handleChange}/><br/>
                <button className={"emailCheckButton"}>이메일 인증하기</button>
            </div>
            <div className={"AuthCodeDiv"}>
                <label>인증 코드<span style={style}> *</span></label><br/>
                <input className={"authcodeInput"} type={"text"}
                       placeholder={"인증 코드 6자리를 입력해주세요."}
                       name={"authcode"}/>
            </div>
        </>
    );
}