"use client";

import { useState, useEffect, useCallback } from "react";

interface PoemReaderProps {
  content: string[];
  title: string;
  author: string;
}

export function PoemReader({ content, title, author }: PoemReaderProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [showVoiceSelect, setShowVoiceSelect] = useState(false);
  const [rate, setRate] = useState(0.8); // 语速稍慢，适合诗词

  // 获取可用的语音
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      // 优先选择中文语音
      const chineseVoices = availableVoices.filter(
        (voice) => voice.lang.startsWith("zh") || voice.lang.includes("CN")
      );
      setVoices(chineseVoices.length > 0 ? chineseVoices : availableVoices);
      if (chineseVoices.length > 0) {
        setSelectedVoice(chineseVoices[0]);
      }
    };

    loadVoices();
    // Chrome 需要等待 voiceschanged 事件
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // 构建朗读文本
  const buildText = useCallback(() => {
    const fullText = [`${title}，${author}`, ...content].join("。");
    return fullText;
  }, [title, author, content]);

  // 开始朗读
  const handleSpeak = useCallback(() => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    // 停止之前的朗读
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(buildText());
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onpause = () => setIsPaused(true);
    utterance.onresume = () => setIsPaused(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [buildText, selectedVoice, rate, isPaused]);

  // 暂停朗读
  const handlePause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsSpeaking(false);
  }, []);

  // 停止朗读
  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  // 检查浏览器支持
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return (
      <div className="text-stone-400 text-sm">
        您的浏览器不支持语音朗读功能
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {/* 播放/暂停按钮 */}
        {!isSpeaking && !isPaused ? (
          <button
            onClick={handleSpeak}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 dark:bg-stone-700 dark:hover:bg-stone-600 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            朗读诗词
          </button>
        ) : isSpeaking ? (
          <button
            onClick={handlePause}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            暂停
          </button>
        ) : (
          <button
            onClick={handleSpeak}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            继续
          </button>
        )}

        {/* 停止按钮 */}
        {(isSpeaking || isPaused) && (
          <button
            onClick={handleStop}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                clipRule="evenodd"
              />
            </svg>
            停止
          </button>
        )}

        {/* 设置按钮 */}
        <button
          onClick={() => setShowVoiceSelect(!showVoiceSelect)}
          className="p-2 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
          title="朗读设置"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      {/* 设置面板 */}
      {showVoiceSelect && (
        <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4 space-y-4 border border-stone-200 dark:border-stone-700">
          {/* 语音选择 */}
          {voices.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                选择语音
              </label>
              <select
                value={selectedVoice?.name || ""}
                onChange={(e) => {
                  const voice = voices.find((v) => v.name === e.target.value);
                  setSelectedVoice(voice || null);
                }}
                className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 语速调节 */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              语速: {rate.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-600"
            />
            <div className="flex justify-between text-xs text-stone-500 mt-1">
              <span>慢</span>
              <span>正常</span>
              <span>快</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
