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
    const drawTags = async () => {
        let {data} = await axios.get(`http://localhost/restaDetail/${resta_idx}`);
        const tagList = data.tags.map((item)=>{
            return (
                <div key={item.tag_idx}
                     style={{border: "1px solid lightblue", padding: "3px", margin: "3px", width: "100px"}}>
                    {item.tag_name}
                    <span style={{color: "red", cursor:"pointer"}} onClick={() => delTag(item.tag_idx)}>X</span>
                </div>
            );
        })
        setList(tagList);
    }

    return (
        <div>
            {/*태그 출력 부분*/}
            <div>{list}</div>
            <TagInput resta_idx={resta_idx} drawTags={drawTags} />
        </div>
    );
}


// 태그 입력 컴포넌트
function TagInput({resta_idx, drawTags}) {

    const [options, setOptions] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        makeOptions();
        drawTags();
    }, [resta_idx]);

    const insert = async () => {
        await axios.post(`http://localhost/addTagtoResta`, {tag_idx: input, resta_idx: resta_idx});
        drawTags();
    }

    // ----------------- 귀찮으니 엔터로 해결! -------------//
    const enterHandler = (e) => {
        if (e.key === 'Enter') {
            insert();
        }
    }

    const makeOptions = async () => {
        let {data} = await axios.get(`http://localhost/list_tag`);
        const list = data.list_tag_whole.map((item) => {
            if (item.isClass === '식당') {
                return (
                    // value는 tag_idx로 받음
                    <option value={item.tag_idx}>{item.tag_name}</option>
                )
            }
        });
        setOptions(list);
    }

    return (
        <div style={{display: "flex", alignItems: "center"}}>
            {/*select문으로 받을예정*/}
            <select style={{height: '30px'}}
                    name={"tags"}
                    onKeyUp={() => enterHandler()}
                    onChange={(e) => setInput(e.target.options[e.target.selectedIndex].value)}>
                {options}
            </select>
            <div style={{border: "1px solid red", padding: "5px", cursor: "pointer", margin: "5px"}}
                 onClick={() => insert()}>
                추가
            </div>
        </div>
    );
}