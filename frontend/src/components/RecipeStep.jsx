import React from 'react';
import { useVoiceGuide } from '../hooks/useVoiceGuide';

const RecipeStep = ({ step, stepNumber, totalSteps, onVoiceClick }) => {
  const { speak, stop, isSpeaking } = useVoiceGuide();

  const handleVoiceGuide = () => {
    if (isSpeaking) {
      stop();
    } else {
      const text = `Step ${stepNumber}. ${step.instruction}`;
      speak(text);
      if (onVoiceClick) onVoiceClick();
    }
  };

  return (
    <div className="card mb-4 border-l-4 border-primary">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            {stepNumber}
          </div>
          <span className="text-sm text-gray-600">
            Step {stepNumber} of {totalSteps}
          </span>
        </div>
        <button
          onClick={handleVoiceGuide}
          className={`px-3 py-1 rounded text-sm font-medium transition-all ${
            isSpeaking
              ? 'bg-red-500 text-white'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {isSpeaking ? '⏹️ Stop' : '🔊 Voice'}
        </button>
      </div>

      <p className="text-gray-800 mb-3 leading-relaxed">{step.instruction}</p>

      {step.duration && (
        <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
          ⏱️ Estimated time: {step.duration} minutes
        </p>
      )}

      {step.imageUrl && (
        <img
          src={step.imageUrl}
          alt={`Step ${stepNumber}`}
          className="w-full h-48 object-cover rounded-lg mt-3"
        />
      )}
    </div>
  );
};

export default RecipeStep;
