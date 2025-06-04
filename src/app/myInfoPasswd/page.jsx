'use client'
import LeftMenu from "@/app/leftMenu";
import MyInfoPasswd from "./myInfoPasswd";

export default function PasswdPage() {
    return (
        <>
            <LeftMenu/>
            <div className="myInfoPasswd-rightMenu">
            <MyInfoPasswd/>
            </div>
        </>
    );
}