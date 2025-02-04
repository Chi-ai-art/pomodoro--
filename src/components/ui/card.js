import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';  // ← ここも直す必要があるかも！
import { Card, CardContent } from "../components/ui/card";  // ✅ ここを修正！

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState('');
