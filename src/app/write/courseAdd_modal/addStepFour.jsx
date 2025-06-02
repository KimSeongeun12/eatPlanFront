const AddStepFour = ({ prevStep, formData, onSubmit }) => {
    return (
        <div>
            <h2>4단계: 확인</h2>
            <p><strong>타임라인에 표시되는 식당:</strong> {formData.timeline_resta_name}</p>
            <p><strong>선택된 식당:</strong> {formData.selectedRestaurant?.resta_name || "선택 안됨"}</p>
            <p><strong>시간:</strong> {formData.timeline_time}</p>
            <p><strong>상세 설명:</strong> {formData.timeline_coment}</p>
            <button onClick={prevStep}>이전</button>
            <button onClick={onSubmit}>제출</button>
        </div>
    );
};

export default AddStepFour;
