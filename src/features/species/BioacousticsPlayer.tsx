import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, Play, Pause, Radio, Activity, Waves, Gauge } from 'lucide-react';

interface BioacousticsPlayerProps {
  speciesId: string;
  speciesNameVi: string;
  speciesNameEn: string;
  scientificName: string;
  order?: string;
  family?: string;
  className?: string;
}

interface BioacousticProfile {
  callNameVi: string;
  callNameEn: string;
  fundamentalHz: number;
  peakDb: number;
  acousticRangeKm: number;
  purposeVi: string;
  purposeEn: string;
  soundType: 'infrasonic_roar' | 'pack_howl' | 'echolocation_sonar' | 'canopy_duet' | 'raptor_screech' | 'seismic_rumble' | 'amphibian_croak' | 'savanna_bellow';
}

function getBioacousticProfile(speciesId: string, order?: string, family?: string): BioacousticProfile {
  // 1. Big Cats (Panthera)
  if (speciesId.includes('tigris')) {
    return {
      callNameVi: 'Tiếng Gầm Sóng Hạ Âm Rền Vang (Infrasonic Roar)',
      callNameEn: 'Deep Infrasonic Territorial Roar',
      fundamentalHz: 18,
      peakDb: 114,
      acousticRangeKm: 3.5,
      purposeVi: 'Đe dọa lãnh thổ, làm tê liệt hệ thần kinh con mồi bằng sóng hạ âm xuyên thấu rừng rậm.',
      purposeEn: 'Territorial defense and hunting disorientation using penetrating low-frequency infrasound.',
      soundType: 'infrasonic_roar'
    };
  }
  if (speciesId.includes('leo')) {
    return {
      callNameVi: 'Tiếng Gầm Vương Quyền Xavan (Pride Roar)',
      callNameEn: 'Savanna Territorial Pride Roar',
      fundamentalHz: 35,
      peakDb: 114,
      acousticRangeKm: 8.0,
      purposeVi: 'Khẳng định chủ quyền lãnh thổ bầy đàn, vang vọng khắp thảo nguyên xavan 8 km.',
      purposeEn: 'Consolidates pride territorial boundaries audible up to 8 kilometers away.',
      soundType: 'infrasonic_roar'
    };
  }
  // 2. Canids
  if (speciesId.includes('lupus') || speciesId.includes('cuon') || family === 'Canidae') {
    return {
      callNameVi: 'Tiếng Hú Bầy Đàn Hoàng Hôn (Pack Howl)',
      callNameEn: 'Resonant Pack Rally Howl',
      fundamentalHz: 280,
      peakDb: 95,
      acousticRangeKm: 12.0,
      purposeVi: 'Tập hợp bầy đàn chuẩn bị đi săn đêm và định vị vị trí các thành viên phân tán.',
      purposeEn: 'Long-distance acoustic beacon assembling pack members across vast territories.',
      soundType: 'pack_howl'
    };
  }
  // 3. Cetaceans
  if (order === 'Cetacea' || speciesId.includes('balaenoptera') || speciesId.includes('orcinus') || speciesId.includes('delphinus')) {
    return {
      callNameVi: 'Sóng Siêu Âm Định Vị & Xung Hạ Âm Đại Dương (Oceanic Sonar)',
      callNameEn: 'Echolocation Clicks & Infrasonic Pulses',
      fundamentalHz: 25,
      peakDb: 188,
      acousticRangeKm: 800.0,
      purposeVi: 'Liên lạc xuyên đại dương hàng trăm km và dựng bản đồ địa hình 3D đáy biển tối.',
      purposeEn: 'Trans-oceanic communication channel and high-resolution ultrasonic bathymetric navigation.',
      soundType: 'echolocation_sonar'
    };
  }
  // 4. Primates & Gibbons
  if (order === 'Primates' || speciesId.includes('nomascus') || speciesId.includes('pygathrix')) {
    return {
      callNameVi: 'Bản Hợp Xướng Song Ca Bình Minh (Morning Canopy Duet)',
      callNameEn: 'Dawn Synchronized Canopy Duet',
      fundamentalHz: 1250,
      peakDb: 88,
      acousticRangeKm: 3.0,
      purposeVi: 'Củng cố liên kết đôi một vợ một chồng và tuyên cáo chủ quyền tán rừng nhiệt đới.',
      purposeEn: 'Reinforces monogamous pair-bond fidelity and marks high canopy boundaries.',
      soundType: 'canopy_duet'
    };
  }
  // 5. Raptors
  if (order === 'Accipitriformes' || order === 'Falconiformes' || speciesId.includes('falco') || speciesId.includes('aquila')) {
    return {
      callNameVi: 'Tiếng Kêu Bổ Nhào Xé Gió (Hunting Stoop Screech)',
      callNameEn: 'High-Velocity Aerial Stoop Screech',
      fundamentalHz: 2400,
      peakDb: 92,
      acousticRangeKm: 2.0,
      purposeVi: 'Cảnh báo không phận và giao tiếp giữa cặp chim săn mồi khi đang bay lượn.',
      purposeEn: 'Airspace defense and mated aerial coordination during high-altitude patrol.',
      soundType: 'raptor_screech'
    };
  }
  // 6. Elephants
  if (order === 'Proboscidea' || speciesId.includes('elephas') || speciesId.includes('loxodonta')) {
    return {
      callNameVi: 'Sóng Hạ Âm Rung Chuyển Mặt Đất (Seismic Rumble)',
      callNameEn: 'Seismic Infrasonic Ground Rumble',
      fundamentalHz: 16,
      peakDb: 112,
      acousticRangeKm: 10.0,
      purposeVi: 'Giao tiếp bằng sóng rung truyền qua lòng đất cảm nhận bằng đệm bàn chân.',
      purposeEn: 'Generates subterranean seismic waves perceived through sensitive footpad mechanoreceptors.',
      soundType: 'seismic_rumble'
    };
  }
  // 7. Amphibians
  if (speciesId.includes('agalychnis') || speciesId.includes('rana') || speciesId.includes('bufo')) {
    return {
      callNameVi: 'Tiếng Kêu Gọi Bạn Tình Đêm Ẩm (Nocturnal Mating Chorus)',
      callNameEn: 'Nocturnal Wetland Mating Resonance',
      fundamentalHz: 450,
      peakDb: 78,
      acousticRangeKm: 0.5,
      purposeVi: 'Thu hút con cái về các vùng nước sinh sản vào mùa mưa nhiệt đới.',
      purposeEn: 'Courtship acoustic beacon advertising genetic vigor across nocturnal wetland pools.',
      soundType: 'amphibian_croak'
    };
  }
  // Default general wildlife
  return {
    callNameVi: 'Tín Hiệu Âm Học Dã Ngoại (Bioacoustic Telemetry Call)',
    callNameEn: 'Field Telemetry Bioacoustic Vocalization',
    fundamentalHz: 520,
    peakDb: 85,
    acousticRangeKm: 1.5,
    purposeVi: 'Giao tiếp sinh thái, phát tín hiệu nhận diện đồng loại và cảnh giác trước kẻ thù.',
    purposeEn: 'Ecological intraspecific communication and environmental vigilance signaling.',
    soundType: 'savanna_bellow'
  };
}

export const BioacousticsPlayer: React.FC<BioacousticsPlayerProps> = ({
  speciesId,
  speciesNameVi,
  speciesNameEn,
  scientificName,
  order,
  family,
  className = '',
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('en') ? 'en' : 'vi';

  const profile = getBioacousticProfile(speciesId, order, family);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Web Audio Engine
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const gain = ctx.createGain();
      const analyser = ctx.createAnalyser();

      analyser.fftSize = 128;
      gain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);

      gain.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      gainNodeRef.current = gain;
      analyserRef.current = analyser;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Synthesize species bioacoustic signature
  const playBioSound = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    const masterGain = gainNodeRef.current;
    if (!ctx || !masterGain) return;

    const t = ctx.currentTime;

    // Create tailored acoustic synthesizer per species type
    switch (profile.soundType) {
      case 'infrasonic_roar': {
        // Deep resonant tiger/lion roar with rumbling FM modulation
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const roarFilter = ctx.createBiquadFilter();
        const roarGain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(profile.fundamentalHz * 2.5, t);
        osc1.frequency.exponentialRampToValueAtTime(profile.fundamentalHz, t + 0.8);
        osc1.frequency.exponentialRampToValueAtTime(profile.fundamentalHz * 1.8, t + 1.8);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(profile.fundamentalHz * 1.2, t);
        osc2.frequency.linearRampToValueAtTime(profile.fundamentalHz * 0.8, t + 1.5);

        // LFO for throat roar raspiness
        lfo.frequency.setValueAtTime(28, t);
        lfoGain.gain.setValueAtTime(15, t);
        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);

        roarFilter.type = 'lowpass';
        roarFilter.frequency.setValueAtTime(450, t);
        roarFilter.frequency.exponentialRampToValueAtTime(120, t + 2.0);

        roarGain.gain.setValueAtTime(0.01, t);
        roarGain.gain.linearRampToValueAtTime(0.7, t + 0.3);
        roarGain.gain.exponentialRampToValueAtTime(0.001, t + 2.4);

        osc1.connect(roarFilter);
        osc2.connect(roarFilter);
        roarFilter.connect(roarGain);
        roarGain.connect(masterGain);

        osc1.start(t);
        osc2.start(t);
        lfo.start(t);
        osc1.stop(t + 2.5);
        osc2.stop(t + 2.5);
        lfo.stop(t + 2.5);
        break;
      }

      case 'pack_howl': {
        // Wolf / Canid howl with soaring harmonic glide
        const osc = ctx.createOscillator();
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        const howlGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(profile.fundamentalHz * 0.7, t);
        osc.frequency.exponentialRampToValueAtTime(profile.fundamentalHz * 1.6, t + 0.9);
        osc.frequency.exponentialRampToValueAtTime(profile.fundamentalHz, t + 2.6);

        vibrato.frequency.setValueAtTime(5.5, t);
        vibratoGain.gain.setValueAtTime(8, t);
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);

        howlGain.gain.setValueAtTime(0.01, t);
        howlGain.gain.linearRampToValueAtTime(0.6, t + 0.5);
        howlGain.gain.exponentialRampToValueAtTime(0.001, t + 2.8);

        osc.connect(howlGain);
        howlGain.connect(masterGain);

        osc.start(t);
        vibrato.start(t);
        osc.stop(t + 2.9);
        vibrato.stop(t + 2.9);
        break;
      }

      case 'echolocation_sonar': {
        // High-frequency sonar sweep & ocean whale pulse
        const osc = ctx.createOscillator();
        const pulseGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(profile.fundamentalHz * 1.5, t);
        osc.frequency.linearRampToValueAtTime(profile.fundamentalHz * 0.9, t + 1.2);
        osc.frequency.linearRampToValueAtTime(profile.fundamentalHz * 2.2, t + 2.4);

        pulseGain.gain.setValueAtTime(0.01, t);
        pulseGain.gain.linearRampToValueAtTime(0.5, t + 0.4);
        pulseGain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);

        osc.connect(pulseGain);
        pulseGain.connect(masterGain);

        osc.start(t);
        osc.stop(t + 2.6);
        break;
      }

      case 'raptor_screech': {
        // Piercing falcon/eagle stoop call
        const osc = ctx.createOscillator();
        const screechGain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(profile.fundamentalHz, t);
        osc.frequency.exponentialRampToValueAtTime(profile.fundamentalHz * 0.6, t + 1.2);

        screechGain.gain.setValueAtTime(0.01, t);
        screechGain.gain.linearRampToValueAtTime(0.4, t + 0.1);
        screechGain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);

        osc.connect(screechGain);
        screechGain.connect(masterGain);
        osc.start(t);
        osc.stop(t + 1.4);
        break;
      }

      default: {
        // Generic wildlife vocalization
        const osc = ctx.createOscillator();
        const genGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(profile.fundamentalHz, t);
        osc.frequency.linearRampToValueAtTime(profile.fundamentalHz * 1.3, t + 0.5);
        osc.frequency.linearRampToValueAtTime(profile.fundamentalHz * 0.8, t + 1.4);

        genGain.gain.setValueAtTime(0.01, t);
        genGain.gain.linearRampToValueAtTime(0.5, t + 0.2);
        genGain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);

        osc.connect(genGain);
        genGain.connect(masterGain);
        osc.start(t);
        osc.stop(t + 1.7);
        break;
      }
    }
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      playBioSound();
      // Auto toggle off after 3 seconds
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    } else {
      setIsPlaying(false);
    }
  };

  // Real-time Waveform Canvas Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localRunning = true;
    const bufferLength = 64;
    const dataArray = new Uint8Array(bufferLength);

    const renderWave = () => {
      if (!localRunning) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Dark oscilloscope background grid
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(234, 179, 8, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 14) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (isPlaying && analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);

        // Draw active spectrum bars
        const barWidth = (width / bufferLength) * 1.8;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * (height - 8);

          // NatGeo Yellow to Emerald gradient
          const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
          grad.addColorStop(0, '#eab308');
          grad.addColorStop(1, '#10b981');

          ctx.fillStyle = grad;
          ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);

          x += barWidth;
        }
      } else {
        // Idle baseline heartbeat radar wave
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.moveTo(0, height / 2);

        const time = Date.now() * 0.003;
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.04 + time) * 3;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      localRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className={`field-journal-card p-5 sm:p-6 bg-stone-900/90 border-natgeo-yellow/20 relative overflow-hidden ${className}`}>
      {/* Top Banner Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-natgeo-yellow/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black border border-natgeo-yellow/40 flex items-center justify-center text-natgeo-yellow shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-natgeo-yellow bg-natgeo-yellow/10 px-2 py-0.5 rounded border border-natgeo-yellow/30">
                BIOACOUSTIC SONOGRAM • V.{profile.fundamentalHz}HZ
              </span>
              <span className="text-xs font-mono text-stone-500">•</span>
              <span className="text-xs font-mono text-amber-400 font-bold">{profile.peakDb} dB SPL</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-serif text-white tracking-wide mt-0.5 flex items-center gap-2 flex-wrap">
              <span>{profile[currentLang === 'en' ? 'callNameEn' : 'callNameVi']}</span>
              <span className="text-xs font-serif italic text-stone-400 font-normal">
                ({scientificName} • {currentLang === 'en' ? speciesNameEn : speciesNameVi})
              </span>
            </h3>
          </div>
        </div>

        {/* Audio Play Trigger */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={handleTogglePlay}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-400 text-stone-950 shadow-glow font-extrabold scale-105'
                : 'bg-natgeo-yellow/15 text-natgeo-yellow border border-natgeo-yellow/50 hover:bg-natgeo-yellow/25'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? (currentLang === 'en' ? 'Transmitting...' : 'Đang Phát...') : (currentLang === 'en' ? 'Transmit Call' : 'Phát Tiếng Kêu')}</span>
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-xl border border-white/10 bg-stone-950 text-stone-300 hover:text-natgeo-yellow transition-all"
            title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Waveform & Sonogram Display */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Oscilloscope Canvas */}
        <div className="md:col-span-7 bg-stone-950 rounded-2xl p-2.5 border border-natgeo-yellow/20 relative shadow-inner">
          <canvas
            ref={canvasRef}
            width={400}
            height={85}
            className="w-full h-[85px] rounded-xl block"
          />
          <div className="absolute bottom-4 right-4 text-[9px] font-mono text-natgeo-yellow/70 tracking-widest uppercase bg-stone-900/80 px-1.5 py-0.5 rounded border border-natgeo-yellow/20">
            FFT OSCILLOSCOPE
          </div>
        </div>

        {/* Acoustic Telemetry Metrics */}
        <div className="md:col-span-5 grid grid-cols-2 gap-2.5 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-stone-950/80 border border-white/5">
            <span className="text-[10px] text-stone-500 uppercase block mb-0.5 flex items-center gap-1">
              <Activity className="w-3 h-3 text-natgeo-yellow" />
              <span>{currentLang === 'en' ? 'Fundamental (F0)' : 'Tần số cơ bản'}</span>
            </span>
            <span className="text-sm font-bold text-amber-300 font-mono">
              {profile.fundamentalHz} Hz
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-950/80 border border-white/5">
            <span className="text-[10px] text-stone-500 uppercase block mb-0.5 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-emerald-400" />
              <span>{currentLang === 'en' ? 'Max Intensity' : 'Cường độ đỉnh'}</span>
            </span>
            <span className="text-sm font-bold text-emerald-300 font-mono">
              {profile.peakDb} dB
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-950/80 border border-white/5 col-span-2">
            <span className="text-[10px] text-stone-500 uppercase block mb-0.5 flex items-center gap-1">
              <Waves className="w-3 h-3 text-sky-400" />
              <span>{currentLang === 'en' ? 'Acoustic Range' : 'Bán kính truyền âm'}</span>
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-sky-300 font-mono">
                ~{profile.acousticRangeKm} km
              </span>
              <span className="text-[10px] text-stone-400 italic font-serif">
                {currentLang === 'en' ? 'In natural habitat' : 'Trong sinh cảnh tự nhiên'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Acoustic Purpose Note */}
      <div className="mt-4 pt-3 border-t border-white/5 text-xs font-serif text-stone-300 leading-relaxed flex items-start gap-2.5">
        <span className="text-natgeo-yellow font-mono text-[10px] uppercase font-bold shrink-0 mt-0.5 px-1.5 py-0.5 rounded bg-natgeo-yellow/10 border border-natgeo-yellow/30">
          FUNCTION
        </span>
        <p>
          {profile[currentLang === 'en' ? 'purposeEn' : 'purposeVi']}
        </p>
      </div>
    </div>
  );
};
