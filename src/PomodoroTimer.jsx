import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "../components/ui/card";
import { Button } from '@/components/ui/button';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState('');

  // 背景画像のファイル選択用
  const fileInputRef = useRef(null);

  // 音声ファイルのファイル選択用
  const audioInputRef = useRef(null);

  // デフォルトは public/beep.mp3 を鳴らす。自分で音を選んだら上書き。
  const beepRef = useRef(typeof Audio !== 'undefined' ? new Audio('/beep.mp3') : null);

  // 時間を mm:ss に整形する関数
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // タイマー処理
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // 時間がきたら音を鳴らす
      if (beepRef.current) {
        beepRef.current.currentTime = 0;
        beepRef.current.play();
      }
      alert('ポモドーロ完了！おつかれさま！');
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    // 再生中の音があれば停止して巻き戻し
    if (beepRef.current && !beepRef.current.paused) {
      beepRef.current.pause();
      beepRef.current.currentTime = 0;
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  // 背景画像選択ダイアログを開く
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 音声ファイル選択ダイアログを開く
  const openAudioDialog = () => {
    if (audioInputRef.current) {
      audioInputRef.current.click();
    }
  };

  // 選択した背景画像を反映
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 選択した音声ファイルを反映
  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // 新しくAudioを作ってbeepRefに格納
        beepRef.current = new Audio(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.5s ease-in-out',
      }}
    >
      <Card className="w-96 h-auto p-6 bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl">
        <CardContent>
          <motion.h1
            className="text-xl font-bold mb-4 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            ポモドーロタイマー
          </motion.h1>

          <motion.div
            className="text-3xl font-mono text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {formatTime(timeLeft)}
          </motion.div>

          <div className="flex justify-center gap-2 mb-4">
            <Button onClick={handleStart} className="rounded-2xl">スタート</Button>
            <Button onClick={handlePause} className="rounded-2xl">ストップ</Button>
            <Button onClick={handleReset} className="rounded-2xl">リセット</Button>
          </div>

          <div className="flex flex-col gap-2 items-center mb-4">
            <div className="flex gap-2">
              <Button onClick={openFileDialog} className="rounded-2xl">背景画像</Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <Button onClick={openAudioDialog} className="rounded-2xl">音声ファイル</Button>
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={handleAudioChange}
              />
            </div>
            <p className="text-center text-sm">好きな画像 & 音を選んでやる気アップ！</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
