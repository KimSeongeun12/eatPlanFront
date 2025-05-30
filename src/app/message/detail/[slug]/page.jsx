'use client'
import LeftMenu from "@/app/leftMenu";
import {useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";


export default function DetailPage(props) {

    const user_id=sessionStorage.getItem("user_id");
    const token=sessionStorage.getItem("token");

    const [info,setInfo]=useState({});

    useEffect(() => {
        props.params.then(({slug})=>{
            drawDetail(slug);
        })
    }, []);

    const drawDetail = async (msg_idx) => {
        let {data}= await axios.get(`http://localhost/${user_id}/${msg_idx}/msg_detail`, {headers: {Authorization: token}});
        if(data.success){
            setInfo(data.message);
        }
    }

    return (
        <>
            <LeftMenu/>
            <div>
                <table className={"message_write"} style={{width: "100%"}}>
                    <tbody>
                    <tr>
                        <th>작성일</th>
                        <td>{info.msg_date}</td>
                    </tr>
                    <tr>
                        <th>보내는 사람</th>
                        <td>{info.sender}</td>
                        <th>받는사람</th>
                        <td>{info.recip}</td>
                    </tr>
                    <tr>
                        <th>제목</th>
                        <td>
                            {info.subject}
                        </td>
                    </tr>
                    <tr>
                        <th colSpan={4}>내용</th>
                        <td>
                            {info.content}
                        </td>
                    </tr>
                    </tbody>
                </table>
                <br/>
                <Link href={`/message`}><button>돌아가기</button></Link>
            </div>
        </>
    );
}