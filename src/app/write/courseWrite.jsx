'use client'
import './courseWriteCss.css'

export default function CourseWrite() {
    return (
        <>
            <div className={"rightMenu"}>
                <table className={"courseWrite_table"}>
                    <tbody>
                    <tr>
                        <td className={"courseWrite_td"}>제목</td>
                        <td className={"courseWrite_td"}><input/></td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={"courseWrite_td"}>코스 등록</td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={"courseWrite_td"}><input/></td>
                    </tr>
                    </tbody>
                </table>
                <button>코스 추가</button>
                <table>
                    <tbody>
                    <tr>
                        <td colSpan={2} className={"courseWrite_td"}>지도 상세보기 (1개 이상의 코스가 등록될 시 자동으로 추가됩니다.)</td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={"courseWrite_td"}></td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={"courseWrite_td"}>개인 코멘트 입력</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            {/*<div className={"writeForm"} ref={div}></div>*/}
                            <textarea/>
                        </td>
                    </tr>
                    <tr>
                        <td className={"courseWrite_td"}>공개 및 비공개 여부</td>
                        <td className={"courseWrite_td"}>
                            <input type={"radio"}/>공개&nbsp;
                            <input type={"radio"}/>비공개
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={"courseWrite_td"}>태그 (최대 5개까지 선택 가능)</td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={"courseWrite_td"}></td>
                    </tr>
                    </tbody>
                </table>
                <button>임시 저장</button>
                <button>코스 등록</button>
            </div>
        </>
    );
}