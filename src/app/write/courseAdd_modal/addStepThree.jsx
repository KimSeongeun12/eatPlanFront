const AddStepThree = ({ prevStep, formData, onSubmit }) => {
    return (
        <div>
            <h2 style={{ textAlign: "center", marginBottom: "30px" }}>최종 확인</h2>
            <div className="confirmation_container">
                <div className="confirmation_image_wrapper">
                    {formData.media ? (
                        <img
                            src={formData.media}
                            alt="선택된 식당 이미지"
                        />
                    ) : (
                        <p>이미지가 없습니다.</p>
                    )}
                </div>
                <div className="confirmation_details">
                    <p><strong>식당 이름</strong>{formData.resta_name || "정보 없음"}</p>
                    <p><strong>시간</strong>{formData.start || "정보 없음"}</p>
                    <p><strong>상세 설명</strong>{formData.comment || "정보 없음"}</p>
                </div>
            </div>
            <div className="confirmation_buttons">
                <button className="btn" onClick={prevStep}>이전</button>
                <button className="btn" onClick={onSubmit}>확인</button>
            </div>
        </div>
    );
};

export default AddStepThree;
