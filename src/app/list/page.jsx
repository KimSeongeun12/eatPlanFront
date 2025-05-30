'use client'
import '../mainCss.css';
import './listCss.css';
import LeftMenu from '../leftMenu';
import BestList from './bestList';
import CommonList from './commonList';
import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function List() {
    const [visible, setVisible] = useState('bestList');

    const showBestList = () => {setVisible('bestList')}
    const showCommonList = () => {setVisible('commonList')}

    const router = useRouter();

    return (
        <>
            <LeftMenu />
            <div className={"rightMenu"}>
                <div className={"topMenuSpans"}>
                    <span onClick={showCommonList} className={visible === 'commonList' ? 'active-span' : ''}>일반 코스</span>
                    <span onClick={showBestList} className={visible === 'bestList' ? 'active-span' : ''}>베스트 코스</span>
                    {visible === 'commonList' && (
                        <select className={"alignSelect"}>
                            <option value={"b_hit"}>조회수 많은 순</option>
                            <option value={"total_like_count"}>좋아요 많은 순</option>
                            <option value={"reg_date"}>작성일</option>
                        </select>
                    )}
                    <Link href="/courseSearch">
                        <div className={"search"} onClick={() => router.push('/courseSearch')}>
                            <img src={"searchIcon.png"} alt={"돋보기 아이콘"}/>
                        </div>
                    </Link>
                </div>
                <hr/>
                {visible === 'bestList' && <BestList/>}
                {visible === 'commonList' && <CommonList />}
            </div>
        </>
    );
}