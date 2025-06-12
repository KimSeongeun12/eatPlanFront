'use client'

import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import './reportHistory.css'
import Link from "next/link";
import {Box, Pagination, Stack} from "@mui/material";

export default function ReportHistory(){

    const [history, setHistory] = useState([]);
    let page=useRef(1);
    let totalPages=useRef(1);

    useEffect(()=>{
        drawList();
    },[]);

    // ----------- 처리상태 변경 ------------//
    const toggle=async (idx, done)=>{
        let {data}=await axios.put(`http://192.168.0.120/report_done`, {report_idx:idx, done:!done});
        // console.log(data);
        drawList();
    }

    const formattingDate=(dateStr)=>{
        return new Date(dateStr).toLocaleDateString('ko-KR').toString();
    }

    const changePage=(e, val)=>{
        page.current=val
        drawList();
    }

    const drawList=async () => {
        let {data} = await axios.get(`http://192.168.0.120/report_list/${page.current}`);
        totalPages.current=data.pages;
        // 리스트에 나와야하는 요소: 체크박스, no, 제목, 신고자, 피신고자, 신고일, 처리여부, 상태변경(select)
        const posts=data.list.map(item=>{

            return(
                <div key={item.report_idx} className={item.done ? 'component' : 'done'}>
                    <div>{item.report_idx}</div>
                    <Link href={`/admin/history/${item.report_idx}`}>
                            <div style={{width:"300px"}}>
                            {item.subject}
                         </div>
                    </Link>
                    <div style={{width:"120px"}}>{item.reporter_nickname}</div>
                    <div style={{width:"120px"}}>{item.suspect_nickname}</div>
                    <div style={{width:"200px"}}>{formattingDate(item.report_date)}</div>
                    <div style={{width:"80px", border:"1px solid black", cursor:"pointer"}} onClick={()=>toggle(item.report_idx, item.done)}>
                        {item.done ? '미처리':'처리 완료'}
                    </div>
                </div>
            );
        });
        setHistory(posts);

    }

    return(
        <div>
            <div className="tabs" style={{display:'flex', textAlign:'center', borderBottom:'1px solid #dddddd', padding: "10px"}}>
                <div>No</div>
                <div style={{width:"300px"}}>제목</div>
                <div style={{width:"120px"}}>신고자</div>
                <div style={{width:"120px"}}>피신고자</div>
                <div style={{width:"200px"}}>신고 날짜</div>
                <div style={{width:"80px"}}>상태 변경</div>
            </div>
            {history}
            <Box
                sx={{
                    display: 'flex',           // Flexbox 사용
                    justifyContent: 'center',  // 수평 중앙 정렬
                    alignItems: 'center',      // 수직 중앙 정렬
                }}
            >
            <Stack spacing={2}>
                <Pagination
                    count={totalPages.current}
                    color={'primary'}
                    variant={'outlined'}
                    shape={"rounded"}
                    siblingCount={2} //현재 페이지 양쪽에 표시할 갯수
                    onChange={changePage}
                />
            </Stack>
            </Box>
        </div>
    );
}