const AddStepThree = ({ prevStep, formData, onSubmit }) => {
    return (
        <div>
            <h2>4단계: 확인</h2>
            <p><strong>이미지:</strong></p>
            {formData.media ? (
                <img src={formData.media} alt="선택된 식당 이미지" style={{ maxWidth: '300px', maxHeight: '200px' }} />
            ) : (
                <p>이미지가 없습니다.</p>
            )}
            <p><strong>선택된 식당 idx:</strong> {formData.selectedRestaIdx}</p>
            <p><strong>선택된 태그:</strong> {formData.selectedTags && formData.selectedTags.length > 0
                ? formData.selectedTags.map(tag => `#${tag.value}`).join(', ')
                : "선택된 태그가 없습니다."}
            </p>
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
