import React, {useEffect, useState} from "react";
import JoinTagAddModal from "@/app/join/joinTagAddModal";
import axios from "axios";

export default function infoInput({
                                      input,
                                      setInput,
                                      confirmPass,
                                      overlayId,
                                      overlayNickname,
                                      confirmref,
                                      setConfirmPass
                                  }) {
    const style = {
        color: '#FF0000',
    }

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

    // input onChange
    const handleChange = (e) => {
        const {name, value} = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [isTagModalOpen, setIsTagModalOpen] = useState(false);

    const handleTagSelect = (tags) => {
        setInput(prev => ({
            ...prev,
            tags
        }));
        setIsTagModalOpen(false);
    };

    // 지역 태그 리스트 불러오기
    const [locationTagList, setLocationTagList] = useState([]);
    useEffect(() => {
        const fetchLocationTags = async () => {
            try {
                const {data} = await axios.get("http://localhost/list_tag_area");
                setLocationTagList(data.list_area);
            } catch (error) {
                console.error("지역 태그 불러오기 실패:", error);
            }
        };

        fetchLocationTags();
    }, []);

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
                       className={"pwAgainInput"} ref={confirmref} value={confirmPass} onChange={(e) => {
                    setConfirmPass(e.target.value)
                }}/><br/>

                <label>자기소개</label><br/>
                <textarea className={"bioarea"} name={"bio"} onChange={handleChange}
                          value={input.bio}/>
            </div>

            <div className={"right"}>
                <label>닉네임<span style={style}> *</span></label><br/>
                <input type={"text"} placeholder={"닉네임을 입력해주세요."}
                       className={"nickInput"} name={"nickname"} onChange={handleChange}/>
                <button style={buttonStyle} onClick={overlayNickname}>중복 확인</button>
                <br/>

                <label>선호 카테고리 (3개 이하)<span style={style}> *</span></label>
                <div className={"tags"}>
                    <span className={"tagName"}>
                    {input.tags && input.tags.length > 0
                        ? input.tags.map(tag => `#${tag.value}`).join(', ')
                        : '선택된 태그가 없습니다.'}
                </span>
                </div>
                <button style={buttonStyle} onClick={() => setIsTagModalOpen(true)}>태그 선택</button>
                <br/>

                <label>지역</label><br/>
                <select
                    className={"locationSelect"}
                    name={"location"}
                    onChange={handleChange}
                    value={input.location}>
                    <option value="">지역을 선택하세요</option>
                    {locationTagList.map(area => (
                        <option key={area.area_tag_idx} value={area.tag_name}>
                            {area.tag_name}
                        </option>
                    ))}
                </select><br/>

                {/*<label>프로필 사진</label><br/>*/}
                {/*<div className={"profile"}>*/}
                {/*    <img src={"userIcon_default_profile.png"} alt={"기본 프로필 사진"}/>*/}
                {/*    <img className={"cameraIcon"} src={"cameraIcon.png"} alt={"카메라 아이콘"}/>*/}
                {/*    <span className={"deleteSpan"}>사진 삭제</span>*/}
                {/*</div>*/}
            </div>

            {/*태그 더보기 모달*/}
            {isTagModalOpen && <JoinTagAddModal
                onClose={() => setIsTagModalOpen(false)}
                onSelect={handleTagSelect}/>}

        </>
    );
}