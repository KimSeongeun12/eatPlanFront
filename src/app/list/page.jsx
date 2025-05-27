'use client'
import '../mainCss.css';
import './listCss.css';
import LeftMenu from '../leftMenu';
import BestList from './bestList';
import CommonList from './commonList';
import {useState} from "react";
import Link from "next/link";

export default function List() {
    const [visible, setVisible] = useState('bestList');

    const showBestList = () => {setVisible('bestList')}
    const showCommonList = () => {setVisible('commonList')}

    return (
        <>
            <LeftMenu />
            <div className={"rightMenu"}>
                <div className={"topMenuSpans"}>
                    <span onClick={showCommonList} className={visible === 'commonList' ? 'active-span' : ''}>일반 코스</span>
                    <span onClick={showBestList} className={visible === 'bestList' ? 'active-span' : ''}>베스트 코스</span>
                    {visible === 'commonList' && (
                        <select className={"alignSelect"}>
                            <option>조회수 많은 순</option>
                        </select>
                    )}
                    <Link href="/courseSearch">
                        <div className={"search"}>
                            <img src={"돋보기 아이콘.png"} alt={"돋보기 아이콘"}/>
                        </div>
                    </Link>
                </div>
                <hr/>
                {visible === 'bestList' && <BestList/>}
                {visible === 'commonList' && <CommonList/>}
            </div>
        </>
    );
}