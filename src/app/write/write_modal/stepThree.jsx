'use client';

export default function StepThree({ onPrev, onSubmit }) {
    return (
        <div>
            <h2>3단계: 확인</h2>
            <p>입력한 정보가 정확한가요? 제출하면 수정할 수 없습니다.</p>
            <div style={{ marginTop: '10px' }}>
                <button onClick={onPrev}>이전</button>
                <button onClick={onSubmit} style={{ marginLeft: '8px' }}>제출</button>
            </div>
        </div>
    );
}
