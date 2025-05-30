import './courseAdd_modal.css';

export default function CourseAdd_modal({onClose}) {
    return (
        <div className="courseAdd_modal_overlay">
            <div className="courseAdd_modal_content">

                <div className="courseAdd_modal_body">
                    <span>타임라인 세부 요소의 모양을 선택해주세요.</span>
                </div>

                <div className="courseAdd_modal_buttons">
                    <button onClick={onClose} className="courseAdd_modal_button">
                        취소
                    </button>
                    <button className="courseAdd_modal_button confirm">다음</button>
                </div>
            </div>
        </div>
    );
}