'use client'
import './ban.css'
import {useEffect, useState} from "react";
import axios from "axios";

export default function Ban({user_id, user_nickname, setOpen}) {

    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [period, setPeriod] = useState(0);

    useEffect(() => {
        cal();
    }, [start, end])

    const cal = () => {
        setPeriod(calDuration(start, end));
    }

    const suspend = async () => {
        let {data} = axios.post(`http://localhost/${user_id}/suspend`, {start: start, end: end});
        location.reload();
    }

    return (
        <div className={"banPopup"}>
            <div className={"x"} onClick={() => setOpen(false)}>X</div>
            <div className={"top"}>
                <h3>유저 정지</h3>
                {user_nickname} 회원의 정지 기간을 지정하세요.
            </div>
            <div className={"period"}>
                시작일<br/>
                <input type={"date"} onChange={(e) => {
                    setStart(e.target.value)
                }}/>
                <br/>
                <br/>
                종료일<br/>
                <input type={"date"} onChange={(e) => {
                    setEnd(e.target.value)
                }}/>
                <br/><br/>
                기간<br/>
                {period}일
                <br/>
                <br/>
            </div>
            <button onClick={() => suspend()}>정지</button>
        </div>
    );
}

function calDuration(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return (endDate - startDate) / (1000 * 60 * 60 * 24);
}