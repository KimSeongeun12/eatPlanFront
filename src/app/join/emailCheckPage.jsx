import './joinCss.css'
import {useEffect, useState} from "react";
import axios from "axios";

export default function emailCheckPage({input, setInput, confirmPass, setEmailAuth}) {

    // email 기능 백엔드에서 axios로 추가
    const style = {
        color: '#FF0000',
    }

    // ----------이메일 인증 기능-------------//   // 인증번호가 맞는지 식별하는 state
    const sendEmail=async ()=>{
        console.log(input.email);
        alert("이메일로 인증 코드가 발송되었습니다.");
        let {data}=await axios.post(`http://localhost/sendNumber`, {'email':input.email});
        // alert(data.result);
        console.log(data);
    }
    const [num, setNum] = useState(0);
    const checkEmail=async ()=>{
        let {data}=await axios.get(`http://localhost/checkNumber/${num}`);
        console.log(data);
        if(data.success){
            alert('인증되었습니다.');
            setEmailAuth(true);
        }else{
            alert('인증번호가 다릅니다. 다시 시도해 주세요.');
            setEmailAuth(false);
        }
    }
    const insertNum=(e)=>{
        setNum(e.target.value);
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
                <button className={"emailCheckButton"} onClick={()=>sendEmail()}>이메일 인증하기</button>
            </div>
            <div className={"AuthCodeDiv"}>
                <label>인증 코드<span style={style}> *</span></label><br/>
                <input className={"authcodeInput"} type={"text"}
                       placeholder={"인증 코드 5자리를 입력해주세요."}
                       name={"authcode"}
                       value={num}
                       onChange={(e)=>insertNum(e)}
                />
                <button className={"emailCheckButton"} onClick={()=>checkEmail()}>인증번호 확인</button>
            </div>
        </>
    );
}