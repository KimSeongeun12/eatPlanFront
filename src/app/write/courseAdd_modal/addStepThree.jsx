const AddStepThree = ({ prevStep, formData, onSubmit }) => {
    return (
        <div>
            <h2>4단계: 확인</h2>
            <p><strong>이미지:</strong> {formData.img_idx}</p>
            <p><strong>선택된 식당:</strong> {formData.resta_name}</p>
            <p><strong>시간:</strong> {formData.start}</p>
            <p><strong>상세 설명:</strong> {formData.comment}</p>
            <p><strong>url:</strong> {formData.url}</p>
            <button onClick={prevStep}>이전</button>
            <button onClick={onSubmit}>제출</button>
        </div>
    );
};

export default AddStepThree;
