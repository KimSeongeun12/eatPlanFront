'use client'

import LeftMenu from "@/app/leftMenu";
import {useEffect, useRef, useState} from "react";
import './history.css'
import axios from "axios";
import HistoryInput from "@/app/admin/component/historyInput";
import {setRequestMeta} from "next/dist/server/request-meta";

export default function HistoryPage(props) {

    // report_idx
    const idx = useRef(props.params.slug);
    // report_idx로 신고대상글불러오기
    const [report, setReport] = useState({});
    const [reported, setReported] = useState({});
    const [loading, setLoading] = useState(true);    // 로딩 여부

    useEffect(() => {
        if (sessionStorage.getItem('admin') === 'false') {
            alert('관리자가 아닙니다.');
            location.href = "/";
        }
        loadReport();
    }, [idx]);

    const loadReport = async () => {
        const token = sessionStorage.getItem("token");
        console.log('idx?: ', idx.current);
        let {data} = await axios.get(`http://192.168.0.120/report_detail/${idx.current}`, {
            headers: { Authorization: `Bearer ${token}` }});
        console.log('loadReport_data: ', data);
        setReport(data.detail);

        if (data.detail.isClass === 'course') {
            setReported(data.reported_course); // reported(신고된 글)
        } else if (data.detail.isClass === 'comment') { // reported(신고된 글)
            setReported(data.reported_cmt);
        } else if (data.detail.isClass === 'message') { // reported(신고된 글)
            setReported(data.reported_msg);
            console.log('message reported? : ', reported);
        }
        setLoading(false); // 모두 완료 후 false
    };

    return (
        <>
            <LeftMenu/>
            <div className="report-detail-rightmenu">
                <div className={"report_container"}>
                    <h2>신고 상세보기</h2>
                    <table className="report_detail_table">
                        <tbody>
                        <tr>
                            <th>분류</th>
                            <td>{report?.isClass}</td>
                            <th>작성자</th>
                            <td style={{textAlign: 'center'}}>
                                {report.reporter_nickname}
                            </td>
                            <th>신고번호</th>
                            <td>{idx.current}</td>
                        </tr>
                        <tr>
                            <th>신고대상자</th>
                            <td colSpan={5}>
                                {report.suspect_id}
                            </td>
                        </tr>
                        <tr>
                            <th>제목</th>
                            <td colSpan={5}>
                                {report.subject}
                            </td>
                        </tr>
                        <tr>
                            <th colSpan={6} className="content-label">내용</th>
                        </tr>
                        <tr>
                            <td colSpan={6}>
                                {report.content}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={6}>
                                {/*전부 렌더링된 이후 렌더링될 컴포넌트*/}
                                {!loading && report && reported && (
                                    <Target
                                        report_idx={idx.current}
                                        isClass={report.isClass}
                                        user_id={report.reporter_id}
                                        reported={reported}
                                    />
                                )}
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
function Target({reported, isClass, user_id, report_idx}) {

    const [post, setPost] = useState({});
    const msgInfo=useRef(reported);

    useEffect(() => {

        const getPost = async () => {
            if (isClass === 'course') {
                const {data} = await axios.get(`http://192.168.0.120/courseDetail`, {
                    params: {post_idx: reported.post_idx}
                });

                setPost({
                    idx: reported.post_idx,
                    date: new Date(data.detail.content.reg_date).toLocaleDateString('ko-KR'),
                    subject: data.detail.content.subject,
                    content: data.detail.content.post_cmt
                });
            } else if (isClass === 'comment') {
                const {data} = await axios.get(`http://192.168.0.120/comment_detail/${reported.comment_idx}`);
                setPost({
                    idx: data.comment_idx,
                    date: new Date(data.reg_date).toLocaleDateString('ko-KR'),
                    subject: '',
                    content: data.content
                });
            } else if (isClass === 'message') {
                console.log('setMsgInfo: ', msgInfo.current);
                // const {data} = await axios.get(`http://192.168.0.120/${user_id}/${reported.msg_idx}/msg_detail`);

                setPost({
                    idx: msgInfo.current.msg_idx,
                    date: new Date(msgInfo.current.msg_date).toLocaleDateString('ko-KR'),
                    subject: msgInfo.current.subject,
                    content: msgInfo.current.content
                });
            }
        };

        getPost();
    }, [reported]);

    return (
        <>
            <div
                style={{
                    height: '400px',
                    border: '1px solid black',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    overflowY: 'auto', // 내용이 넘칠 경우 스크롤
                }}
            >
                <div><strong>번호:</strong> {post.idx}</div>
                <div><strong>제목:</strong> {post.subject}</div>
                <div style={{flexGrow: 1, marginTop: '1rem'}}>
                    <strong>내용:</strong>
                    <div style={{marginTop: '0.5rem', whiteSpace: 'pre-wrap'}}>{post.content}</div>
                </div>
                <div style={{textAlign: 'right', marginTop: '1rem'}}>
                    <em>{post.date}</em>
                </div>
            </div>
            <History report_idx={report_idx}/>
        </>
    );
}


function History({report_idx}) {

    const [list, setList] = useState([]);

    useEffect(() => {
        drawList();
    }, []);

    // 리스트 불러오기
    const drawList = async () => {
        let {data} = await axios.get(`http://192.168.0.120/history_list/${report_idx}`);
        const posts = data.list.map((item) => {
            console.log(item);
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
