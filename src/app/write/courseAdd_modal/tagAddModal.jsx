const TagAddModal = ({ onClose }) => {
    const style = {
        marginRight: '10px',
        border: '1px solid #000',
        borderBottom: 'none',
        padding: '10px',
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <input type="text" placeholder="원하는 태그를 검색해주세요." />
                <button>검색</button>
                <div>여기에 선택한 태그 이름들이 표시됨</div>
                <div style={{display: 'flex'}}>
                    <div style={style}>지역</div>
                    <div style={style}>식당 종류</div>
                    <div style={style}>분위기</div>
                    <div style={style}>n차</div>
                    <div style={style}>인원수</div>
                    <div style={style}>이름 검색</div>
                </div>
                <div style={{width: '500px', height: '500px', border: '1px solid black'}}>

                </div>
                <button onClick={onClose}>닫기</button>
                <button>선택</button>
            </div>
        </div>
    );
};

export default TagAddModal;