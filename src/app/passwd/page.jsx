'use client'
import LeftMenu from "@/app/leftMenu";
import MyPagePasswd from "@/app/passwd/MyPagePasswd";



export default function PasswdPage() {
    return (
        <>
            <LeftMenu/>
            <div className="passwd-rightMenu">
            <MyPagePasswd/>
            </div>
        </>
    );
}