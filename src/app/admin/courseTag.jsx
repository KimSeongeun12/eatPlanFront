'use client'
import {useEffect, useRef, useState} from "react";
import axios from "axios";

export default function CourseTagManager() {

    const [list, setList] = useState([]);
    const cate_idx=useRef(1);
    const [component, setComponent] = useState(null);

    useEffect(() => {
        drawList();
    }, [cate_idx.current]);

    const drawList = async () => {
        let {data} = await axios.get('http://localhost/list_tagcate');
        const tags = data.list_tagcate.map((item) => {
            return (
                <div key={item.cate_idx} className={"box"} onClick={() => {cate_idx.current = item.cate_idx;}}>
                    {/*수정사항*/}
                    {item.cate_name}
                </div>
            );
        })
        setList(tags);  //태그 카테고리 세팅
    }

    return (
        <div>
            {list}
        </div>
    );
}


// 태그들이 출력되는 부분
function Tags({cate_idx}) {

    const [list, setList] = useState([]);

    // 식당/코스별로 불러와야함
    axios.get(`http://localhost/list_tag/${cate_idx}`).then(({data}) => {
        const tags = data.list_tag.map((item) => {
            if(item.isClass==='코스'){
                return(
                  <div key={item.tag_idx}>{item.tag_name}</div>
                );
            }
            else if(item.isClass==='식당'){
                return(
                  <div key={item.tag_idx}>{item.tag_name}</div>
                );
            }
            else{
                return null;
            }
        });
        setList(tags);
    });

    return (
        <>{list}</>
    );

}

