'use client'

import axios from "axios";
import {useEffect, useMemo, useState} from "react";

export default function TagModal({ selectedTags = [], onApply, onCancel }) {
    const [tagCate, setTagCate] = useState([]);
    const [areaTag, setAreaTag] = useState([]);
    const [tag, setTag] = useState([]);

    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDist, setSelectedDist] = useState("");
    const [selectedArea, setSelectedArea] = useState([]);
    const [selectedTag, setSelectedTag] = useState([]);
    const [selectedList, setSelectedList] = useState([]);

    useEffect(() => {
        axios.get("http://192.168.0.120/list_tagcate").then(({data}) =>
            setTagCate(data?.list_tagcate ?? []));
        axios.get("http://192.168.0.120/list_tag_area").then(({data}) =>
            setAreaTag(data?.list_area ?? []));
        axios.get("http://192.168.0.120/list_tag").then(({data}) =>
            setTag(data?.list_tag_whole ?? []));
    }, []);

    useEffect(() => {
        const initialArea = selectedTags.filter(tag => tag.type === 'area_tag').map(t => t.value);
        const initialTag = selectedTags.filter(tag => tag.type === 'tag').map(t => t.value);

        setSelectedArea(initialArea);
        setSelectedTag(initialTag);
        setSelectedList(selectedTags);
    }, [selectedTags]);

    const uniqueCities = useMemo(() => {
        if (!Array.isArray(areaTag)) return [];
        return [...new Set(areaTag.map(at => at.city))];
    }, [areaTag]);

    const toggleArea = (area) => {
        setSelectedArea(prev =>
            prev.includes(area)  ? prev.filter(a => a !== area) : [...prev, area]
        );
        setSelectedList(prev => {
            const isSelected = selectedArea.includes(area);
            return isSelected
                ? prev.filter(entry => !(entry.type === 'area_tag' && entry.value === area))
                : [...prev, { type: 'area_tag', value: area }];
        });
    };

    const toggleTag = (tag) => {
        setSelectedTag(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
        setSelectedList(prev => {
            const isSelected = selectedTag.includes(tag);
            return isSelected
                ? prev.filter(entry => !(entry.type === 'tag' && entry.value === tag))
                : [...prev, { type: 'tag', value: tag }];
        });
    };

    const resetAll = () => {
        setSelectedArea([]);
        setSelectedTag([]);
        setSelectedList([]);
    };

    return (
        <div className="tagModalOverlay">
            <div className="tagModalContent">
                {/* 선택된 태그 표시 */}
                <div className="selectedRow">
                    <h3 className="selectedList">
                        {selectedList.map((item, idx) => (
                            <span key={idx}
                                  onClick={() => {
                                      setSelectedList(prev => prev.filter(entry => entry.value !== item.value));
                                      if (item.type === 'area_tag') {
                                          setSelectedArea(prev => prev.filter(a => a !== item.value));
                                      }
                                      if (item.type === 'tag') {
                                          setSelectedTag(prev => prev.filter(t => t !== item.value));
                                      }
                                  }}>
                                {item.value}
                            </span>
                        ))}
                    </h3>
                    <button onClick={resetAll} className="resetBtn">선택 초기화</button>
                </div>

                {/* 지역태그 영역 */}
                <div className="tagAreaWrapper">
                    <div className="cityWrapper">
                        <h5 className="cityHead">시 · 도</h5>
                        <ul className="city">
                            {uniqueCities.map(city => (
                                <li key={city}
                                    className={city === selectedCity ? "activeModal" : ""}
                                    onClick={() => setSelectedCity(city)}
                                >{city}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="distWrapper">
                        <h5 className="distHead">시 · 군 · 구</h5>
                        <ul className="dist">
                            {[...new Set(
                                areaTag
                                    .filter(distCate => distCate.city === selectedCity)
                                    .map(distName => distName.dist)
                            )].map(dist => (
                                <li
                                    key={dist}
                                    className={(dist === selectedDist ? "activeModal " : "")}
                                    onClick={() => setSelectedDist(dist)}
                                >{dist}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="areaWrapper">
                        <ul className="area">
                            {areaTag
                                .filter(at => at.dist === selectedDist)
                                .map(at => (
                                    <li key={at.area_tag_idx}
                                        className={(selectedArea.includes(at.tag_name) ? "activeArea " : "noneActiveArea ") +
                                            (at.city === selectedCity ? "" : "hidden")}
                                        onClick={() => toggleArea(at.tag_name)}
                                    >{at.tag_name}</li>
                                ))}
                        </ul>
                    </div>
                </div>

                {/* 일반 태그 리스트 */}
                <div className="tagWrapper">
                    {tagCate
                        .filter(cate => cate.cate_idx !== 1)
                        .map(cate => {
                            const tagsForCate = tag.filter(t => t.cate_idx === cate.cate_idx && t.isClass === 'course');
                            return (
                                <div key={cate.cate_idx} className="tag">
                                    <h3>{cate.cate_name}</h3>
                                    <ul className={"tags"}>
                                        {tagsForCate.length > 0
                                            ? tagsForCate.map(t =>
                                                <li key={t.tag_idx}
                                                    className={selectedTag.includes(t.tag_name) ? "activeTag" : "noneActiveTag"}
                                                    onClick={() => toggleTag(t.tag_name)}
                                                >{t.tag_name}</li>)
                                            : <li className="empty">태그가 없습니다.</li>
                                        }
                                    </ul>
                                </div>
                            );
                        })}
                </div>

                {/* 하단 버튼 */}
                <div className="tagModalFooter">
                    <button className="cancelBtn" onClick={onCancel}>취소</button>
                    <button className="applyBtn"
                            onClick={() => {
                                const enrichedList = selectedList.map(item => {
                                    if (item.type === 'tag') {
                                        const found = tag.find(t => t.tag_name === item.value && t.isClass === 'course');
                                        return {
                                            type: 'tag',
                                            value: item.value,
                                            idx: found?.tag_idx || null,
                                            isClass: 'tag'
                                        };
                                    } else {
                                        const found = areaTag.find(a => a.tag_name === item.value);
                                        return {
                                            type: 'area_tag',
                                            value: item.value,
                                            idx: found?.area_tag_idx || null,
                                            isClass: 'area_tag'
                                        };
                                    }
                                });
                                onApply(enrichedList);
                            }}>적용</button>
                </div>
            </div>
        </div>
    );
}
