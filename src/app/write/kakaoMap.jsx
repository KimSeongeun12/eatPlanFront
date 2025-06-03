'use client';
import { useEffect, useRef } from 'react';

export default function KakaoMap({ address }) {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps || !window.kakao.maps.load) {
            console.error('Kakao SDK가 아직 로드되지 않았습니다.');
            return;
        }

        window.kakao.maps.load(() => {
            const container = mapRef.current;
            const options = {
                center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                level: 3
            };

            const map = new window.kakao.maps.Map(container, options);

            // ✅ Geocoder 인스턴스 생성 전에 존재 여부 확인
            if (window.kakao.maps.services) {
                const geocoder = new window.kakao.maps.services.Geocoder();

                geocoder.addressSearch(address, (result, status) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                        map.setCenter(coords);
                        new window.kakao.maps.Marker({ map, position: coords });
                    }
                });
            } else {
                console.error('Geocoder 서비스가 존재하지 않습니다. SDK에 libraries=services 포함 여부 확인');
            }
        });
    }, [address]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}