'use client'
import {useState} from "react";

export default function StepOne({ onNext, setData }) {
    const [title, setTitle] = useState('');

    const handleNext = () => {
        setData({ title });  // 상위로 데이터 전달
        onNext();
    };

    return (
        <div>
            <h2>1단계: 제목 입력</h2>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <button onClick={handleNext}>다음</button>
        </div>
    );
}
