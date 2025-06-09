import './myInfo_updateCss.css'
import {useEffect, useState} from "react";
import axios from "axios";

export default function ChangePW({onClose}) {
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
        new_pass: '',
        confirm_pass: '',
    });

    const input = (e) => {
        const {name, value} = e.target;
        setInfo({
            ...info,
            [name]: value,
        });
    }

    const changePassword = async () => {
        const { user_id, existing_pass, new_pass, confirm_pass } = info;

        if (!existing_pass || !new_pass || !confirm_pass) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        if (new_pass !== confirm_pass) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        const {data} = await axios.put('http://localhost/mypage_updatePassword', {
            user_id,
            existing_pass,
            new_pass
        });
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
                
                <label><b>현재 비밀번호</b></label>
                <input type="password"
                       name={"existing_pass"}
                       value={info.existing_pass}
                       onChange={input}
                       placeholder="현재 비밀번호를 입력해주세요." />
                
                <label><b>새 비밀번호</b></label>
                <input type="password"
                       name={"new_pass"}
                       value={info.new_pass}
                       onChange={input}
                       placeholder="새 비밀번호를 입력해주세요." />

                <input type="password"
                       name={"confirm_pass"}
                       value={info.confirm_pass}
                       onChange={input}
                       placeholder="새 비밀번호 확인" />

                <button onClick={onClose} className="close-button">❌</button>
                <button onClick={changePassword} className="submit-button">확인</button>
            </div>
        </div>
    );
}