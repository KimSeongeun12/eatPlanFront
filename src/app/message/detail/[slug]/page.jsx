'use client'
import LeftMenu from "@/app/leftMenu";
import {useEffect} from "react";
import axios from "axios";


export default function DetailPage(props) {

    const user_id='admin';  // 로그인 시 바꿀 코드
    const token=sessionStorage.getItem("token");

    useEffect(() => {
        const msg_idx=props.params.slug;
        drawDetail(msg_idx);
    }, []);

    const drawDetail = async (msg_idx) => {
        let {data}= await axios.get(`http://localhost/${user_id}/${msg_idx}/msg_detail`);
        console.log(data);
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
                        <td>*sender</td>
                        <th>받는사람</th>
                        <td>*receiver</td>
                    </tr>
                    <tr>
                        <th>제목</th>
                        <td>
                            제목들어갈자리
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
                            ></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <br/>
                <button>돌아가기</button>
            </div>
        </>
    );
}