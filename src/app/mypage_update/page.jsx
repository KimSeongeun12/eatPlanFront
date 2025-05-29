'use client'
import LeftMenu from "../leftMenu";
import Update from "./update";
import {useEffect, useState} from "react";
import MyInfo from "@/app/mypage/myInfo";
import MyList from "@/app/mypage/myList";

export default function Page() {
    const [visible, setVisible] = useState('');

    useEffect(() => {
        setVisible('update');
    }, []);

    // const showMyInfoUpdate = () => {setVisible('mypage_update')}
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
                {visible === 'update' && <Update/>}
            </div>
        </>
    );
}