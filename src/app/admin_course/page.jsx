'use client'
import '../mainCss.css';
import './admin_courseCss.css';
import LeftMenu from '../leftMenu';
import BestList from '../list/bestList';
import {useState} from "react";
import Admin_courseList from "@/app/admin_course/admin_courseList";
import {useRouter} from "next/navigation";

export default function List() {
    const [visible, setVisible] = useState('bestList');

    const showBestList = () => {setVisible('bestList')}
    const showAdmin_courseList = () => {setVisible('admin_courseList')}

    const router = useRouter();

    return (
        <>
            <LeftMenu />
            <div className={"rightMenu"}>
                <div className={"topMenuSpans"}>
                    <span onClick={showAdmin_courseList} className={visible === 'admin_courseList' ? 'active-span' : ''}>일반 코스</span>
                    <span onClick={showBestList} className={visible === 'bestList' ? 'active-span' : ''}>베스트 코스</span>
                    {visible === 'admin_courseList' && (
                        <select className={"alignSelect"}>
                            <option>최신순</option>
                        </select>
                    )}
                    <div className={"search"} onClick={() => router.push('/courseSearch')}>
                        <img src={"searchIcon.png"} alt={"돋보기 아이콘"}/>
                    </div>
                </div>
                <hr/>
                {visible === 'bestList' && <BestList/>}
                {visible === 'admin_courseList' && <Admin_courseList/>}
            </div>
        </>
    );
}