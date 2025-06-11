'use client'
import './tagManager.css'
import {useState} from "react";
import DrawLeftTags from "@/app/admin/draw_tagcate";
import DrawResta from "@/app/admin/draw_resta";

export default function TagsManager() {

    const [component, setComponent] = useState(null);
    const [selected, setSelected] = useState(null);

    const toggle = (e) => {
        // console.log(e.target.id);
        setSelected(e.target.id);

        switch (e.target.id) {
            case "course":
                setComponent(<DrawLeftTags isClass={'course'} leftMenu={e.target.id}/>);
                break;
            case "restaurant":
                setComponent(<DrawLeftTags isClass={'restaurant'} leftMenu={e.target.id}/>);
                break;
            case "restaurant_tags":
                setComponent(<DrawResta leftMenu={e.target.id}/>)
                break;
        }
    }

    return (
        <div>
            <br/>
            <div className={"tag tab"}>
                <div id={'course'}
                     onClick={(e) => toggle(e)}
                     className={selected==='course'? 'selected':''}
                >코스 태그 관리</div>
                <div id={'restaurant'}
                     onClick={(e) => toggle(e)}
                     className={selected==='restaurant'? 'selected':''}
                >식당 태그 관리</div>
                <div id={'restaurant_tags'}
                     onClick={(e) => toggle(e)}
                     className={selected==='restaurant_tags'? 'selected':''}
                >식당 별 태그 관리</div>
            </div>
            {component}
        </div>
    );
}