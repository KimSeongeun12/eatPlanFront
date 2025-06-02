'use client'
import LeftMenu from "@/app/leftMenu";
import {useEffect, useRef, useState} from "react";
import MemberList from "@/app/admin/memberList";
import './admin.css';
import '../mainCss.css'
import TagManagement from "@/app/admin/tagManagement";

export default function AdminPage() {

    const [component, setComponent] = useState(null);
    let tabName = useRef('memberList');
    let user_id = useRef('');
    let token = useRef('');


    useEffect(() => {
        setComponent(<MemberList />);
        user_id.current = sessionStorage.getItem('user_id');
        token.current = sessionStorage.getItem('token');
    }, []);

    const clickTab = (e) => {
        tabName.current = e.target.id;
        toggleTab();
    }

    const toggleTab = () => {
        switch (tabName.current) {
            case 'memberList':
                setComponent(<MemberList />);
                break;
            case 'tagManage':
                setComponent(<TagManagement />);
                break;
        }
    }

    return (
        <>
            <LeftMenu/>
            <div className={"rightMenu"}>
                <div className={"topMenuSpans"}>
                    <span id={'myPage'} className={tabName.current === 'myPage' ? 'active-span' : ''}
                          onClick={(e) => clickTab(e)}>내 정보 열람</span>
                    <span id={'myCourse'} className={tabName.current === 'myCourse' ? 'active-span' : ''}
                          onClick={(e) => clickTab(e)}>내 코스 모아보기</span>
                    <span id={'memberList'} className={tabName.current === 'memberList' ? 'active-span' : ''}
                          onClick={(e) => clickTab(e)}>회원 리스트</span>
                    <span id={'tagManage'} className={tabName.current === 'tagManage' ? 'active-span' : ''}
                          onClick={(e) => clickTab(e)}>태그 관리</span>
                    <span id={'report'} className={tabName.current === 'report' ? 'active-span' : ''}
                          onClick={(e) => clickTab(e)}>신고 내역 확인</span>
                </div>
                {component}
            </div>
        </>
    );
}