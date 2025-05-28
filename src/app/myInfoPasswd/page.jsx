'use client'
import LeftMenu from "@/app/leftMenu";
import '../mainCss.css'
import '../mypage/myPageCss.css';
import MyInfoPasswd from "./myInfoPasswd";

export default function PasswdPage() {
    return (
        <>
            <LeftMenu/>
            <MyInfoPasswd/>
        </>
    );
}