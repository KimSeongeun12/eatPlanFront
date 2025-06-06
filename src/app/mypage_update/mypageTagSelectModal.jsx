import {useEffect, useMemo, useState} from "react";
import axios from "axios";

export default function MypageTagSelectModal({ onClose, onSelect }) {
    // 선택한 태그 (지역 + 일반)
    const [selectedList, setSelectedList] = useState([]);

    // 선택된 태그만 분리
    const selectedTag = useMemo(
        () => selectedList.filter(item => item.type === 'tag').map(item => item.value),
        [selectedList]
    );
    const selectedArea = useMemo(
        () => selectedList.filter(item => item.type === 'area').map(item => item.value),
        [selectedList]
    );

    // 태그/지역/카테고리 리스트
    const [tagCate, setTagCate] = useState([]);
    const [tag, setTag] = useState([]);
    const [locationTag, setLocationTag] = useState([]);

    // 데이터 불러오기
    useEffect(() => {
        locationTagList();
        tagList();
        tagCateList();
    }, []);

    const tagCateList = async () => {
        const { data } = await axios.get("http://localhost/list_tagcate");
        setTagCate(data.list_tagcate);
    };

    const tagList = async () => {
        const { data } = await axios.get("http://localhost/list_tag");
        setTag(data.list_tag_whole);
    };

    const locationTagList = async () => {
        const { data } = await axios.get('http://localhost/list_tag_area');
        setLocationTag(data.list_area);
    };

    // 일반 태그 토글
    const toggleTag = (tagName) => {
        const isSelected = selectedList.some(item => item.type === 'tag' && item.value === tagName);

        if (!isSelected && selectedList.length >= 3) {
            alert("태그는 최대 3개까지만 선택할 수 있습니다.");
            return;
        }

        setSelectedList(prev =>
            isSelected
                ? prev.filter(item => !(item.type === 'tag' && item.value === tagName))
                : [...prev, { type: 'tag', value: tagName }]
        );
    };

    // 지역 태그 토글
    const toggleArea = (areaName) => {
        const isSelected = selectedList.some(item => item.type === 'area' && item.value === areaName);

        if (!isSelected && selectedList.length >= 3) {
            alert("태그는 최대 3개까지만 선택할 수 있습니다.");
            return;
        }

        setSelectedList(prev =>
            isSelected
                ? prev.filter(item => !(item.type === 'area' && item.value === areaName))
                : [...prev, { type: 'area', value: areaName }]
        );
    };

    const handleSelect = () => {
        onSelect(selectedList);
        onClose();
    };

    return (
        <div className="modal-tagTap">
            {/* 선택한 태그 미리보기 */}
            <div className="selected-preview">
                <h3>선택한 태그</h3>
                {selectedList.length === 0 ? (
                    <div className="empty">선택된 태그가 없습니다.</div>
                ) : (
                    <div className="selected-list">
                        {selectedList.map((item, idx) => (
                            <div key={idx} className="selected-tag">#{item.value}</div>
                        ))}
                    </div>
                )}
            </div>

            {/* 태그 카테고리 */}
            <div>
                {tagCate
                    .filter(cate => cate.cate_idx !== 1 && cate.cate_name !== "지역") // 임시
                    .map(cate => {
                        const tagsForCate = tag.filter(t => t.cate_idx === cate.cate_idx);
                        return (
                            <div key={cate.cate_idx} className="tag-category">
                                <h3>{cate.cate_name}</h3>
                                {tagsForCate.length > 0 ? (
                                    tagsForCate.map(t => (
                                        <div
                                            key={t.tag_idx}
                                            onClick={() => toggleTag(t.tag_name)}
                                            className={`tag-item ${selectedTag.includes(t.tag_name) ? "selected" : ""}`}
                                        >
                                            # {t.tag_name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty">태그가 없습니다.</div>
                                )}
                            </div>
                        );
                    })}
            </div>

            {/* 지역 태그 */}
            <h3>지역</h3>
            <div className="location-column">
                {locationTag.map(at => (
                    <div
                        key={at.area_tag_idx}
                        onClick={() => toggleArea(at.tag_name)}
                        className={`tag-item ${selectedArea.includes(at.tag_name) ? "selected" : ""}`}
                    >
                        # {at.tag_name}
                    </div>
                ))}
            </div>

            <button onClick={onClose}>닫기</button>
            <button onClick={handleSelect}>선택</button>
        </div>
    );
}