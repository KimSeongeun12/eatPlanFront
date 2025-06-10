import {useEffect, useMemo, useState} from "react";
import axios from "axios";

export default function TagComponent({selectTag}) {
    // 페이지 입장시 백에서 태그 카테고리, 태그 리스트 가져오기
    useEffect(() => {
        locationTagList();
        tagList();
        tagCateList();
    }, []);

    // 선택한 목록들
    const [selectedCity, setSelectedCity] = useState(""); // 선택한 시·도
    const [selectedDist, setSelectedDist] = useState(""); // 선택한 시·군·구
    const [selectedArea, setSelectedArea] = useState([]); // 선택한 지역태그
    const [selectedTag, setSelectedTag] = useState([]);   // 선택한 태그
    const [selectedList, setSelectedList] = useState([]); // 선택한 지역,태그

    useEffect(() => {
        if (selectTag) {
            selectTag({
                area: selectedArea,
                tag: selectedTag,
                combined: selectedList,
            });
        }
    }, [selectedArea, selectedTag]);

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

    // 지역태그 중복제거
    const uniqueCities = useMemo(() => {
        if (!Array.isArray(locationTag)) return [];
        return [...new Set(locationTag.map(at => at.city))];
    }, [locationTag]);

    const uniqueDists = useMemo(() => {
        const seen = new Set();
        return locationTag
            .filter(item => item.city === selectedCity)
            .filter(item => {
                if (seen.has(item.dist)) return false;
                seen.add(item.dist);
                return true;
            });
    }, [locationTag, selectedCity]);

    // 지역태그 선택, 취소하기
    const toggleArea = (area) => {
        const totalSelected = selectedArea.length + selectedTag.length;

        if (!selectedArea.includes(area) && totalSelected >= 5) {
            alert("태그는 최대 5개까지 선택할 수 있습니다.");
            return;
        }

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
        const totalSelected = selectedArea.length + selectedTag.length;

        if (!selectedTag.includes(tag) && totalSelected >= 5) {
            alert("태그는 최대 5개까지 선택할 수 있습니다.");
            return;
        }

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
                return [...prev, { type: 'tag', value: tag }];
            }
        });
    };

    return (
        <>
            <h2>지역</h2>
            <div className={"area_all_div"} style={{display: "flex"}}>
                {/*시·도 리스트*/}
                <div className={"city_div"}>
                    <div className={"city_top_div"}>시 · 도</div>
                        {uniqueCities.map(city => (
                            <div
                                key={city}
                                onClick={() => setSelectedCity(city)}
                                className={selectedCity === city ? "selected" : "notSelected"}
                            >{city}</div>
                        ))}
                </div>

                {/*시·군·구 리스트*/}
                <div className={"district_div"}>
                    <div className={"district_top_div"}>시 · 군 · 구</div>
                        {uniqueDists.map(distItem => (
                            <div
                                key={distItem.area_tag_idx}
                                onClick={() => setSelectedDist(distItem.dist)}
                                className={selectedDist === distItem.dist ? "selected" : "notSelected"}
                            >
                                {distItem.dist}
                            </div>
                        ))}
                </div>

                {/*지역태그 리스트*/}
                <div className={"area_div"}>
                    {locationTag
                        .filter(areaCate => areaCate.dist === selectedDist)
                        .map(at => (
                            <div
                                key={at.area_tag_idx}
                                onClick={() => toggleArea(at.tag_name)}
                                className={`tag-item ${selectedArea.includes(at.tag_name) ? "tagSelected" : "not_tagSelected"}`}
                            ># {at.tag_name}</div>
                        ))}
                </div>

            </div>

            {/*태그 리스트*/}
            <div>
                {tagCate
                    .filter(cate => cate.cate_idx !== 1 && cate.cate_name !== "지역") // 임시
                    .map(cate => {
                        const tagsForCate = tag.filter(t => t.cate_idx === cate.cate_idx);
                        return (
                            <div key={cate.cate_idx}>
                                <h2>{cate.cate_name}</h2>
                                {tagsForCate.length > 0
                                    ? tagsForCate.map(t =>
                                        <div key={t.tag_idx}
                                            onClick={() => toggleTag(t.tag_name)}
                                             className={`tag-item ${selectedTag.includes(t.tag_name) ? "tagSelected" : "not_tagSelected"}`}
                                        ># {t.tag_name}</div>)
                                    : <div className="empty">태그가 없습니다.</div>
                                }
                            </div>
                        );
                    })}
            </div>
        </>
    );
}