import React, {useState} from "react";

export default function infoInput({input, setInput, confirmPass, overlayId, overlayNickname, confirmref, setConfirmPass}) {
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

    const buttonStyle = {
        boxSizing: 'border-box',
        width: '126px',
        height: '52px',
        marginTop: '4px',
        marginBottom: '5px',
        backgroundColor: '#CC503B',
        border: '2px solid #CC503B',
        borderRadius: '20px',
        fontFamily: 'Noto Sans',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '16px',
        lineHeight: '22px',
        textAlign: 'center',
        color: 'white',
    }

    return (
        <>
            <div className={"left"}>
                <label>아이디<span style={style}> *</span></label><br/>
                <input type={"text"} placeholder={"아이디를 입력해주세요."}
                       className={"idInput"} name={"user_id"} value={input.user_id} onChange={handleChange}/>
                <button style={buttonStyle} onClick={overlayId}>중복 확인</button>
                <br/>

                <label>비밀번호<span style={style}> *</span></label><br/>
                <input type={"password"} placeholder={"비밀번호를 입력해주세요."}
                       className={"pwInput"} name={"pass"} value={input.pass} onChange={handleChange}/><br/>

                <label>비밀번호 확인<span style={style}> *</span></label><br/>
                <input type={"password"} placeholder={"비밀번호 재확인"}
                       className={"pwAgainInput"} ref={confirmref} value={confirmPass} onChange={(e)=>{setConfirmPass(e.target.value)}}/><br/>

                <label>자기소개</label><br/>
                <textarea className={"bioarea"} name={"bio"} onChange={handleChange}
                          value={input.bio} />
            </div>

            <div className={"right"}>
                <label>닉네임<span style={style}> *</span></label><br/>
                <input type={"text"} placeholder={"닉네임을 입력해주세요."}
                       className={"nickInput"} name={"nickname"} onChange={handleChange}/>
                <button style={buttonStyle} onClick={overlayNickname}>중복 확인</button>
                <br/>

                <label>선호 카테고리 (3개 이하)<span style={style}> *</span></label>
                <div className={"tags"}>
                    <span className={"tagName"}>태그 1, 태그 2, 태그 3</span>
                </div>
                <button style={buttonStyle}>태그 선택</button>
                <br/>

                <label>지역</label><br/>
                <select className={"locationSelect"} name={"location"} onChange={handleChange} value={input.location} >
                    <option>지역1</option>
                    <option>지역2</option>
                    <option>지역3</option>
                </select><br/>

                <label>프로필 사진</label><br/>
                <div className={"profile"}>
                    <img src={"유저 아이콘_기본 프로필 사진.png"} alt={"기본 프로필 사진"}/>
                    <img className={"cameraIcon"} src={"카메라 아이콘.png"} alt={"카메라 아이콘"}/>
                    <span className={"deleteSpan"}>사진 삭제</span>
                </div>
            </div>
        </>
    );
}