import {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {Pagination, Stack, Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import Link from "next/link";
import Image from 'next/image';

export default function Admin_courseList({sort}) {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);

    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
    const pageSize = 10;  // 한 페이지에 보여줄 아이템 수

    const [info, setInfo] = useState({
        user_id: '',
    });

    useEffect(() => {
        const user_id = sessionStorage.getItem('user_id');
        if (user_id) {
            setInfo(prev => ({
                ...prev,
                user_id: user_id
            }));
        }
        renderList();
    }, [page, sort]);

    const renderList = async () => {
        try {
            const {data} = await axios.get(`http://localhost/course_list/${page}/${sort}`);
            console.log(data.list);
            setItems(data.list);
            if (data.totalCount) {
                setTotalPages(Math.ceil(data.totalCount / pageSize));
            } else {
                setTotalPages(10);
            }
        } catch (error) {
            console.error("데이터 로드 실패", error);
        }
    };

    const [selectedCourse, setSelectedCourse] = useState([]);

    // 선택된 아이템
    const selectItem = (e, postIdx) => {
        if (e.target.checked) {
            setSelectedCourse(prev => [
                ...prev,
                postIdx
            ]);
        } else {
            setSelectedCourse(prev => prev.filter((user_id) => user_id !== postIdx));
        }
    }

    // 선택 블라인드 기능
    const selectBlind = async () => {
        const blind = selectedCourse.map(post_idx =>
            axios.patch(`http://localhost/${post_idx}/course_blind`)
        );
        await Promise.all(blind);
        console.log(selectedCourse);
        if (selectedCourse.length > 0) {
            alert('선택된 항목이 블라인드 처리 되었습니다.');
            renderList();
        } else {
            alert('블라인드 처리에 실패했습니다.');
        }
    }

    // 선택 삭제 기능
    const selectDelete = async () => {
        const {data} = await axios.delete('http://localhost/delete', {
            data: selectedCourse.map(user_id => ({post_idx: user_id})),
        });
        console.log(data);
        if (data.success === true) {
            alert('게시글이 성공적으로 삭제되었습니다.');
            setSelectedCourse([]);
            renderList();
        } else {
            alert('게시글 삭제에 실패했습니다.');
        }
    };

    return (
        <>
            <div className="commonList">
                {Array.isArray(items) && items.map((item) => (
                    <div key={item.course.post_idx} className="listItem">
                        <div className="mainImage">
                            <input className={"admin_checkBox"}
                                   type={"checkbox"}
                                   onChange={(e) => selectItem(e, item.course.post_idx)}
                                   checked={selectedCourse.includes(item.course.post_idx)}
                            />
                            <img
                                src={item.course.blind === true ? '/blind.svg' : `http://localhost/upload/${item.course_img}`}
                                alt="코스 이미지"
                                onError={(e) => {
                                    e.target.src = '/no_image.png';
                                }}
                            />
                        </div>

                        <span className="courseTitle">
                            <Link href={`/courseDetail/${item.course.post_idx}`}>
                                {item.course?.subject}
                            </Link>
                        </span>
                        <span className="courseComment">[{item.cmt_cnt}]</span><br/>
                        <span className="courseAuthor">{item.nickname}</span>
                        <span className="courseViews">조회 {item.course?.b_hit}</span><br/>
                        <span className="courseScope">별점 {item.star_avg}</span>
                        <span className="courseLike">좋아요 {item.like_cnt}</span><br/>
                        <span className="courseDate">{item.course?.reg_date}</span>
                    </div>
                ))}
            </div>
            <Stack spacing={2} sx={{mt: 2}} className={"courseStack"} alignItems="center">
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    variant="outlined"
                    shape="rounded"
                    siblingCount={1}
                    boundaryCount={1}
                    showFirstButton
                    showLastButton
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: '#c9c9c9',
                            borderColor: '#d29292',
                            border: 3,
                            borderRadius: '10px',
                            minWidth: '50px',
                            height: '50px',
                            padding: '10px',
                            fontSize: '20px',
                        },
                        '& .Mui-selected': {
                            backgroundColor: 'rgba(42,205,175,0.5)',
                            color: '#a17070',
                            borderColor: '#d29292',
                        },
                    }}
                />
            </Stack>

            <div className={"buttons"}>
                <button onClick={selectBlind} className={"admin_button"}>선택 블라인드 / 블라인드 해제</button>
                <button onClick={selectDelete} className={"admin_button_delete"}>선택 삭제</button>
            </div>

        </>
    );
}
