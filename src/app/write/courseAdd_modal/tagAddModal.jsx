'use client'

import {useEffect, useMemo, useState} from "react";
import axios from "axios";

const TagAddModal = ({onClose}) => {
    // 페이지 입장시 백에서 태그 카테고리, 태그 리스트 가져오기
    useEffect(() => {
        locationTagList();
        tagList();
        tagCateList();
    }, []);

    // 선택한 목록들
    const [selectedArea, setSelectedArea] = useState([]); // 선택한 지역태그
    const [selectedTag, setSelectedTag] = useState([]);   // 선택한 태그
    const [selectedList, setSelectedList] = useState([]); // 선택한 지역,태그

    // 태그 카테고리 리스트 가져오기
    const [tagCate, setTagCate] = useState([]);
    const tagCateList = async () => {
        const {data} = await axios.get("http://localhost/list_tagcate");
        setTagCate(data.list_tagcate);
    }

    // 태그 리스트 가져오기
    const [tag, setTag] = useState([]);
    const tagList = async () => {
        const {data} = await axios.get("http://localhost/list_tag");
        setTag(data.list_tag_whole);
    }

    // 지역태그 리스트 가져오기
    const [locationTag, setLocationTag] = useState([]);
    const locationTagList = async () => {
        const {data} = await axios.get('http://localhost/list_tag_area');
        setLocationTag(data.list_area);
    }

    // 지역태그 선택, 취소하기
    const toggleArea = (area) => {
        setSelectedArea(prev =>
            prev.includes(area)
                ? prev.filter(a => a !== area)
                : [...prev, area]
        );
        setSelectedList(prev => {
            const isSelected = selectedArea.includes(area);
            if (isSelected) {
                return prev.filter(entry => !(entry.type === 'area' && entry.value === area));
            } else {
                return [...prev, {type: 'area', value: area}];
            }
        });
    };

    // 태그 선택, 취소하기
    const toggleTag = (tag) => {
        setSelectedTag(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
        setSelectedList(prev => {
            const isSelected = selectedTag.includes(tag);
            if (isSelected) {
                return prev.filter(entry => !(entry.type === 'tag' && entry.value === tag));
            } else {
                return [...prev, {type: 'tag', value: tag}];
            }
        });
    };

    return (
        <>
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

                {/* 지역태그 전체 리스트 */}
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

                {/* 태그 카테고리 전체 */}
                <div>
                    {tagCate
                        .filter(cate => cate.cate_idx !== 1 && cate.cate_name !== "지역") // 임시
                        .map(cate => {
                            const tagsForCate = tag.filter(t => t.cate_idx === cate.cate_idx);
                            return (
                                <div key={cate.cate_idx} className="tag-category">
                                    <h3>{cate.cate_name}</h3>
                                    {tagsForCate.length > 0
                                        ? tagsForCate.map(t => (
                                            <div
                                                key={t.tag_idx}
                                                onClick={() => toggleTag(t.tag_name)}
                                                className={`tag-item ${selectedTag.includes(t.tag_name) ? "selected" : ""}`}
                                            >
                                                # {t.tag_name}
                                            </div>
                                        ))
                                        : <div className="empty">태그가 없습니다.</div>
                                    }
                                </div>
                            );
                        })}
                </div>
                <button onClick={onClose}>닫기</button>
                <button>선택</button>
            </div>
        </>
    );
};

export default TagAddModal;