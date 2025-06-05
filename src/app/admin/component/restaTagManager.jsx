'use client'

import {useEffect, useState} from "react";
import axios from "axios";

// 식당태그관리자
export default function RestaTagManager({tags, resta_idx}) {
    // ▼ tags - item
    // {
    //     "tag_idx": 39,
    //     "isClass": null,
    //     "tag_name": "회식",
    //     "cate_idx": 5
    // },

    useEffect(() => {
        drawTags();
    }, [resta_idx]);

    const [list, setList] = useState([]);

    //태그 삭제 기능
    const delTag = async (tag_idx) => {
        let {data} = await axios.get(`http://localhost/restaTagDel/${resta_idx}/${tag_idx}`);
        drawTags();
    }

    // 태그들을 그리는 함수
    const drawTags = () => {
        const data = tags.map((item) => {
            console.log(item);
            return (
                <div key={item.tag_idx}
                     style={{border: "1px solid lightblue", padding: "3px", margin: "3px", width:"100px"}}>
                    {item.tag_name}
                    <span style={{color: "red"}} onClick={() => delTag(item.tag_idx)}>X</span>
                </div>
            );
        });
        setList(data);
    }

    return (
        <div>
            {/*태그 출력 부분*/}
            <div>{list}</div>
            <TagInput resta_idx={resta_idx}/>
        </div>
    );
}


// 태그 입력 컴포넌트
function TagInput({resta_idx}) {

    const [input, setInput] = useState("");

    const insert=()=>{
        
    }

    return (
        <div style={{display:"flex", alignItems:"center"}}>
            <input type={"text"}
                   style={{height: "30px", margin:"10px", fontSize:"18px"}}
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
            />
            <div style={{border:"1px solid red", padding:"5px", cursor:"pointer"}}>추가</div>
        </div>
    );
}