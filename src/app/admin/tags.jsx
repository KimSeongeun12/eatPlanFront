'use client'

import {useEffect, useState} from "react";
import axios from "axios";

// --------------- 각 태그들 -------------------//
export default function Tags({idx, isClass}) {

    const [list, setList] = useState([]);

    useEffect(() => {
        console.log('isCourse:', isClass);
        drawTagList();
    }, [idx]);

    const drawTagList = async () => {
        let {data} = await axios.get(`http://localhost/list_tag/${idx}`);
        const tags = data.list_tag.map((item) => {
            if (item.isClass === '코스') {
                return (
                    <div key={item.cate_idx}><Tag name={item.tag_name}/></div>
                )
            }
        });
        setList(tags);
    }

    return (
        <div className={"right-tags"}>
            {list}
        </div>
    );
}

// 태그하나하나하나하나
function Tag({idx, name}) {

    const del=(idx)=>{
        
    }

    return (
            <div className={"tag-component"}>
              <div className={"tag-name"}>{name}</div>&nbsp;
              <div id={"x"} onClick={()=>del()}>X</div>
            </div>

    );
}