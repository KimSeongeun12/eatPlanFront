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

    const spanStyle = {
        fontWeight: 600,
        textDecoration: 'underline',
    }

    return (
        <>
            <LeftMenu/>
            <div className={"rightMenu"}>
                <div className={"topMenuSpans"}>
                    <span onClick={showMyInfo} className={visible === 'myInfo' ? 'active-span' : ''}>회원 정보 열람</span>
                    <span onClick={showMyList} className={visible === 'myList' ? 'active-span' : ''}>내 코스 모아보기</span>
                </div>
                <hr/>
                {visible === 'myInfo' && <MyInfo/>}
                {visible === 'myList' && <MyList/>}
            </div>
        </>
    );
}