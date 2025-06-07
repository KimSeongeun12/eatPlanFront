'use client'
import '../mainCss.css';
import './admin_courseCss.css';
import LeftMenu from '../leftMenu';
import BestList from '../list/bestList';
import {useState} from "react";
import Admin_courseList from "@/app/admin_course/admin_courseList";
import {useRouter} from "next/navigation";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

export default function Admin_course_page() {
    const [visible, setVisible] = useState('bestList');
    const [sort, setSort] = useState('date_desc'); // 정렬 기준 상태

    const showBestList = () => {setVisible('bestList')}
    const showAdmin_courseList = () => {setVisible('admin_courseList')}

    const router = useRouter();

    return (
        <>
            <LeftMenu />
            <div className={"rightMenu"}>
                <div className={"topMenuSpans"}>
                    <span onClick={showAdmin_courseList} className={visible === 'admin_courseList' ? 'active-span' : ''}>일반 코스</span>
                    <span onClick={showBestList} className={visible === 'bestList' ? 'active-span' : ''}>베스트 코스</span>
                    {visible === 'admin_courseList' && (
                        <>
                            <FormControl sx={{ minWidth: 200, mb: 2, ml: 2 }}>
                                <InputLabel id="sort-select-label">정렬 기준</InputLabel>
                                <Select
                                    labelId="sort-select-label"
                                    value={sort}
                                    label="정렬 기준"
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    <MenuItem value="date_desc">등록일 (최신순)</MenuItem>
                                    <MenuItem value="date_asc">등록일 (오래된 순)</MenuItem>
                                    <MenuItem value="hit_desc">조회수 (많은 순)</MenuItem>
                                    <MenuItem value="hit_asc">조회수 (적은 순)</MenuItem>
                                    <MenuItem value="like_desc">좋아요 많은 순</MenuItem>
                                    <MenuItem value="like_asc">좋아요 적은 순</MenuItem>
                                    <MenuItem value="star_avg_desc">별점 높은 순</MenuItem>
                                    <MenuItem value="star_avg_asc">별점 낮은 순</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}
                    <div className={"search"} onClick={() => router.push('/courseSearch')}>
                        <img src={"searchIcon.png"} alt={"돋보기 아이콘"}/>
                    </div>
                </div>
                <hr/>
                {visible === 'bestList' && <BestList/>}
                {visible === 'admin_courseList' && <Admin_courseList sort={sort}/>}
            </div>
        </>
    );
}