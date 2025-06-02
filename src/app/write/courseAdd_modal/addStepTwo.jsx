const AddStepTwo = ({ nextStep, prevStep, formData, setFormData }) => {
    return (
        <div>
            <h2>2단계: 상세 설명</h2>
            <textarea
                placeholder="코스 설명"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <br />
            <button onClick={prevStep}>이전</button>
            <button onClick={nextStep}>다음</button>
        </div>
    );
};

export default AddStepTwo;
