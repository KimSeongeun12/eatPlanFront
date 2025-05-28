import './myInfo_updateCss.css'

export default function MyInfoUpdate() {
    const user_id = sessionStorage.getItem("user_id");

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

    return (
        <>
            <div>
                <div className={"infoTap"}>
                    <div className={"profileTap"}>
                        <img className={"userImage"} src={"유저 아이콘_기본 프로필 사진.png"} alt={"유저 아이콘 기본 프로필 사진"}/><br/>
                        <label>프로필 사진</label>
                    </div>
                    <table>
                        <tbody>
                        <tr style={trStyle}>
                            <th style={thStyle}>ID</th>
                            <td>{user_id}</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>PASSWORD</th>
                            <td>비밀번호 수정 컴포넌트 연결(모달)</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>닉네임</th>
                            <td>
                                <input className={"nickname_update"} type={"text"} />
                                <button className={"updateButton"}>중복 확인</button>
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>이메일</th>
                            <td>
                                <input className={"email_update"} type={"text"} />
                                <button className={"updateButton"}>중복 확인</button>
                            </td>
                        </tr>
                        <tr className={"bioTable"} style={trStyle}>
                            <th style={thStyle}>자기소개</th>
                            <td>
                                <input className={"bio_update"} type={"text"} />
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>지역</th>
                            <td>
                                <input type={"text"} />
                            </td>
                        </tr>
                        <tr className={"tag_tr"} style={trStyle}>
                            <th style={thStyle}>선호 태그</th>
                            <td className={"tag_td"}>
                                <div>태그1, 태그2, 태그3</div>
                                <button className={"updateButton"}>태그 선택</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className={"footer"}>
                    <button className={"infoUpdateButton"}>수정 완료</button>
                </div>
            </div>
        </>
    );
}