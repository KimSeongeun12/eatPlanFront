'use client'
import LeftMenu from "@/app/leftMenu";
import '../../mainCss.css'
import '../../mypage/myPageCss.css';
import MyInfoPasswd from "@/app/passwd/myInfoPasswd/myInfoPasswd";

export default function PasswdPage() {
    return (
        <>
            <LeftMenu/>
            <MyInfoPasswd/>
        </>
    );
}