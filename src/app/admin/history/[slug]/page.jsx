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
            loadReport();
        });
    }, []);

    // report_idx로 신고대상글불러오기
    const [report, setReport] = useState({});
    const [reported, setReported] = useState({});

    const loadReport = async () => {
        let {data} = await axios.get(`http://localhost/report_detail/${idx.current}`);

        setReport(data.detail);
        console.log(report);
        switch (report.isClass) {
            case 'course':
                setReported(data.reported_course);
                console.log('course가 입력', reported);
                break;
            case 'comment':
                setReported(data.reported_cmt);
                console.log('comment가 입력', reported);
                break;
            default:
                setReported(data.reported_msg);
                console.log('message가 입력', reported);
                break;
        }
        drawTarget();
    }

    const [component, setComponent] = useState(null);

    const drawTarget = () => {
        // 코스
        if (report.isClass === 'course') {
            setComponent(
                <Target reported_idx={report.reported_idx}
                        isClass={report.isClass}
                        user_id={reported.user_id}
                        report_idx={idx.current}/>
            );
            // 답글
        } else if (report.isClass==='comment'){
            setComponent(
                <Target reported_idx={reported.comment_idx}
                        isClass={report.isClass}
                        user_id={reported.user_id}
                        report_idx={idx.current}/>
            );
        }
        // 쪽지
        else{
            setComponent(
                <Target reported_idx={reported.msg_idx}
                        isClass={report.isClass}
                        user_id={reported.reporter_id}
                        report_idx={idx.current}/>
            );
        }
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

                        <tr>
                            <td colSpan={6}>
                                {component}
                            </td>
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

    const formattingDate=(dateStr)=>{
        return new Date(dateStr).toLocaleDateString('ko-KR').toString();
    }

    useEffect(() => {
        console.log('post idx, class, user_id, report_idx', reported_idx, isClass, user_id, report_idx);
        getPost();
    }, []);

    const [post, setPost] = useState({});

    const getPost = () => {
        switch (isClass) {
            case 'course':
                axios.get(`http://localhost/courseDetail`, {params: {post_idx: reported_idx}}).then(({data}) => {
                  setPost({
                        idx: reported_idx,
                        date: formattingDate(data.detail.content.reg_date),
                        subject: data.detail.content.subject,
                        content: data.detail.content.post_cmt
                    });
                });
                break;
            case 'comment':
                axios.get(`http://localhost/comment_detail/${reported_idx}`).then(({data}) => {
                    console.log(data);
                    setPost({
                        idx: data.comment_idx,
                        date: formattingDate(data.reg_date),
                        subject: '',
                        content: data.content});
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
                });
                break;
            default:
                break;
        }
    }

    return (
        <>
            <div>
                {post.idx} | {post.subject} | {post.content} | {post.date}
            </div>
            <History report_idx={report_idx}/>
        </>
    );
}


function History({report_idx}) {

    const [list, setList] = useState([]);

    useEffect(() => {
        drawList();
    }, [report_idx]);

    // 리스트 불러오기
    const drawList = async () => {
        let {data} = await axios.get(`http://localhost/history_list/${report_idx}`);
        const posts = data.list.map((item) => {
            return (
                <div key={item.his_idx} style={{border: "1px solid gray", padding: "10px"}}>
                    <div>{item.user_id}</div>
                    <div>{item.content}</div>
                    <div>{formattingDate(item.done_date)}</div>
                </div>
            );
        });
        setList(posts);
    }

    const formattingDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('ko-KR').toString();
    }

    return (
        <div className={"component-history"}>
            <HistoryInput report_idx={report_idx} drawList={drawList}/>
            {list}
        </div>
    );
}
