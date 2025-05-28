'use client'
import {useEffect, useRef, useState} from "react";

export default function CourseWrite() {
    let div = useRef(null);
    const [editorInstance, setEditorInstance] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.RichTextEditor && div.current) {
            const editor = new window.RichTextEditor(div.current);
            setEditorInstance(editor);
        }
    }, []);

    return (
        <>
            <div className={"rightMenu"}>
                <table>
                    <tbody>
                    <tr>
                        <td className={"courseWrite_td"}>제목</td>
                        <td className={"courseWrite_td"}><input/></td>
                    </tr>
                    <tr>
                        <td colSpan={2}>코스 등록</td>
                    </tr>
                    <tr>
                        <td colSpan={2}><input/></td>
                    </tr>
                    </tbody>
                </table>
                <button>코스 추가</button>
                <table>
                    <tbody>
                    <tr>
                        <td colSpan={2}>지도 상세보기 (1개 이상의 코스가 등록될 시 자동으로 추가됩니다.)</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>개인 코멘트 입력</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <div className={"writeForm"} ref={div}></div>
                        </td>
                    </tr>
                    <tr>
                        <td>공개 및 비공개 여부</td>
                        <td><input type={"radio"}/>공개&nbsp;<input type={"radio"}/>비공개</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>태그 (최대 5개까지 선택 가능)</td>
                    </tr>
                    <tr><td colSpan={2}></td></tr>
                    </tbody>
                </table>
                <button>임시 저장</button>
                <button>코스 등록</button>
            </div>
        </>
    );
}