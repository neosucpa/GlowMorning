import React, { useState, useEffect, useRef } from 'react';

const MorningLogModal = ({ isOpen, onClose, record, onSave }) => {
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [noteText, setNoteText] = useState('');
    const fileInputRef = useRef(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (isOpen && record && !isInitialized.current) {
            // Initialize only when modal first opens
            console.log('Initializing modal with record:', record);
            setNoteText(record.morningNote || '');
            setPhotoPreview(record.photoUrl || null);
            setPhotoFile(null);
            isInitialized.current = true;
        } else if (!isOpen) {
            // Reset state when modal closes
            setNoteText('');
            setPhotoPreview(null);
            setPhotoFile(null);
            isInitialized.current = false;
        }
    }, [isOpen, record]);

    // Image compression utility
    const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with compression
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedDataUrl);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handlePhotoSelect = async (e) => {
        const file = e.target.files[0];
        console.log('File selected:', file);
        if (file) {
            try {
                setPhotoFile(file);
                console.log('Starting image compression...');
                // Compress image before preview
                const compressedDataUrl = await compressImage(file);
                console.log('Image compressed, setting preview...');
                setPhotoPreview(compressedDataUrl);
                console.log('Photo preview set successfully');
            } catch (error) {
                console.error('Image compression failed:', error);
                alert('이미지 처리 중 오류가 발생했습니다.');
            }
        }
    };

    const handleDeletePhoto = (e) => {
        e.stopPropagation();
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSaveClick = () => {
        console.log('Save clicked - noteText:', noteText, 'photoPreview:', photoPreview ? 'exists' : 'null');
        onSave(noteText, photoPreview);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="modal fade-in morning-log-modal">
                <div className="modal-header" style={{ position: 'relative', justifyContent: 'center' }}>
                    <h3 className="modal-title">오늘의 기록</h3>
                    <button className="modal-close" style={{ position: 'absolute', right: 0 }} onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}>×</button>
                </div>

                <div className="modal-body">
                    {/* Photo Upload Section */}
                    <div className="photo-upload-section">
                        {photoPreview ? (
                            <div className="photo-preview-container">
                                <img src={photoPreview} alt="Preview" className="photo-preview" />
                                <div className="photo-actions">
                                    <button
                                        className="photo-btn change"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        사진 변경
                                    </button>
                                    <button
                                        className="photo-btn delete"
                                        onClick={handleDeletePhoto}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="photo-upload-placeholder"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="upload-icon">📷</div>
                                <div className="upload-text">사진 추가</div>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            id="photo-upload"
                            name="photoUpload"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoSelect}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {/* Text Input Section */}
                    <div className="text-input-section">
                        <textarea
                            id="morning-note"
                            name="morningNote"
                            className="morning-note-textarea"
                            placeholder="오늘의 주요 순간, 생각, 다짐 등을 기록해보세요."
                            value={noteText}
                            onChange={(e) => {
                                if (e.target.value.length <= 100) {
                                    setNoteText(e.target.value);
                                }
                            }}
                            maxLength={100}
                            style={{ minHeight: '150px' }}
                        />
                        <div className="char-counter">{noteText.length} / 100</div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn-primary" onClick={handleSaveClick}>저장</button>
                </div>
            </div>
        </div>
    );
};

export default MorningLogModal;
