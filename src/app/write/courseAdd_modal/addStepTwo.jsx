const AddStepTwo = ({ nextStep, prevStep, formData, setFormData }) => {
    return (
        <div>
            <div style={{ marginBottom: "20px" }}>
                <label>
                    시간 입력
                    <input
                        type="time"
                        value={formData.start || ""}
                        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                    />
                </label>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <label>
                    상세 설명 입력
                    <textarea
                        value={formData.comment || ""}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        placeholder="선택한 코스에 대한 상세 설명을 기입해주세요."
                    />
                </label>
            </div>
            <button onClick={prevStep}>이전</button>
            <button onClick={nextStep}>다음</button>
        </div>
    );
};

export default AddStepTwo;
