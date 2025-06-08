import axios from "axios";
import { useState } from "react";
import './courseAdd_modalCss.css';
import TagAddModal from "@/app/write/courseAdd_modal/tagAddModal";

const AddStepOne = ({ onClose, nextStep, formData, setFormData }) => {

    const [results, setResults] = useState([]);

    // 식당 이름 검색 (axios)
    const search = async () => {
        const { data } = await axios.post('http://localhost/search_resta', formData.searchQuery, {
            headers: { "Content-Type": "text/plain" },
        });
        setResults(data.result);
    };

    const handleSelectRestaurant = (restaurant) => {
        setFormData(prev => ({
            ...prev,
            lat: restaurant.lat,
            lng: restaurant.lng,
            selectedRestaIdx: restaurant.resta_idx,
            img_idx: restaurant?.img_idx,
            resta_name: restaurant?.resta_name || null,
            url: restaurant?.url || "",
            media: restaurant?.img_idx ? `http://localhost/imageIdx/${restaurant.img_idx}` : null,
        }));
    };

    return (
        <div className={"courseAdd_search_div"}>
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
                    results.map((item, index) => {
                        console.log("img_idx:", item.img_idx);  // ✅ console.log는 여기서!

                        return (
                            <div
                                key={index}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    cursor: "pointer",
                                    backgroundColor:
                                        formData.selectedRestaIdx === item.resta_idx
                                            ? "#f0f8ff"
                                            : "#fff",
                                }}
                                onClick={() => handleSelectRestaurant(item)}
                            >
                                <p><strong>식당 idx:</strong> {item.resta_idx}</p>
                                <p>
                                    <strong>이미지:</strong><br />
                                    <img src={`http://localhost/imageIdx/${item.img_idx}`} alt={"이미지 안 뜸"} />
                                </p>
                                <p><strong>식당 이름:</strong> {item.resta_name}</p>
                                <p><strong>소개:</strong> {item.resta_bio}</p>
                                <p><strong>url:</strong> <a href={item.url?.startsWith('http') ? item.url : `https://${item.url}`}
                                                            target="_blank" rel="noopener noreferrer">{item.url}</a></p>
                                <p><strong>주소:</strong> {item.address}</p>
                            </div>
                        );
                    })
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>

            <br />
            <button onClick={onClose}>닫기</button>
            <button onClick={nextStep}>다음</button>
        </div>
    );
};

export default AddStepOne;