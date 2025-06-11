'use client'

import axios from "axios";
import { useState } from "react";
import './courseAdd_modalCss.css';

const AddStepOne = ({ onClose, nextStep, formData, setFormData }) => {

    const [results, setResults] = useState([]);

    // 식당 이름 검색 (axios)
    const search = async () => {
        if (!formData.searchQuery || formData.searchQuery.trim() === "") {
            alert("검색어를 입력해주세요.");
            return;
        }
        try {
            const { data } = await axios.post('http://192.168.0.120/search_resta', formData.searchQuery, {
                headers: { "Content-Type": "text/plain" },
            });
            setResults(data.result);
        } catch (error) {
            console.error("검색 실패", error);
            alert("검색 중 오류가 발생했습니다.");
        }
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
            media: restaurant?.img_idx ? `http://192.168.0.120/imageIdx/${restaurant.img_idx}` : null,
        }));
    };

    return (
        <div className={"courseAdd_search_div"}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <label style={{ flexShrink: 0 }}>
                    <b>식당 검색</b>
                </label>
                <input
                    className="resta_search_input"
                    type="text"
                    placeholder="코스로 등록할 식당을 선택 또는 검색어를 입력해주세요."
                    value={formData.searchQuery || ""}
                    onChange={(e) => setFormData({ ...formData, searchQuery: e.target.value })}
                />
                <button className="resta_search_button" onClick={search}>
                    검색
                </button>
            </div>

            <div className={"addStep_item"}>
                {results.length > 0 ? (
                    results.map((item, index) => {
                        console.log("img_idx:", item.img_idx);

                        return (
                            <div
                                className={"resta_search_div"}
                                key={index}
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    cursor: "pointer",
                                    backgroundColor:
                                        formData.selectedRestaIdx === item.resta_idx
                                            ? "#fff6f5"
                                            : "#fff",
                                }}
                                onClick={() => handleSelectRestaurant(item)}
                            >
                                {/*<p><strong>식당 idx:</strong> {item.resta_idx}</p>*/}
                                <div className={"resta_search_left"}>
                                    <img
                                        className={"resta_img"}
                                        src={`http://192.168.0.120/imageIdx/${item.img_idx}`}
                                        alt={"이미지 안 뜸"}/>
                                </div>
                                <div className={"resta_search_right"}>
                                    <p><strong>식당 이름</strong> {item.resta_name}</p>
                                    {/*<p><strong>소개:</strong> {item.resta_bio}</p>*/}
                                    {/*<p><strong>url:</strong> <a href={item.url?.startsWith('http') ? item.url : `https://${item.url}`}*/}
                                    {/*                            target="_blank" rel="noopener noreferrer">{item.url}</a></p>*/}
                                    <p><strong>주소</strong> {item.address}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>

            <br />
            <div className={"resta_search_buttons"}>
                <button className={"resta_search_button"} onClick={onClose}>닫기</button>
                <button className={"resta_search_button"} onClick={nextStep}>다음</button>
            </div>
        </div>
    );
};

export default AddStepOne;