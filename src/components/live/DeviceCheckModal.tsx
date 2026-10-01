import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { LiveClassService, MediaDeviceState } from '@/services/liveClassService';
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Volume2,
  Settings2,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  X,
} from 'lucide-react';

interface DeviceCheckModalProps {
  roomTitle: string;
  onEnter: (stream: MediaStream | null, isMuted: boolean, isCameraOff: boolean) => void;
  onCancel: () => void;
}

export const DeviceCheckModal: React.FC<DeviceCheckModalProps> = ({
  roomTitle,
  onEnter,
  onCancel,
}) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [deviceState, setDeviceState] = useState<MediaDeviceState>({
    audioInputs: [],
    videoInputs: [],
    audioOutputs: [],
    selectedAudioInputId: '',
    selectedVideoInputId: '',
    selectedAudioOutputId: '',
  });

  // Initialize media permissions
  useEffect(() => {
    let stopVolumeMonitoring: (() => void) | null = null;

    async function initDevices() {
      const devices = await LiveClassService.getAvailableDevices();
      setDeviceState(devices);

      const res = await LiveClassService.requestMediaPermissions();
      if (res.error) {
        setError(res.error);
      } else if (res.stream) {
        setStream(res.stream);
        if (videoRef.current) {
          videoRef.current.srcObject = res.stream;
        }
        stopVolumeMonitoring = LiveClassService.startMicVolumeMonitoring(
          res.stream,
          (lvl) => setMicLevel(lvl)
        );
      }
    }

    initDevices();

    return () => {
      if (stopVolumeMonitoring) stopVolumeMonitoring();
    };
  }, []);

  // Update video element when stream or camera toggle changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = isCameraOff ? null : stream;
    }
  }, [stream, isCameraOff]);

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = isCameraOff;
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  const toggleMicrophone = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleDeviceChange = async (type: 'audio' | 'video', deviceId: string) => {
    if (type === 'audio') {
      setDeviceState((prev) => ({ ...prev, selectedAudioInputId: deviceId }));
      const res = await LiveClassService.requestMediaPermissions(
        deviceId,
        deviceState.selectedVideoInputId
      );
      if (res.stream) setStream(res.stream);
    } else {
      setDeviceState((prev) => ({ ...prev, selectedVideoInputId: deviceId }));
      const res = await LiveClassService.requestMediaPermissions(
        deviceState.selectedAudioInputId,
        deviceId
      );
      if (res.stream) setStream(res.stream);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-[#0e1424] shadow-2xl overflow-hidden text-slate-100 dark:bg-[#0e1424] dark:border-white/15 light:bg-white light:border-slate-200 light:text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 dark:border-white/10 light:border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
              WebRTC Audio & Video Setup
            </span>
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 mt-0.5 truncate max-w-sm">
              {roomTitle}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {error ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Camera or Microphone Permission Notice</span>
              </div>
              <p className="leading-relaxed">{error}</p>
              <p className="text-[11px] text-slate-400">
                You can still proceed and join in listen-and-chat only mode.
              </p>
            </div>
          ) : null}

          {/* Camera Stage Preview */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/10 flex items-center justify-center">
            {isCameraOff || !stream ? (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <CameraOff className="w-10 h-10 opacity-50" />
                <span className="text-xs">Camera is switched off</span>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            )}

            {/* In-Preview Floating Controls */}
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3">
              <button
                onClick={toggleMicrophone}
                className={`p-3 rounded-full backdrop-blur-md shadow-lg transition-all ${
                  isMuted
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleCamera}
                className={`p-3 rounded-full backdrop-blur-md shadow-lg transition-all ${
                  isCameraOff
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10'
                }`}
                title={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
              >
                {isCameraOff ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Real Mic Level Meter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                Microphone Input Level
              </span>
              <span className="font-mono text-[11px]">{isMuted ? 'Muted' : `${micLevel}%`}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 rounded-full transition-all duration-75"
                style={{ width: `${isMuted ? 0 : Math.min(100, micLevel * 1.5)}%` }}
              />
            </div>
          </div>

          {/* Device Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Microphone</label>
              <select
                value={deviceState.selectedAudioInputId}
                onChange={(e) => handleDeviceChange('audio', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-slate-900 text-slate-200 text-xs focus:outline-none focus:border-sky-400 dark:bg-slate-900 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
              >
                {deviceState.audioInputs.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Microphone ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Camera</label>
              <select
                value={deviceState.selectedVideoInputId}
                onChange={(e) => handleDeviceChange('video', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-slate-900 text-slate-200 text-xs focus:outline-none focus:border-sky-400 dark:bg-slate-900 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
              >
                {deviceState.videoInputs.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Camera ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => onEnter(stream, isMuted, isCameraOff)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 hover:opacity-95 shadow-md shadow-sky-500/20 transition-all active:scale-95"
          >
            <span>{t('live.enterRoom')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
