'use client'
import '../mainCss.css';
import './listCss.css';
import LeftMenu from '../leftMenu';
import BestList from './bestList';
import CommonList from './commonList';
import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {styled} from '@mui/material/styles';

export default function List() {
    const PlainFormControl = styled(FormControl)({
        minWidth: 200,
        marginBottom: 16,
        marginLeft: 16,
        display: 'inline-block',
        position: 'relative',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    });

    const PlainSelect = styled(Select)({
        width: 200,
        // padding: '4px 8px',        // 위아래 패딩 줄임 (기존 8px → 4px)
        borderRadius: 8,
        fontSize: 18,
        lineHeight: '1.0',          // 높이 조절용 라인 높이
        cursor: 'pointer',
        '&:focus': {
            borderColor: '#CC503b',
            outline: 'none',
        },
        '& .MuiSelect-select': {
            paddingRight: 32,
            lineHeight: '1.2',
            height: 'auto',           // 높이 자동 조절
            display: 'flex',
            alignItems: 'center',     // 텍스트 세로 중앙 정렬
        },
        '& svg': {
            color: '#666',
            fontSize: 20,             // 아이콘 크기도 적당히 줄이기 가능
        },
    });

    const [visible, setVisible] = useState('bestList');
    const [sort, setSort] = useState('date_desc'); // 정렬 기준 상태

    const showBestList = () => {
        setVisible('bestList')
    }
    const showCommonList = () => {
        setVisible('commonList')
    }

    return (
        <>
            <LeftMenu/>
            <div className={"rightMenu"}>
                <div className="tabs">
                    <button className={visible === 'commonList' ? 'active-span' : ''} onClick={showCommonList}>
                        일반 코스
                    </button>
                    <button className={visible === 'bestList' ? 'active-span' : ''} onClick={showBestList}>
                        베스트 코스
                    </button>
                    <div className="searchDiv">
                        {visible === 'commonList' && (
                            <>
                                <PlainFormControl>
                                    <PlainSelect
                                        labelId="sort-select-label"
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="date_desc">등록일 (최신순)</MenuItem>
                                        <MenuItem value="date_asc">등록일 (오래된 순)</MenuItem>
                                        <MenuItem value="hit_desc">조회수 (많은 순)</MenuItem>
                                        <MenuItem value="hit_asc">조회수 (적은 순)</MenuItem>
                                        <MenuItem value="star_avg_desc">별점 높은 순</MenuItem>
                                        <MenuItem value="star_avg_asc">별점 낮은 순</MenuItem>
                                    </PlainSelect>
                                </PlainFormControl>
                            </>
                        )}
                        <div className="search">
                            <Link href="/courseSearch">
                                <img src="searchIcon.png" alt="돋보기 아이콘" />
                            </Link>
                        </div>
                    </div>
                </div>
                {visible === 'bestList' && <BestList/>}
                {visible === 'commonList' && <CommonList sort={sort}/>}
            </div>
        </>
    );
}