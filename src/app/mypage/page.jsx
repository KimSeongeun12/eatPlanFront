'use client'
import './myPageCss.css'
import MyInfo from "./myInfo";
import MyList from "./myList";
import LeftMenu from "@/app/leftMenu";
import {useState} from "react";

export default function myPage() {
    const [visible, setVisible] = useState('myInfo');

    const showMyInfo = () => {setVisible('myInfo')}
    const showMyList = () => {setVisible('myList')}

    return (
        <>
            <LeftMenu/>
            <div className={"rightMenu"}>
                <div className="tabs">
                    <button className={visible === 'myInfo' ? 'active-span' : ''} onClick={showMyInfo}>
                        회원 정보 열람</button>
                    <button className={visible === 'myList' ? 'active-span' : ''} onClick={showMyList}>
                        내 코스 모아보기</button>
                </div>
                {visible === 'myInfo' && <MyInfo/>}
                {visible === 'myList' && <MyList/>}
            </div>
        </>
    );
}