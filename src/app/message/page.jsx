'use client';

import LeftMenu from '@/app/leftMenu';
import MessageList from './messageList';

export default function MessagePage() {
    return (
        <div style={{ display: 'flex' }}>
            <LeftMenu />
            <MessageList />
        </div>
    );
}