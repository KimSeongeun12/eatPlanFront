'use client';
import { useState } from 'react';

export default function StepTwo({ onNext, onPrev, setData }) {
    const [description, setDescription] = useState('');

    const handleNext = () => {
        setData({ description });  // 상위로 데이터 전달
        onNext();
    };

    return (
        <div>
            <h2>2단계: 설명 입력</h2>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="코스 설명을 입력하세요"
                rows={4}
            />
            <div style={{ marginTop: '10px' }}>
                <button onClick={onPrev}>이전</button>
                <button onClick={handleNext} style={{ marginLeft: '8px' }}>다음</button>
            </div>
        </div>
    );
}
