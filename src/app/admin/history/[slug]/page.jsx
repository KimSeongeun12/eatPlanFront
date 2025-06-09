'use client'

import LeftMenu from "@/app/leftMenu";
import {useEffect, useRef, useState} from "react";
import './history.css'
import axios from "axios";
import HistoryInput from "@/app/admin/component/historyInput";

export default function HistoryPage(props) {

    // report_idx
    const idx = useRef(1);

    useEffect(() => {
        props.params.then(({slug}) => {
            idx.current = slug;
            // console.log(idx.current);
            loadReport();
        });
    }, []);

    // report_idx로 신고대상글불러오기
    const [report, setReport] = useState({});
    const [reported, setReported] = useState({});

    const loadReport = async () => {
        let {data} = await axios.get(`http://localhost/report_detail/${idx.current}`);
        setReport(data.detail);
        setReported(data.reported_course);
    }

    return (
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
                                {report.suspect_id}
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
                                <Target reported_idx={reported.reported_idx}
                                        isClass={reported.isClass}
                                        user_id={reported.reporter_id}
                                        report_idx={idx.current}
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
function Target({reported_idx, isClass, user_id, report_idx}) {

    useEffect(() => {
        console.log('post idx, class, user_id, report_idx', reported_idx, isClass, user_id, report_idx);
        getPost();
    }, []);

    const [post, setPost] = useState({});

    const getPost =  () => {
        switch (isClass) {
            case 'course':
                    axios.get(`http://localhost/courseDetail`, {params: {post_idx: reported_idx}}).then(({data}) => {
                    setPost({
                        idx:reported_idx,
                        date: data.reported_course.reg_date,
                        subject: data.reported_course.subject,
                        content: data.reported_course.post_cmt
                    });
                    // console.log('course', data);
                });
                break;
            case 'comment':
                axios.get(`http://localhost/comment_detail/${reported_idx}`).then(({data}) => {
                    setPost({idx: data.comment_idx, date: data.reg_date, subject: data.subject, content: data.content});
                    // console.log('comment: ', data);
                });
                break;
            case 'message':
                axios.get(`http://localhost/${user_id}/${reported_idx}/msg_detail`).then(({data}) => {
                    setPost({
                        idx: data.message.msg_idx,
                        date: data.message.msg_date,
                        subject: data.message.subject,
                        content: data.message.content
                    });
                    // console.log('message', data);
                });
                break;
            default:
                break;
        }
    }

    return (
        <>
            <div>
                해당 게시글 정보(target)
            </div>
            ...
            <div>
            </div>
            <History report_idx={report_idx} />
        </>
    );
}



function History({report_idx}) {

    const [list, setList] = useState([]);

    useEffect(() => {
        drawList();
    }, [report_idx]);

    // 리스트 불러오기
    const drawList=async ()=>{
        let {data}=await axios.get(`http://localhost/history_list/${report_idx}`);
        const posts=data.list.map((item)=>{
            return(
                <div key={item.his_idx} style={{border:"1px solid gray", padding:"10px"}}>
                    <div>{item.user_id}</div>
                    <div>{item.content}</div>
                    <div>{formattingDate(item.done_date)}</div>
                </div>
            );
        });
        setList(posts);
    }

    const formattingDate=(dateStr)=>{
        return new Date(dateStr).toLocaleDateString('ko-KR').toString();
    }

    return (
        <div className={"component-history"}>
            <HistoryInput report_idx={report_idx} drawList={drawList} />
            {list}
        </div>
    );
}
