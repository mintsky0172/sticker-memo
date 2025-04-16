import React, { useState } from 'react';
import "./PanelTabs.css";

export default function PanelTabs({ onSelectSticker, onSelectBackground }) {
  const [activeTab, setActiveTab] = useState('sticker'); 

  return (
    <div className="panel-wrapper">
      {/* 탭 버튼 */}
      <div className="tab-buttons">
        <button
          className={activeTab === 'sticker' ? 'active' : ''}
          onClick={() => setActiveTab('sticker')}
        >
          스티커
        </button>
        <button
          className={activeTab === 'background' ? 'active' : ''}
          onClick={() => setActiveTab('background')}
        >
          배경
        </button>
      </div>

      {/* 내용 영역 */}
      {activeTab === 'sticker' && (
        <div className="tab-content sticker-tab">
          {/* 스티커 썸네일 */}
          <img src="/stickers/egg.png" onClick={() => onSelectSticker('/stickers/egg.png')} />
          <img src="/stickers/bacon.png" onClick={() => onSelectSticker('/stickers/bacon.png')} />
        </div>
      )}
      {activeTab === 'background' && (
        <div className="tab-content background-tab">
          {/* 배경 썸네일 */}
          <img src="/bg-grid.png" onClick={() => onSelectBackground('/bg-grid.png')} />
          <img src="/bg-check.png" onClick={() => onSelectBackground('/bg-check.png')} />
          <img src="/bg-plate.png" onClick={() => onSelectBackground('/bg-plate.png')} />
        </div>
      )}
    </div>
  );
}
