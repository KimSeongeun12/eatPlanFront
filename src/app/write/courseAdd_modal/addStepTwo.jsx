import axios from "axios";
import {useState} from "react";
import './courseAdd_modalCss.css';

const AddStepTwo = ({ nextStep, prevStep, formData, setFormData }) => {

    const [results, setResults] = useState([]);

    // 식당 이름 검색
    const search = async () => {
        const {data} = await axios.post('http://localhost/search_resta', formData.searchQuery, {
            headers: {"Content-Type": "text/plain"},
        });
        console.log(data.result);
        setResults(data.result);
    }

    const handleSelectRestaurant = (restaurant) => {
        setFormData(prev => ({
            ...prev,
            resta: restaurant || null,
            noResta: restaurant ? "" : "선택 안됨",
        }));
    };


    return (
        <div className={"courseAdd_search_div"}>
            <h2>2단계: 상세 설명</h2>
            
            <div style={{ display: "flex", marginBottom: "20px" }}>
                <label>
                    식당 검색:
                    <input
                        type="text"
                        placeholder={"코스로 등록할 식당을 선택 또는 검색어를 입력해주세요."}
                        value={formData.searchQuery || ""}
                        onChange={(e) => setFormData({ ...formData, searchQuery: e.target.value })}
                        style={{ marginLeft: "10px" }}
                    />
                </label>
                <button onClick={search} style={{ marginLeft: "10px" }}>
                    검색
                </button>
            </div>
            
            <div style={{ marginTop: "20px" }}>
                {results.length > 0 ? (
                    results.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                marginBottom: "10px",
                                cursor: "pointer",
                                backgroundColor:
                                    formData.resta?.resta_idx === item.resta_idx
                                        ? "#f0f8ff"
                                        : "#fff",
                            }}
                            onClick={() => handleSelectRestaurant(item)} // 클릭 시 선택
                        >
                            <p><strong>식당 이름:</strong> {item.resta_name}</p>
                            <p><strong>주소:</strong> {item.address}</p>
                            <p><strong>url:</strong> {item.url}</p>
                            <p><strong>소개:</strong> {item.resta_bio}</p>
                        </div>
                    ))
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>

            <br />
            <button onClick={prevStep}>이전</button>
            <button onClick={nextStep}>다음</button>
        </div>
    );
};

export default AddStepTwo;
