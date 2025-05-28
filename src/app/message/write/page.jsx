'use client'
import LeftMenu from "@/app/leftMenu";
import {useState} from "react";

export default function WritePage(){

    const [info,setInfo]=useState();

    return(
        <>
            <LeftMenu />
            <div>
                <table className={"message_write"} style={{width: "100%"}} >
                    <tbody>
                    <tr>
                        <th>작성일</th><td>2025-05-28*</td>
                    </tr>
                    <tr>
                        <th>보내는 사람</th><td>*sender</td>
                        <th>받는사람</th><td>*receiver</td>
                    </tr>
                    <tr>
                        <th colSpan={4}>내용</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea placeholder={"내용을 입력하세요."} style={{width:"630px", height:"300px" }}></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <br/>
                <button>보내기</button>
            </div>
        </>

    );
}