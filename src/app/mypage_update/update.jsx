'use client'
import './myInfo_updateCss.css'
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import ChangePW from "@/app/mypage_update/changePW";
import JoinTagSelectModal from "@/app/join/joinTagSelectModal";
import MypageTagSelectModal from "@/app/mypage_update/mypageTagSelectModal";

export default function Update() {
    const user_id = useRef('');
    const loginId = useRef('');
    const [ori_nickname, setOri_nickname] = useState('');
    const [ori_email, setOri_email] = useState('');

    const [nicknameChk, setNicknameChk] = useState(false);
    const [emailChk, setEmailChk] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            loginId.current = sessionStorage.getItem('user_id');
            if (!user_id.current) {
                user_id.current = loginId.current
            }
            getInfo(user_id.current);
        }
    }, []);

    const [info, setInfo] = useState({
        nickname: '',
        email: '',
        bio: '',
        location: '',
    })

    const getInfo = async () => {
        const {data} = await axios.post('http://localhost/member_list', {
            user_id: user_id.current,
        });
        console.log(data.list[0]);
        setInfo(data.list[0]);
        setOri_nickname(data.list[0].nickname);
        setOri_email(data.list[0].email);
    };

    const input = (e) => {
        const {name, value} = e.target;
        setInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // 중복 확인 - 닉네임
    const nickname_overlay = async () => {
        if (info.nickname === ori_nickname) {
            alert("변경된 내용이 없습니다.");
            setNicknameChk(true);
            return;
        }
        const {data} = await axios.get(`http://localhost/overlay/nickname/${info.nickname}`)
        // console.log(data);
        if (data.use === false) {
            alert("이미 사용 중인 닉네임입니다.");
            setNicknameChk(false);
        } else {
            alert("사용 가능한 닉네임입니다.");
            setNicknameChk(true);
        }
    }

    // 중복 확인 - 이메일
    const email_overlay = async () => {
        if (info.email === ori_email) {
            alert("변경된 내용이 없습니다.");
            setEmailChk(true);
            return;
        }
        const {data} = await axios.get(`http://localhost/overlay/email/${info.email}`)
        // console.log(data);
        if (data.use === false) {
            alert("이미 사용 중인 이메일입니다.");
            setEmailChk(false);
        } else {
            alert("사용 가능한 이메일입니다.");
            setEmailChk(true);
        }
    }

    // 회원 정보 수정
    const mypage_update = async () => {
        // 만약 선택된 태그가 1개 이상 없을 경우 태그를 선택해주세요 라는 alert 창 출력
        if (selectedTags.length === 0) {
            alert("태그를 선택해주세요.");
            return;
        }

        const {data} = await axios.put('http://localhost/member_update', {
            user_id: user_id.current,
            email: info.email,
            bio: info.bio,
            location: info.location,
            nickname: info.nickname,
        })
        console.log(data);
        if (data.success === true) {
            alert("회원 정보 수정에 성공했습니다.");
            location.href = './mypage';
        } else {
            if (nicknameChk === false) {
                alert("닉네임 중복 확인을 진행해주세요.");
            }
            if (emailChk === false) {
                alert("이메일 중복 확인을 진행해주세요.");
            }
        }
    }

    const trStyle = {
        border: '1px solid lightgray',
        height: '45px',
    }

    const thStyle = {
        boxSizing: 'border-box',
        width: '249px',
        border: '1px solid lightgray',
        backgroundColor: '#f4f4f4',
        fontWeight: 500,
        textAlign: 'left',
        paddingLeft: '30px',
    }

    // 지역 리스트 불러오기
    const [locationTagList, setLocationTagList] = useState([]);
    useEffect(() => {
        const fetchLocationTags = async () => {
            try {
                const {data} = await axios.get("http://localhost/list_tag_area");
                setLocationTagList(data.list_area);
            } catch (error) {
                console.error("지역 불러오기 실패:", error);
            }
        };

        fetchLocationTags();
    }, []);

    // user_id 에 맞는 태그 불러오기 (지역 태그, 일반 태그 포함)
    const [tags, setTags] = useState([]);
    const member_tagList = async () => {
        const {data} = await axios.post('http://localhost/member_tag_list', {user_id: loginId.current});
        console.log(data.tagnames);
        console.log(data.tagnames.length);
        if (data?.tagnames) {
            setSelectedTags(data.tagnames);
        }
    }

    useEffect(() => {
        member_tagList();
    }, []);

    // 멤버 태그 수정 (삭제 후 추가로 가야 함)
    // 태그 삭제
    const tagDelete = async () => {
        if (selectedTags.length === 0) {
            alert("선택된 태그가 없습니다.");
            return;
        }

        try {
            const { data } = await axios.delete('http://localhost/member_tag_prefer_delete', {
                data: { user_id: loginId.current }
            });

            if (data.success) {
                alert("태그가 삭제되었습니다.");
                // 최신 태그 목록을 다시 불러와서 상태 동기화
                await member_tagList();
            } else {
                alert("삭제 실패: 서버 응답 실패");
            }
        } catch (error) {
            console.error("태그 삭제 실패:", error);
            alert("태그 삭제에 실패했습니다.");
        }
    }

    const [isTagModalOpen, setIsTagModalOpen] = useState(false);

    const handleTagSelect = (tags) => {
        // data.tagnames.length
        if (selectedTags.length > 2) {
            alert("태그는 3개 이상 선택이 불가능합니다.");
            return;
        }
        setSelectedTags(tags);
        setIsTagModalOpen(false);
    };

    const [previewUrl, setPreviewUrl] = useState(null);
    const [shouldAlert, setShouldAlert] = useState(false);
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const tempUrl = URL.createObjectURL(file);
            setPreviewUrl(tempUrl);

            const formData = new FormData();
            formData.append("files", file);
            formData.append("user_id", info.user_id);

            try {
                const { data } = await axios.put("http://localhost/profile_update", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                console.log(data);
                if (data.success) {
                    // 성공 시 alert 예약
                    setShouldAlert(true);
                }
            } catch (error) {
                console.error("업로드 실패:", error.response?.data || error.message);
            }
        }
    };

    useEffect(() => {
        if (previewUrl && shouldAlert) {
            alert("프로필 사진 업데이트에 성공했습니다.");
            setShouldAlert(false); // 다시 초기화
        }
    }, [previewUrl, shouldAlert]);

    return (
        <>
            <div>
                <div className={"infoTap"}>
                    <div className="profileTap">
                        <img
                            className="userImage"
                            src={
                                previewUrl
                                    ? previewUrl
                                    : info.img_idx
                                        ? `http://localhost/imageIdx/${info.img_idx}`
                                        : "/userIcon_default_profile.png"
                            }
                            alt="유저 프로필 이미지"
                        />
                        <br />
                        <input
                            type="file"
                            id="profileImageUpload"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <label htmlFor="profileImageUpload" style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
                            프로필 사진 추가
                        </label>
                    </div>
                    <table className={"infoTable"}>
                        <tbody>
                        <tr style={trStyle}>
                            <th style={thStyle}>ID</th>
                            <td className={"infoTable_td"}>{user_id.current}</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>PASSWORD</th>
                            <td onClick={() => {
                                setShowModal(true)
                            }} className={"infoTable_td_pw"}>비밀번호 수정
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>닉네임</th>
                            <td className={"infoTable_td"}>
                                <input className={"nickname_update"}
                                       type={"text"} name={"nickname"}
                                       value={info?.nickname || ''} onChange={input}/>
                                <button onClick={nickname_overlay} className={"updateButton"}>중복 확인</button>
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>이메일</th>
                            <td className={"infoTable_td"}>
                                <input className={"email_update"}
                                       type={"text"} name={"email"}
                                       value={info?.email || ''} onChange={input}/>
                                <button onClick={email_overlay} className={"updateButton"}>중복 확인</button>
                            </td>
                        </tr>
                        <tr className={"bioTable"} style={trStyle}>
                            <th style={thStyle}>자기소개</th>
                            <td className={"infoTable_td"}>
                                <input className={"bio_update"}
                                       type={"text"} name={"bio"}
                                       value={info?.bio || ''} onChange={input}/>
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>지역</th>
                            <td className={"infoTable_td"}>
                                <select
                                    className={"locationSelect"}
                                    name={"location"}
                                    onChange={input}
                                    value={info.location}>
                                    <option value="">지역을 선택하세요</option>
                                    {locationTagList.map(area => (
                                        <option key={area.area_tag_idx} value={area.tag_name}>
                                            {area.tag_name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr className={"tag_tr"} style={trStyle}>
                            <th style={thStyle}>선호 태그</th>
                            <td className={"infoTable_td"}>
                                <div className={"tag_content"}>
                                    <span className={"tagName"}>
                                          {selectedTags.length > 0 ? (
                                              selectedTags.map((tag, idx) => (
                                                  <div key={idx}># {tag}</div>
                                              ))
                                          ) : (
                                              <div>선택된 태그가 없습니다.</div>
                                          )}
                                    </span>
                                    <button onClick={tagDelete}
                                            className={"tag_updateButton"}>태그 삭제
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (selectedTags.length >= 3) {
                                                alert("이미 3개의 태그를 선택했습니다. 더 이상 선택할 수 없습니다.");
                                                return;
                                            }
                                            setIsTagModalOpen(true);
                                        }}
                                        className={"tag_updateButton"}
                                    >태그 선택
                                    </button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className={"footer"}>
                    <button onClick={mypage_update} className={"infoUpdateButton"}>수정 완료</button>
                </div>
            </div>


                {isTagModalOpen &&
                    <div className={"modal"}>
                    <MypageTagSelectModal
                        onClose={() => setIsTagModalOpen(false)}
                        onSelect={handleTagSelect}
                    />
                    </div>
                }

            {showModal && <ChangePW onClose={() => setShowModal(false)}/>}

        </>
    );
}