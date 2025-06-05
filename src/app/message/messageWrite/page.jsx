'use client';

import LeftMenu from '@/app/leftMenu';
import MessageWrite from './messageWrite';

export default function MessagePage() {
    return (
        <div style={{ display: 'flex' }}>
            <LeftMenu />
            <MessageWrite/>
        </div>
    );
}