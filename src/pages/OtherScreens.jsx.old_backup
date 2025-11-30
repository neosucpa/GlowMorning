import React from 'react';
import { useNavigate } from 'react-router-dom';
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

export const Settings = () => {
    const navigate = useNavigate();
    return (
        <PageLayout title="설정">
            <div className="settings-list">
                <div className="settings-item">
                    <span>알림 설정</span>
                    <div className="toggle-switch"></div>
                </div>
                <div className="settings-item" onClick={() => navigate('/pledge', { state: { viewMode: true } })} style={{ cursor: 'pointer' }}>
                    <span>서약서 보기</span>
                    <span>›</span>
                </div>
                <div className="settings-item">
                    <span>버전 정보</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>v0.1.0</span>
                </div>
            </div>
        </PageLayout>
    );
};
