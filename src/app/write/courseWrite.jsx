'use client'
import './courseWriteCss.css'

export default function CourseWrite() {
    const style = {
        color: '#FF0000',
    }

    return (
        <>
            <div className={"course_rightMenu"}>
                <button className={"courseWrite_button"}>임시저장 불러오기</button>
                <table className={"courseWrite_table_one"}>
                    <tbody>
                    <tr>
                        <td className={"courseWrite_td_subject"}>제목<span style={style}> *</span></td>
                        <td className={"courseWrite_td"}>
                            <input type={"text"}
                                   className={"courseWrite_subject"}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={"courseWrite_td"}>코스 등록<span style={style}> *</span></td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={"courseWrite_td"}>
                            <div className={"courseWrite_uploadDiv"}></div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button className={"courseWrite_button"}>코스 추가</button>
                <table className={"courseWrite_table_two"}>
                    <tbody>
                    <tr>
                        <td colSpan={2} className={"courseWrite_td"}>지도 상세보기 (1개 이상의 코스가 등록될 시 자동으로 추가됩니다.)</td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={"courseWrite_td"}>
                            <div className={"courseWrite_uploadDiv"}></div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={"courseWrite_td"}>개인 코멘트 입력</td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={"courseWrite_td"}>
                            <textarea className={"courseWrite_textarea"}/>
                        </td>
                    </tr>
                    <tr>
                        <td className={"courseWrite_td_public"}>공개 및 비공개 여부<span style={style}> *</span></td>
                        <td className={"courseWrite_td_radio"}>
                            <input type={"radio"}/>공개&nbsp;
                            <input type={"radio"}/>비공개
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={"courseWrite_td"}>태그 (최대 5개까지 선택 가능)<span style={style}> *</span></td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={"courseWrite_td"}>
                            <div className={"courseWrite_uploadDiv"}></div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button className={"courseWrite_button"}>코스 등록</button>
                <button className={"courseWrite_button"}>임시저장</button>
            </div>
        </>
    );
}