'use client'
import '../mainCss.css'
import './myPageCss.css'

export default function myInfo() {
    const trStyle = {
        border: '1px solid lightgray',
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

    const tdStyle = {
        boxSizing: 'border-box',
        paddingLeft: '30px',
        textAlign: 'left',
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
                            <td style={tdStyle}>아이디</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>PASSWORD</th>
                            <td style={tdStyle}>비밀번호</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>닉네임</th>
                            <td style={tdStyle}>닉네임</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>이메일</th>
                            <td style={tdStyle}>이메일</td>
                        </tr>
                        <tr className={"bioTable"} style={trStyle}>
                            <th style={thStyle}>자기소개</th>
                            <td style={tdStyle}>자기소개</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>지역</th>
                            <td style={tdStyle}>지역</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>선호 태그</th>
                            <td style={tdStyle}>선호 태그</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className={"footer"}>
                    <span className={"secessionSpan"}>회원 탈퇴</span>
                    <button className={"infoUpdateButton"}>회원 정보 수정</button>
                </div>
            </div>
        </>
    );
}