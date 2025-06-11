'use client';
import { useEffect, useState } from "react";
import axios from "axios";

const JoinTagSelectModal = ({ onClose, onSelect }) => {
    const [selectedList, setSelectedList] = useState([]);

    useEffect(() => {
        console.log("selectedList:", selectedList);
        selectedList.forEach((item, i) => {
            console.log(`item ${i}:`, item.value);
        });
    }, [selectedList]);

    const [tagCate, setTagCate] = useState([]);
    const [tag, setTag] = useState([]);
    const [locationTag, setLocationTag] = useState([]);

    useEffect(() => {
        locationTagList();
        tagList();
        tagCateList();
    }, []);

    const tagCateList = async () => {
        const { data } = await axios.get("http://192.168.0.120/list_tagcate");
        setTagCate(data.list_tagcate);
    };

    const tagList = async () => {
        const { data } = await axios.get("http://192.168.0.120/list_tag");
        setTag(data.list_tag_whole);
    };

    const locationTagList = async () => {
        const { data } = await axios.get('http://192.168.0.120/list_tag_area');
        setLocationTag(data.list_area);
    };

    const toggleTag = (tagName) => {
        const tagObj = tag.find(t => t.tag_name === tagName);
        console.log('tagName:', tagName);
        console.log('tagObj:', tagObj);
        if (!tagObj) return;

        const isSelected = selectedList.some(item => item.type === 'tag' && item.value.tag_idx === tagObj.tag_idx);

        if (!isSelected && selectedList.length >= 3) {
            alert("태그는 최대 3개까지만 선택할 수 있습니다.");
            return;
        }

        setSelectedList(prev =>
            isSelected
                ? prev.filter(item => !(item.type === 'tag' && item.value.tag_idx === tagObj.tag_idx))
                : [...prev, { type: 'tag', value: tagObj }]
        );
    };

    const toggleArea = (areaName) => {
        // tag_name 대신 area_name으로 찾는 경우도 체크
        const areaObj = locationTag.find(a => a.tag_name === areaName || a.area_name === areaName);
        console.log('toggleArea areaName:', areaName, 'found:', areaObj);
        if (!areaObj) return;

        const isSelected = selectedList.some(item => item.type === 'area' && item.value.area_tag_idx === areaObj.area_tag_idx);

        if (!isSelected && selectedList.length >= 3) {
            alert("태그는 최대 3개까지만 선택할 수 있습니다.");
            return;
        }

        setSelectedList(prev =>
            isSelected
                ? prev.filter(item => !(item.type === 'area' && item.value.area_tag_idx === areaObj.area_tag_idx))
                : [...prev, { type: 'area', value: areaObj }]
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
                        {selectedList.map((item, idx) => {
                            let tagLabel = '';

                            if (item.type === 'tag') {
                                tagLabel = item.value.tag_name || '알 수 없는 태그';
                            } else if (item.type === 'area') {
                                tagLabel = item.value.tag_name || '알 수 없는 지역';
                            } else {
                                tagLabel = '알 수 없는 항목';
                            }

                            return (
                                <div key={idx} className="selected-tag">
                                    #{tagLabel}
                                </div>
                            );
                        })}

                    </div>

                )}
            </div>

            {/* 태그 카테고리 */}
            <div>
                {tagCate
                    .filter(cate => cate.cate_idx !== 1 && cate.cate_name !== "지역")
                    .map(cate => {
                        const tagsForCate = tag.filter(t => t.cate_idx === cate.cate_idx);
                        return (
                            <div key={cate.cate_idx} className="tag-category">
                                <h3>{cate.cate_name}</h3>
                                {tagsForCate.length > 0 ? (
                                    tagsForCate.map(t => {
                                        const isSelected = selectedList.some(item =>
                                            item.type === 'tag' && item.value.tag_idx === t.tag_idx
                                        );

                                        return (
                                            <div
                                                key={t.tag_idx}
                                                onClick={() => toggleTag(t.tag_name)}
                                                className={`tag-item ${isSelected ? "selected" : ""}`}
                                            >
                                                # {t.tag_name}
                                            </div>
                                        );
                                    })
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
                {locationTag.map(at => {
                    const isSelected = selectedList.some(item =>
                        item.type === 'area' && item.value.area_tag_idx === at.area_tag_idx
                    );

                    return (
                        <div
                            key={at.area_tag_idx}
                            onClick={() => toggleArea(at.tag_name)}
                            className={`tag-item ${isSelected ? "selected" : ""}`}
                        >
                            # {at.tag_name}
                        </div>
                    );
                })}
            </div>

            <button className={"join_selectButton"} onClick={handleSelect}>선택</button>
            <button className={"join_closeButton"} onClick={onClose}>닫기</button>
        </div>
    );
};

export default JoinTagSelectModal;
