const AddStepThree = ({ prevStep, formData, onSubmit }) => {
    return (
        <div>
            <h2>3단계: 확인</h2>
            <p><strong>코스 이름:</strong> {formData.name}</p>
            <p><strong>설명:</strong> {formData.description}</p>
            <button onClick={prevStep}>이전</button>
            <button onClick={onSubmit}>제출</button>
        </div>
    );
};

export default AddStepThree;
