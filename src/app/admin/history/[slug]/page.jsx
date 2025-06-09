'use client'

import LeftMenu from "@/app/leftMenu";
import {useEffect, useRef, useState} from "react";
import './history.css'
import axios from "axios";

export default function HistoryPage(props){

    // report_idx
    const idx=useRef(1);

    useEffect(() => {
        props.params.then(({slug})=>{
            idx.current=slug;
            console.log(idx.current);
            loadReport();
        })
    }, []);

    // report_idx로 신고대상자불러오기
    const [report, setReport] = useState({});
    const loadReport = async ()=>{
        let{data} = await axios.get(`http://localhost/report_detail/${idx.current}`);
        console.log(data);
        setReport(data.detail);
    }

    return(
        <>
            <LeftMenu/>
            <div className="report-detail-rightmenu">
                <div className={"report_container"}>
                    <h2>신고 상세보기</h2>

                    <table className="report_detail_table">
                        <tbody>
                        {/* 1. 헤더 행 */}
                        <tr>
                            <th>분류</th>
                            <td>{report.isClass}</td>
                            <th>작성자</th>
                            <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                {report.reporter_nickname}
                            </td>
                            <th>신고번호</th>
                            <td>{idx.current}</td>
                        </tr>

                        {/* 2. 신고 대상자 */}
                        <tr>
                            <th>신고대상자</th>
                            <td colSpan={5}>
                                {report.suspect_nickname}
                            </td>
                        </tr>

                        {/* 3. 제목 */}
                        <tr>
                            <th>제목</th>
                            <td colSpan={5}>
                                {report.subject}
                            </td>
                        </tr>

                        {/* 4. 내용 레이블 */}
                        <tr>
                            <th colSpan={6} className="content-label">내용 *</th>
                        </tr>

                        {/* 5. 내용 텍스트영역 */}
                        <tr>
                            <td colSpan={6}>
                                {report.content}
                            </td>
                        </tr>

                        {/*{detail.files && detail.files.length > 0 && (*/}
                        {/*    <tr>*/}
                        {/*        <th>첨부파일</th>*/}
                        {/*        <td colSpan={5}>*/}
                        {/*            <ul className="attachments">*/}
                        {/*                /!*{detail.files.map((file) => *!/*/}
                        {/*            </ul>*/}
                        {/*        </td>*/}
                        {/*    </tr>*/}
                        {/*)}*/}

                        <tr>
                            <td colSpan={6}>
                                <Target reported_idx = {report.reported_idx}
                                                    isClass={report.isClass}
                                                    user_id={report.reporter_id}
                            /></td>
                        </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </>
    );
}


// 해당 게시글/댓글/쪽지 내용 (course, comment, message)
// 공통: idx, 글작성일, 제목, 작성자, 내용(content),
function Target({reported_idx, isClass, user_id}){

    useEffect(() => {
        getPost();
    }, []);

    const [post,setPost] = useState({});

    const getPost = async ()=>{
        let {data}={};
        switch(isClass){
            case 'course':
                data=await axios.get(`http://localhost/courseDetail`, {params: {post_idx: reported_idx}});
                setPost(data);
                console.log('course', data);
                break;
            case 'comment':
                data=await axios.get(`http://localhost/comment_detail/${reported_idx}`);
                setPost({idx: data.comment_idx, date: data.reg_date, subject:data.subject, content:data.content});
                console.log('comment: ',data);
                break;
            case 'message':
                data=await axios.get(`http://localhost/${user_id}/${reported_idx}/msg_detail`);
                setPost({idx:data.message.msg_idx, date:data.message.msg_date, subject:data.message.subject, content:data.message.content});
                console.log('message', data);
                break;
            default:
                break;
    }


    }

    return(
        <>
            <div>
                해당 게시글 정보
            </div>
            <div>
                {post}
            </div>
        </>
    );
}