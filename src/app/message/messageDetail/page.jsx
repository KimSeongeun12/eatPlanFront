'use client';

import LeftMenu from '@/app/leftMenu';
import MessageDetail from './messageDetail';

export default function MessagePage() {
    return (
        <div style={{ display: 'flex' }}>
            <LeftMenu />
            <MessageDetail />
        </div>
    );
}