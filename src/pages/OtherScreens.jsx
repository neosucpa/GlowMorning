import React from 'react';
import BottomNav from '../components/BottomNav';
import '../index.css';

const PageLayout = ({ title, children }) => (
    <div className="page-screen" style={{ padding: '24px', paddingBottom: '100px', minHeight: '100vh', background: '#F8F7FC' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: 'var(--color-text-primary)' }}>{title}</h1>
        {children}
        <BottomNav />
    </div>
);

export const Records = () => (
    <PageLayout title="기록">
        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: '100px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <p>아침 기록 히스토리가<br />여기에 표시됩니다</p>
        </div>
    </PageLayout>
);

export const Stats = () => (
    <PageLayout title="통계">
        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: '100px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <p>나의 성장 기록이<br />여기에 표시됩니다</p>
        </div>
    </PageLayout>
);

export const Challenge = () => (
    <PageLayout title="챌린지">
        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: '100px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
            <p>새로운 도전이<br />기다리고 있어요</p>
        </div>
    </PageLayout>
);

export const Settings = () => (
    <PageLayout title="설정">
        <div className="settings-section" style={{ background: 'white', borderRadius: '16px', overflow: 'hidden' }}>
            <div className="settings-item" style={{ padding: '16px 20px', borderBottom: '1px solid #E8E4F3', display: 'flex', justifyContent: 'space-between' }}>
                <span>알림 설정</span>
                <div className="toggle-switch on" style={{ width: '48px', height: '28px', background: 'var(--color-primary)', borderRadius: '14px', position: 'relative' }}>
                    <div style={{ width: '24px', height: '24px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
                </div>
            </div>
            <div className="settings-item" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between' }}>
                <span>버전 정보</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>1.0.0</span>
            </div>
        </div>
    </PageLayout>
);
