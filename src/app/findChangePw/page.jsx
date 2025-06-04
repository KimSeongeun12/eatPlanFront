'use client'
import {useState} from "react";
import FindPw from "@/app/findChangePw/findPw";
import ChangePw from "@/app/findChangePw/changePw";

export default function FindPasswordPage() {
    const [visibleComponent, setVisibleComponent] = useState('findPw');

    return (
        <>
            {visibleComponent === 'findPw' && <FindPw setVisibleComponent={setVisibleComponent} />}
            {visibleComponent === 'changePw' && <ChangePw />}
        </>
    );
}