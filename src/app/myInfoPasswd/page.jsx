'use client'
import LeftMenu from "@/app/leftMenu";
<<<<<<< HEAD:src/app/passwd/myInfoPasswd/page.jsx
import '../../mainCss.css'
import '../../mypage/myPageCss.css';
import MyInfoPasswd from "@/app/passwd/myInfoPasswd/myInfoPasswd";
=======
import '../mypage/myPageCss.css';
import MyInfoPasswd from "./myInfoPasswd";
>>>>>>> origin/master:src/app/myInfoPasswd/page.jsx

export default function PasswdPage() {
    return (
        <>
            <LeftMenu/>
            <MyInfoPasswd/>
        </>
    );
}