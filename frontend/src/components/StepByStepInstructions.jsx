import React, { useState, useEffect } from 'react';
import { useVoiceGuide } from '../hooks/useVoiceGuide';

const StepByStepInstructions = ({ steps, language = 'en' }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isStepCompleted, setIsStepCompleted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [durationRemaining, setDurationRemaining] = useState(0);
  const { speak, stop, isSpeaking } = useVoiceGuide();

  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const isLastStep = currentStepIndex === totalSteps - 1;

  // Debug: Log step changes
  useEffect(() => {
    console.log('📍 Step changed to:', currentStepIndex + 1, 'of', totalSteps);
  }, [currentStepIndex, totalSteps]);

  // Upbeat music/sound effect (using Web Audio API)
  const playCompletionSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioContext.currentTime;
      
      // Play a cheerful sound sequence (C5, E5, G5 major chord)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.2);
        
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.2);
      });
    } catch (e) {
      console.log('Audio context not available');
    }
  };

  // Duration timer countdown
  useEffect(() => {
    let timer;
    console.log('⏲️ Duration timer effect: isStepCompleted=', isStepCompleted, 'durationRemaining=', durationRemaining, 'showCountdown=', showCountdown);
    if (isStepCompleted && durationRemaining > 0 && !showCountdown) {
      console.log('⏲️ Counting down duration...');
      timer = setTimeout(() => setDurationRemaining(durationRemaining - 1), 1000);
    } else if (durationRemaining === 0 && isStepCompleted && !showCountdown) {
      // Duration finished, show countdown
      console.log('⏲️ Duration finished! Showing countdown');
      setShowCountdown(true);
    }
    return () => clearTimeout(timer);
  }, [durationRemaining, isStepCompleted, showCountdown]);

  // Countdown timer - auto proceed when it reaches 0
  useEffect(() => {
    // Guard: only proceed if we're actually showing countdown
    if (!showCountdown) {
      return;
    }

    console.log('⏱️ Countdown Effect: countdown=', countdown, 'showCountdown=', showCountdown, 'isLastStep=', isLastStep);
    
    // Guard: only proceed if countdown has been initialized
    if (countdown === null || countdown === undefined) {
      console.log('⏱️ Countdown not initialized yet');
      return;
    }
    
    if (countdown > 0) {
      console.log('⏱️ Countdown in progress:', countdown);
      const timer = setTimeout(() => {
        setCountdown(prev => {
          console.log('⏱️ Countdown tick:', prev, '→', prev - 1);
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      if (isLastStep) {
        console.log('⏱️ Countdown reached zero but this is the last step');
      } else {
        // Auto proceed to next step immediately
        console.log('⏱️ COUNTDOWN ZERO! Auto-proceeding to next step');
        // Immediately reset to prevent re-entry
        setShowCountdown(false);
        setCountdown(null);
        // Then proceed to next step
        setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1);
          setIsStepCompleted(false);
          setDurationRemaining(0);
        }, 0);
      }
    }
  }, [countdown, showCountdown]);

  // Initialize countdown when showing countdown
  useEffect(() => {
    console.log('🎯 Countdown initialization check: showCountdown=', showCountdown, 'countdown=', countdown);
    if (showCountdown && countdown === null) {
      console.log('🎯 Initializing countdown to 10');
      setCountdown(10);
    }
  }, [showCountdown]);

  const proceedToNextStep = () => {
    if (!isLastStep) {
      setCurrentStepIndex(currentStepIndex + 1);
      setIsStepCompleted(false);
      setCountdown(null);
      setShowCountdown(false);
      setDurationRemaining(0);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setIsStepCompleted(false);
      setCountdown(null);
      setShowCountdown(false);
      setDurationRemaining(0);
    }
  };

  const handleSkipCountdown = () => {
    setCountdown(null);
    setShowCountdown(false);
    proceedToNextStep();
  };

  const handleSkipDuration = () => {
    setDurationRemaining(0);
  };

  const handleVoiceGuide = () => {
    if (isSpeaking) {
      stop();
    } else {
      const text = `Step ${currentStepIndex + 1}. ${currentStep.instruction}`;
      console.log('🔊 Speaking with language:', language);
      console.log('🔊 Step duration:', currentStep.duration, 'minutes');
      speak(text, 1, () => {
        // When voice finishes, play music and start duration timer
        console.log('🔊 Voice finished, starting duration timer');
        playCompletionSound();
        const stepDuration = (currentStep.duration || 1) * 60;
        console.log('🔊 Setting duration remaining to:', stepDuration, 'seconds');
        setDurationRemaining(stepDuration);
        setIsStepCompleted(true);
      }, language);
    }
  };

  return (
    <div className="card bg-gradient-to-br from-green-50 to-blue-50 border-4 border-green-500 shadow-xl">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">👨‍🍳 Step-by-Step Lesson Mode</h3>
          <span className="text-sm font-bold bg-green-600 text-white px-3 py-1 rounded-full">
            {currentStepIndex + 1} / {totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Step Display */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
            {currentStepIndex + 1}
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 font-semibold">STEP {currentStepIndex + 1} OF {totalSteps}</p>
            {currentStep.duration && (
              <p className="text-sm text-gray-700 mt-1">
                ⏱️ <span className="font-bold">{currentStep.duration}</span> minutes
              </p>
            )}
          </div>
        </div>

        {/* Instruction Text */}
        <div className="bg-white rounded-lg p-6 mb-4 shadow-md border-l-4 border-green-500">
          <p className="text-lg text-gray-800 leading-relaxed font-medium">
            {currentStep.instruction}
          </p>
        </div>

        {/* Step Image */}
        {currentStep.imageUrl && (
          <img
            src={currentStep.imageUrl}
            alt={`Step ${currentStepIndex + 1}`}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
      </div>

      {/* Duration Timer Display */}
      {isStepCompleted && durationRemaining > 0 && !showCountdown && (
        <div className="mb-6 p-4 bg-blue-100 border-2 border-blue-500 rounded-lg">
          <p className="text-blue-800 font-bold flex items-center gap-2 text-lg">
            ⏱️ Step Duration Timer
          </p>
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-700 mb-2">Time remaining for this step:</p>
            <div className="text-5xl font-bold text-blue-600 mb-3 font-mono">
              {Math.floor(durationRemaining / 60)}:{String(durationRemaining % 60).padStart(2, '0')}
            </div>
            <p className="text-sm text-blue-700">Continue with the step...</p>
          </div>
        </div>
      )}

      {/* Countdown Display */}
      {isStepCompleted && showCountdown && countdown !== null && (
        <div className="mb-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg">
          <p className="text-green-800 font-bold flex items-center gap-2 text-lg">
            ✅ Step {currentStepIndex + 1} Completed!
          </p>
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-700 mb-2">Ready for next step in:</p>
            <div className="text-6xl font-bold text-green-600 mb-3 animate-pulse">
              {countdown}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap mb-4">
        {/* Voice Guide */}
        <button
          onClick={handleVoiceGuide}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex-1 ${
            isSpeaking
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } ${isStepCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isStepCompleted}
        >
          {isSpeaking ? '⏹️ Stop Voice' : '🔊 Listen'}
        </button>

        {/* Skip Duration Button */}
        {isStepCompleted && durationRemaining > 0 && !showCountdown && (
          <button
            onClick={handleSkipDuration}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-all flex-1"
          >
            ⏭️ Skip Timer
          </button>
        )}

        {/* Skip Countdown Button */}
        {isStepCompleted && showCountdown && countdown !== null && (
          <button
            onClick={handleSkipCountdown}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-all flex-1"
          >
            ⏭️ Skip Countdown
          </button>
        )}

        {/* Previous Button */}
        {currentStepIndex > 0 && (
          <button
            onClick={goToPreviousStep}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-all flex-1"
          >
            ⬅️ Previous
          </button>
        )}
      </div>

      {/* Completion Message */}
      {isLastStep && isStepCompleted && countdown === null && (
        <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-600 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-700 mb-2">🎉 Recipe Complete!</p>
          <p className="text-gray-700">Great job! Your dish is ready to enjoy!</p>
        </div>
      )}
    </div>
  );
};

export default StepByStepInstructions;
