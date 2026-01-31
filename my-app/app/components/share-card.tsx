"use client";

import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";

interface ShareCardProps {
  title: string;
  author: string;
  dynasty: string;
  content: string[];
  tags: string[];
}

export function ShareCard({ title, author, dynasty, content, tags }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#1c1917",
      });
      
      const link = document.createElement("a");
      link.download = `${title}-${author}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("生成图片失败:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [title, author]);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#1c1917",
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], "poem.png", { type: "image/png" })] })) {
        await navigator.share({
          title: `${title} - ${author}`,
          text: `${title}是${author}的经典诗词`,
          files: [new File([blob], `${title}.png`, { type: "image/png" })],
        });
      } else {
        await handleDownload();
      }
    } catch (err) {
      console.error("分享失败:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [title, author, handleDownload]);

  return (
    <div className="space-y-4">
      {/* Preview Card */}
      <div
        ref={cardRef}
        className="w-[375px] mx-auto bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-8 rounded-2xl shadow-2xl"
        style={{ fontFamily: "'Noto Serif SC', serif" }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block px-4 py-1 bg-stone-700/50 rounded-full text-stone-400 text-sm mb-4">
            {dynasty}
          </div>
          <h2 className="text-3xl font-bold text-stone-100 mb-2">{title}</h2>
          <p className="text-stone-400">{author}</p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent" />
          <svg className="w-6 h-6 text-stone-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
          </svg>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent" />
        </div>

        {/* Content */}
        <div className="text-center space-y-3 mb-8">
          {content.map((line, index) => (
            <p key={index} className="text-xl text-stone-200 leading-relaxed tracking-wider">
              {line}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-stone-700/30 text-stone-400 text-xs rounded-full border border-stone-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-stone-800">
          <p className="text-stone-500 text-sm">中华诗词</p>
          <p className="text-stone-600 text-xs mt-1">按年代时间线品读古典之美</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              生成中...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下载卡片
            </>
          )}
        </button>
        
        <button
          onClick={handleShare}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-6 py-3 bg-stone-700 hover:bg-stone-600 text-stone-100 rounded-xl transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          分享
        </button>
      </div>
    </div>
  );
}
