'use client'
import './myInfo_updateCss.css'
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ChangePW from "@/app/mypage_update/changePW";
import JoinTagSelectModal from "@/app/join/joinTagSelectModal";
import MypageTagSelectModal from "@/app/mypage_update/mypageTagSelectModal";

export default function Update() {
    const userId = useRef('');
    const [ori_nickname, setOri_nickname] = useState('');
    const [ori_email, setOri_email] = useState('');

    const [nicknameChk, setNicknameChk] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);


    useEffect(() => {
        const storedUserId = sessionStorage.getItem('user_id');
        if (!storedUserId) {
            alert("로그인이 필요한 서비스입니다.");
            location.href = '/login';
            return;
        }
        userId.current = storedUserId;
        getInfo(userId.current);
    }, []);

    const [info, setInfo] = useState({
        nickname: '',
        email: '',
        bio: '',
        location: '',
        img_idx: '',
    });

    const getInfo = async (id) => {
        try {
            const { data } = await axios.post('http://192.168.0.120/member_list', {
                user_id: id,
            });
            if (data.list && data.list[0]) {
                setInfo(data.list[0]);
                setOri_nickname(data.list[0].nickname);
                setOri_email(data.list[0].email);
            }
        } catch (error) {
            console.error("회원 정보 불러오기 실패:", error);
        }
    };

    const input = (e) => {
        const { name, value } = e.target;
        setInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (name === 'nickname') {
            setNicknameChk(false);
        }
    };

    const nickname_overlay = async () => {
        if (!info.nickname.trim()) {
            alert("닉네임을 입력해주세요.");
            setNicknameChk(false);
            return;
        }

        if (info.nickname === ori_nickname) {
            alert("변경된 내용이 없습니다.");
            setNicknameChk(true);
            return;
        }

        try {
            // 닉네임 중복확ㅇs
            const { data } = await axios.get(`http://192.168.0.120/overlay/nickname/${info.nickname}`);
            if (data.use === false) {
                alert("이미 사용 중인 닉네임입니다.");
                setNicknameChk(false);
            } else {
                alert("사용 가능한 닉네임입니다.");
                setNicknameChk(true);
            }
        } catch (error) {
            console.error("중복 확인 실패", error);
            alert("닉네임 중복 확인 중 오류가 발생했습니다.");
        }
    };

    const mypage_update = async () => {
        if (!nicknameChk) {
            alert("닉네임 중복 확인을 진행해주세요.");
            return;
        }
        if (selectedTags.length === 0) {
            alert("태그를 선택해주세요.");
            return;
        }

        try {
            const { data } = await axios.put('http://192.168.0.120/member_update', {
                user_id: userId.current,
                email: info.email,
                bio: info.bio,
                location: info.location,
                nickname: info.nickname,
            });

            if (data.success === true) {
                alert("회원 정보 수정에 성공했습니다.");
                location.href = './mypage';
            } else {
                alert("회원 정보 수정에 실패했습니다.");
            }
        } catch (error) {
            console.error("회원 정보 수정 실패:", error);
            alert("회원 정보 수정 중 오류가 발생했습니다.");
        }
    };

    const trStyle = {
        border: '1px solid lightgray',
        height: '45px',
    };

    const thStyle = {
        boxSizing: 'border-box',
        width: '249px',
        border: '1px solid lightgray',
        backgroundColor: '#f4f4f4',
        fontWeight: 500,
        textAlign: 'left',
        paddingLeft: '30px',
    };

    const [locationTagList, setLocationTagList] = useState([]);
    useEffect(() => {
        const fetchLocationTags = async () => {
            try {
                const { data } = await axios.get("http://192.168.0.120/list_tag_area");
                setLocationTagList(data.list_area);
            } catch (error) {
                console.error("지역 불러오기 실패:", error);
            }
        };

        fetchLocationTags();
    }, []);

    const [tags, setTags] = useState([]);
    const member_tagList = async () => {
        try {
            const { data } = await axios.post('http://192.168.0.120/member_tag_list', { user_id: userId.current });
            if (data?.tagnames) {
                setSelectedTags(data.tagnames);
            }
        } catch (error) {
            console.error("태그 불러오기 실패:", error);
        }
    };

    useEffect(() => {
        member_tagList();
    }, []);

    const tagDelete = async () => {
        if (selectedTags.length === 0) {
            alert("선택된 태그가 없습니다.");
            return;
        }

        try {
            const { data } = await axios.delete('http://192.168.0.120/member_tag_prefer_delete', {
                data: { user_id: userId.current }
            });

            if (data.success) {
                alert("태그가 삭제되었습니다.");
                await member_tagList();
            } else {
                alert("삭제 실패: 서버 응답 실패");
            }
        } catch (error) {
            console.error("태그 삭제 실패:", error);
            alert("태그 삭제에 실패했습니다.");
        }
    };

    const [isTagModalOpen, setIsTagModalOpen] = useState(false);

    const handleTagSelect = (tags) => {
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
            formData.append("user_id", userId.current);

            try {
                const { data } = await axios.put("http://192.168.0.120/profile_update", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (data.success) {
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
            setShouldAlert(false);
        }
    }, [previewUrl, shouldAlert]);


    const handleProfileDelete = async () => {
        if (!info.img_idx) {
            alert("삭제할 프로필 사진이 없습니다.");
            return;
        }

        try {
            const { data } = await axios.put(`http://192.168.0.120/profile_del/${userId.current}`);
            if (data.success) {
                alert("프로필 사진이 삭제되었습니다.");
                setPreviewUrl(null);
                setInfo((prev) => ({
                    ...prev,
                    img_idx: null, // img_idx 초기화
                }));
            } else {
                alert("프로필 사진 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("프로필 사진 삭제 실패:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

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
                                        ? `http://192.168.0.120/imageIdx/${info.img_idx}`
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
                        <div style={{ marginTop: "10px" }}>
                            <label htmlFor="profileImageUpload" style={{ cursor: "pointer", color: "blue", textDecoration: "underline", marginRight: "10px" }}>
                                프로필 사진 추가
                            </label>
                            <span
                                onClick={handleProfileDelete}
                                style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                            >
        프로필 사진 삭제
    </span>
                        </div>
                    </div>
                    <table className={"infoTable"}>
                        <tbody>
                        <tr style={trStyle}>
                            <th style={thStyle}>ID</th>
                            <td className={"infoTable_td"}>{userId.current}</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>PASSWORD</th>
                            <td onClick={() => setShowModal(true)} className={"infoTable_td_pw"}>
                                비밀번호 수정
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>닉네임</th>
                            <td className={"infoTable_td"}>
                                <input
                                    className={"nickname_update"}
                                    type={"text"}
                                    name={"nickname"}
                                    value={info?.nickname || ''}
                                    onChange={input}
                                />
                                <button onClick={nickname_overlay} className={"updateButton"}>
                                    중복 확인
                                </button>
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>이메일</th>
                            <td className={"infoTable_td"}>
                                <input
                                    className={"email_update"}
                                    type={"text"}
                                    name={"email"}
                                    value={info?.email || ''}
                                    onChange={input}
                                />
                            </td>
                        </tr>
                        <tr className={"bioTable"} style={trStyle}>
                            <th style={thStyle}>자기소개</th>
                            <td className={"infoTable_td"}>
                                <input
                                    className={"bio_update"}
                                    type={"text"}
                                    name={"bio"}
                                    value={info?.bio || ''}
                                    onChange={input}
                                />
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>지역</th>
                            <td className={"infoTable_td"}>
                                <select
                                    className={"locationSelect"}
                                    name={"location"}
                                    onChange={input}
                                    value={info.location}
                                >
                                    <option value="">지역을 선택하세요</option>
                                    {locationTagList.map((area) => (
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
                                    <button onClick={tagDelete} className={"tag_updateButton"}>
                                        태그 삭제
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
                                    >
                                        태그 선택
                                    </button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className={"footer"}>
                    <button onClick={mypage_update} className={"infoUpdateButton"}>
                        수정 완료
                    </button>
                </div>
            </div>

            {isTagModalOpen && (
                <div className={"modal"}>
                    <MypageTagSelectModal
                        onClose={() => setIsTagModalOpen(false)}
                        onSelect={handleTagSelect}
                    />
                </div>
            )}

            {showModal && <ChangePW onClose={() => setShowModal(false)} />}
        </>
    );
}