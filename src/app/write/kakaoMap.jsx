'use client';
import { useEffect, useRef } from 'react';

export default function KakaoMap({ address }) {
    useEffect(() => {
        kakao.maps.load(() => {
            const containerEl = container.current;

            // 지도 생성 기본 옵션
            let mapOption = {
                center: new kakao.maps.LatLng(37.570377, 126.985409), // 기본 중심: 종각역
                level: 3
            };

            const map = new kakao.maps.Map(containerEl, mapOption);
            const bounds = new kakao.maps.LatLngBounds();

            const restaInfoList = detail.content_detail_resta.map(r => r.resta?.[0]).filter(Boolean);

            if (restaInfoList.length > 0) {
                restaInfoList.forEach(restaInfo => {
                    if (restaInfo?.lat && restaInfo?.lng) {
                        const position = new kakao.maps.LatLng(restaInfo.lat, restaInfo.lng);

                        const marker = new kakao.maps.Marker({
                            position,
                            map
                        });

                        const infoWindow = new kakao.maps.InfoWindow({
                            position,
                            content: `<div style="padding:5px;font-size:13px;font-weight:bold;">${restaInfo.resta_name}</div>`
                        });

                        infoWindow.open(map, marker);
                        bounds.extend(position);
                    }
                });

                // 모든 마커 포함되도록 범위 설정
                map.setBounds(bounds);
            } else {
                // ✅ 식당 정보 없을 경우 종각역에 기본 마커 표시
                const defaultPosition = new kakao.maps.LatLng(37.570377, 126.985409);
                const marker = new kakao.maps.Marker({
                    position: defaultPosition,
                    map,
                    title: "종각역"
                });

                const infoWindow = new kakao.maps.InfoWindow({
                    position: defaultPosition,
                    content: `<div style="padding:5px;font-size:13px;font-weight:bold;">종각역 근처</div>`
                });

                infoWindow.open(map, marker);
            }
        });
    }, [detail]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}