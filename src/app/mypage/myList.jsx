'use client'
import MyList_write from './myList_write';
import MyList_like from './myList_like';
import './myPageCss.css'
import {useState} from "react";

export default function myList() {
    const [visible, setVisible] = useState('myWrite');

    const showMyWrite = () => {setVisible('myWrite')}
    const showMyLike = () => {setVisible('myLike')}

    return (
        <>
            <div className={"myList"}>
                <div onClick={showMyWrite} className={visible === 'myWrite' ? "myWrite" : "active-div"}>내가 작성한 게시글</div>
                <div onClick={showMyLike} className={visible === 'myLike' ? "myLike" : "active-div"}>내가 좋아요한 게시글</div>
            </div>
            {visible === 'myWrite' && <MyList_write />}
            {visible === 'myLike' && <MyList_like />}
        </>
    );
}