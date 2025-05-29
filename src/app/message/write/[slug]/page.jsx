'use client'
import LeftMenu from "@/app/leftMenu";
import {useEffect, useState} from "react";
import axios from "axios";

export default function WritePage(props) {

    let user_id = sessionStorage.getItem('user_id');
    const token = sessionStorage.getItem('token');
    const [info, setInfo] = useState({'sender': user_id, 'recip': '', 'subject': '', 'content': ''});

    useEffect(() => {
        const to=props.params.slug;
        setInfo({...info, recip: to});
    },[]);

    // recip는 외부에서 받아와야해요~


    const send = async () => {

        let {data} = await axios.post(`http://localhost/${user_id}/write_msg`, info, /*{headers: {Authorization: token}}*/);

        if(data.success){
            location.href="/message";
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
                        <td>2025-05-28*</td>
                    </tr>
                    <tr>
                        <th>보내는 사람</th>
                        <td>{user_id}</td>
                        <th>받는사람</th>
                        <td>{info.recip}</td>
                    </tr>
                    <tr>
                        <th>제목</th>
                        <td>
                            <input type={"text"} value={info.subject} onChange={(e) => {
                                setInfo({...info, subject: e.target.value})
                            }}/>
                        </td>
                    </tr>
                    <tr>
                        <th colSpan={4}>내용</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea placeholder={"내용을 입력하세요."}
                                      style={{
                                          width: "630px", height: "300px"
                                      }}
                                      value={info.content}
                                      onChange={(e) => {
                                          setInfo({...info, content: e.target.value})
                                      }}
                            ></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <br/>
                <button onClick={send}>보내기</button>
            </div>
        </>

    );
}