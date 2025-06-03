import './myInfo_updateCss.css'
import {useEffect, useRef, useState} from "react";
import axios from "axios";

export default function ChangePW({onClose}) {
    const user_id = useRef('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            user_id.current = sessionStorage.getItem('user_id');
        }
    }, []);

    const [password, setPassword] = useState({
        user_id: user_id,
        pass: "",
    }); // 백엔드 코드 고쳐야 함??

    // onChange
    const input = (e) => {
        const {name, value} = e.target;
        setPassword({
            ...password,
            [name]: value
        })
    }

    const changePassword = async () => {
        if (!password.pass || !password.newPass || !password.newPass2) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        if (password.newPass !== password.newPass2) {
            alert("새 비밀번호가 일치하지 않습니다.");
            setPassword({...password, newPass: '', newPass2: '' });
            return;
        }

        const {data} = await axios.put('http://localhost/updatePassword', password);
        console.log(data);
        if (data.success === true) {
            alert("비밀번호가 변경되었습니다.");
            onClose();
        } else {
            alert("비밀번호 변경에 실패했습니다. 현재 비밀번호를 다시 확인해주세요.");
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>비밀번호 변경</h2>
                <span>회원님의 개인정보를 안전하게 보호하고, 개인정보 도용으로 인한 피해를 방지하기 위해 0일 이상 비밀번호를 변경하지 않은 경우 비밀번호 변경을 권장하고 있습니다.</span>
                
                <label>현재 비밀번호</label>
                <input type="password"
                       name={"pass"}
                       value={password.pass}
                       onChange={input}
                       placeholder="현재 비밀번호를 입력해주세요." />
                
                <label>새 비밀번호</label>
                <input type="password"
                       name={"newPass"}
                       onChange={input}
                       placeholder="새 비밀번호를 입력해주세요." />

                <input type="password"
                       name={"newPass2"}
                       onChange={input}
                       placeholder="새 비밀번호 확인" />

                <button onClick={onClose} className="close-button">❌</button>
                <button onClick={changePassword} className="submit-button">확인</button>
            </div>
        </div>
    );
}