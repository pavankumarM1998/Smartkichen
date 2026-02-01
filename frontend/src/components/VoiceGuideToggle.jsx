import React, { useState } from 'react';
import { useVoiceGuide } from '../hooks/useVoiceGuide';

const VoiceGuideToggle = ({ enabled = true, onEnabledChange }) => {
  const { isSpeaking, stop } = useVoiceGuide();

  return (
    <button
      onClick={() => {
        if (isSpeaking) {
          stop();
        }
        onEnabledChange?.(!enabled);
      }}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        enabled
          ? isSpeaking
            ? 'bg-red-500 text-white'
            : 'bg-green-500 text-white hover:bg-green-600'
          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
      }`}
    >
      {isSpeaking ? '⏹️ Stop Voice' : '🔊 Voice Mode'}
    </button>
  );
};

export default VoiceGuideToggle;
