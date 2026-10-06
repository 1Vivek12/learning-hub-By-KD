import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LiveClass, LiveChatMessage } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { useSession } from 'next-auth/react';
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  ScreenShare,
  Hand,
  MessageSquare,
  Users,
  PhoneOff,
  Copy,
  Check,
  Send,
  Shield,
  Volume2,
  Loader2,
  AlertCircle,
  WifiOff,
} from 'lucide-react';

interface VirtualClassroomProps {
  liveClass: LiveClass;
  // Legacy props retained for backward compatibility with parent renderers
  initialStream?: MediaStream | null;
  initialMuted?: boolean;
  initialCameraOff?: boolean;
  onLeaveRoom: () => void;
}

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error';

interface RealParticipant {
  identity: string;
  name: string;
  isSpeaking: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isLocal: boolean;
  videoTrack?: any;
  audioTrack?: any;
}

export const VirtualClassroom: React.FC<VirtualClassroomProps> = ({
  liveClass,
  onLeaveRoom,
}) => {
  const { t, l } = useLanguage();
  const { data: session } = useSession();
  const user = session?.user as any;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  // Connection state
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // LiveKit room reference
  const roomRef = useRef<any>(null);

  // Local controls
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Chat & sidebar
  const [activeSidebarTab, setActiveSidebarTab] = useState<'chat' | 'participants' | null>('chat');
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Participants from LiveKit
  const [participants, setParticipants] = useState<RealParticipant[]>([]);

  // Video refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const stageVideoRef = useRef<HTMLVideoElement>(null);

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeSidebarTab]);

  // Connect to LiveKit room
  const connectToRoom = useCallback(async () => {
    setConnectionState('connecting');
    setErrorMessage(null);

    try {
      // 1. Request token from authorized backend
      const tokenRes = await fetch(`/api/live-classes/${(liveClass as any).id}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!tokenRes.ok) {
        const errData = await tokenRes.json().catch(() => ({}));
        throw new Error(errData.error || `Authorization failed (${tokenRes.status})`);
      }

      const { token, roomUrl } = await tokenRes.json();

      if (!token || !roomUrl) {
        throw new Error('Invalid server response: missing token or room URL');
      }

      // 2. Dynamically import LiveKit to avoid SSR issues
      const { Room, RoomEvent, Track } = await import('livekit-client');

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      roomRef.current = room;

      // 3. Set up event listeners
      room.on(RoomEvent.Connected, () => {
        setConnectionState('connected');
        syncParticipants(room);
      });

      room.on(RoomEvent.Reconnecting, () => {
        setConnectionState('reconnecting');
      });

      room.on(RoomEvent.Reconnected, () => {
        setConnectionState('connected');
      });

      room.on(RoomEvent.Disconnected, () => {
        setConnectionState('disconnected');
      });

      room.on(RoomEvent.ParticipantConnected, () => syncParticipants(room));
      room.on(RoomEvent.ParticipantDisconnected, () => syncParticipants(room));
      room.on(RoomEvent.TrackSubscribed, () => syncParticipants(room));
      room.on(RoomEvent.TrackUnsubscribed, () => syncParticipants(room));
      room.on(RoomEvent.TrackMuted, () => syncParticipants(room));
      room.on(RoomEvent.TrackUnmuted, () => syncParticipants(room));
      room.on(RoomEvent.ActiveSpeakersChanged, (speakers: any[]) => {
        setParticipants(prev => prev.map(p => ({
          ...p,
          isSpeaking: speakers.some(s => s.identity === p.identity),
        })));
      });

      // Data channel for chat
      room.on(RoomEvent.DataReceived, (payload: Uint8Array, participant: any) => {
        try {
          const decoded = new TextDecoder().decode(payload);
          const msg = JSON.parse(decoded);
          if (msg.type === 'chat') {
            setChatMessages(prev => [...prev, {
              id: `msg-${Date.now()}-${Math.random()}`,
              senderId: participant?.identity || 'unknown',
              senderName: participant?.name || 'Unknown',
              isInstructor: false,
              message: msg.text,
              timestamp: 'Just now',
            }]);
          }
        } catch { /* ignore non-chat data */ }
      });

      // 4. Connect
      await room.connect(roomUrl, token);

      // 5. Enable local tracks based on server-granted permissions
      try {
        await room.localParticipant.enableCameraAndMicrophone();
      } catch {
        // Student may not have publish permission — that's expected
        try {
          await room.localParticipant.setMicrophoneEnabled(true);
        } catch { /* no mic permission either */ }
      }

      syncParticipants(room);

    } catch (err: any) {
      console.error('LiveKit connection error:', err);
      setConnectionState('error');
      setErrorMessage(err.message || 'Failed to connect to classroom');
    }
  }, [liveClass]);

  // Build participant list from LiveKit room state
  const syncParticipants = (room: any) => {
    const allParticipants: RealParticipant[] = [];

    // Local participant
    const local = room.localParticipant;
    if (local) {
      const localVideoPub = local.getTrackPublication('camera');
      const localAudioPub = local.getTrackPublication('microphone');
      allParticipants.push({
        identity: local.identity,
        name: local.name || local.identity,
        isSpeaking: local.isSpeaking || false,
        isMuted: localAudioPub ? localAudioPub.isMuted : true,
        isCameraOff: !localVideoPub || localVideoPub.isMuted,
        isLocal: true,
        videoTrack: localVideoPub?.track,
        audioTrack: localAudioPub?.track,
      });

      // Attach local video
      if (localVideoRef.current && localVideoPub?.track) {
        localVideoPub.track.attach(localVideoRef.current);
      }
    }

    // Remote participants
    room.remoteParticipants.forEach((rp: any) => {
      const videoPublication = rp.getTrackPublication('camera') || rp.getTrackPublication('screen_share');
      const audioPublication = rp.getTrackPublication('microphone');
      allParticipants.push({
        identity: rp.identity,
        name: rp.name || rp.identity,
        isSpeaking: rp.isSpeaking || false,
        isMuted: audioPublication ? audioPublication.isMuted : true,
        isCameraOff: !videoPublication || videoPublication.isMuted,
        isLocal: false,
        videoTrack: videoPublication?.track,
        audioTrack: audioPublication?.track,
      });
    });

    setParticipants(allParticipants);

    // Attach first remote video to stage
    const remoteWithVideo = allParticipants.find(p => !p.isLocal && p.videoTrack);
    if (stageVideoRef.current && remoteWithVideo?.videoTrack) {
      remoteWithVideo.videoTrack.attach(stageVideoRef.current);
    }
  };

  // Connect on mount
  useEffect(() => {
    connectToRoom();
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
    };
  }, [connectToRoom]);

  // Toggle controls
  const handleToggleMic = async () => {
    if (!roomRef.current) return;
    const newState = !isMuted;
    try {
      await roomRef.current.localParticipant.setMicrophoneEnabled(!newState);
      setIsMuted(newState);
    } catch { /* permission denied */ }
  };

  const handleToggleCamera = async () => {
    if (!roomRef.current) return;
    const newState = !isCameraOff;
    try {
      await roomRef.current.localParticipant.setCameraEnabled(!newState);
      setIsCameraOff(newState);
    } catch { /* permission denied */ }
  };

  const handleToggleScreenShare = async () => {
    if (!roomRef.current) return;
    try {
      if (isScreenSharing) {
        await roomRef.current.localParticipant.setScreenShareEnabled(false);
        setIsScreenSharing(false);
      } else {
        await roomRef.current.localParticipant.setScreenShareEnabled(true);
        setIsScreenSharing(true);
      }
    } catch { /* cancelled or not allowed */ }
  };

  const handleToggleHand = () => {
    setIsHandRaised(!isHandRaised);
    // Optionally send hand-raise state via data channel
    if (roomRef.current) {
      const data = new TextEncoder().encode(JSON.stringify({
        type: 'hand_raise',
        raised: !isHandRaised,
      }));
      roomRef.current.localParticipant.publishData(data, { reliable: true });
    }
  };

  const handleCopyJoinLink = () => {
    const fullUrl = `${window.location.origin}/live/${liveClass.roomId}`;
    navigator.clipboard?.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !roomRef.current) return;

    const text = chatInput.trim();
    const data = new TextEncoder().encode(JSON.stringify({ type: 'chat', text }));
    roomRef.current.localParticipant.publishData(data, { reliable: true });

    // Add to local chat immediately
    setChatMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      senderId: user?.id || 'self',
      senderName: user?.name || 'You',
      isInstructor: isAdmin,
      message: text,
      timestamp: 'Just now',
    }]);
    setChatInput('');
  };

  const handleLeave = () => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    onLeaveRoom();
  };

  // Render loading/error/reconnecting states
  if (connectionState === 'idle' || connectionState === 'connecting') {
    return (
      <div className="fixed inset-0 z-50 bg-[#070b14] text-slate-100 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
        <p className="text-sm text-slate-400">Connecting to classroom…</p>
      </div>
    );
  }

  if (connectionState === 'error') {
    return (
      <div className="fixed inset-0 z-50 bg-[#070b14] text-slate-100 flex flex-col items-center justify-center gap-4 px-6">
        <AlertCircle className="w-12 h-12 text-rose-400" />
        <h2 className="text-xl font-bold text-white">Connection Failed</h2>
        <p className="text-sm text-slate-400 max-w-md text-center">{errorMessage}</p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={connectToRoom}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-bold transition-colors"
          >
            Retry
          </button>
          <button
            onClick={onLeaveRoom}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold border border-white/10 transition-colors"
          >
            Leave
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#070b14] text-slate-100 flex flex-col select-none overflow-hidden">
      {/* Reconnecting banner */}
      {connectionState === 'reconnecting' && (
        <div className="absolute top-16 left-0 right-0 z-30 flex items-center justify-center gap-2 py-2 bg-amber-500/90 text-slate-950 text-xs font-bold">
          <WifiOff className="w-4 h-4" />
          Reconnecting to classroom…
        </div>
      )}

      {/* Top Bar */}
      <div className="h-16 px-4 sm:px-6 border-b border-white/10 bg-[#0b0f19] flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>LIVE SESSION</span>
          </div>
          <h2 className="text-sm font-bold text-white truncate max-w-sm sm:max-w-md">
            {l((liveClass as any).title || (liveClass as any).titleEn || '')}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyJoinLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-all"
            title="Copy join link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <span className="hidden md:inline-block text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-white/5">
            {participants.length} connected
          </span>
        </div>
      </div>

      {/* Center Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Stage & Participant Grid */}
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
          {/* Main Stage */}
          <div className="relative flex-1 min-h-[360px] rounded-2xl overflow-hidden bg-slate-950 border border-white/10 flex items-center justify-center shadow-2xl">
            {isScreenSharing ? (
              <video
                ref={stageVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            ) : participants.find(p => !p.isLocal && p.videoTrack) ? (
              <video
                ref={stageVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40">
                <div className="relative flex flex-col items-center gap-3">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-slate-800 flex items-center justify-center border-2 border-sky-400 shadow-2xl shadow-sky-500/20">
                    <span className="text-4xl font-bold text-white">
                      {participants.find(p => !p.isLocal)?.name?.slice(0, 2).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-base font-bold text-white">{participants.find(p => !p.isLocal)?.name || 'Waiting for instructor…'}</h3>
                  </div>
                </div>

                {/* Active speaker indicator */}
                {participants.some(p => !p.isLocal && p.isSpeaking) && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
                    <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-slate-200">Audio Active</span>
                    <div className="flex items-center gap-0.5 h-3 ml-2">
                      <div className="w-1 bg-emerald-400 rounded-full h-full animate-bounce" />
                      <div className="w-1 bg-emerald-400 rounded-full h-2/3 animate-bounce delay-75" />
                      <div className="w-1 bg-emerald-400 rounded-full h-4/5 animate-bounce delay-150" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Participant Mini-Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 h-32">
            {/* Self Video */}
            <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-sky-500/40 shadow-md">
              {isCameraOff ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                    {(user?.name || 'U').slice(0, 2).toUpperCase()}
                  </div>
                </div>
              ) : (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              )}
              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[11px] px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white">
                <span className="truncate">You</span>
                <div className="flex items-center gap-1">
                  {isHandRaised && <span className="text-amber-400">✋</span>}
                  {isMuted ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                </div>
              </div>
            </div>

            {/* Remote Peers */}
            {participants
              .filter(p => !p.isLocal)
              .slice(0, 4)
              .map(p => (
                <div
                  key={p.identity}
                  className={`relative rounded-xl overflow-hidden bg-slate-900 border shadow-sm flex items-center justify-center ${
                    p.isSpeaking ? 'border-emerald-400/60' : 'border-white/10'
                  }`}
                >
                  {p.isCameraOff ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                    </div>
                  ) : (
                    <video autoPlay playsInline className="w-full h-full object-cover opacity-90" ref={el => {
                      if (el && p.videoTrack) {
                        p.videoTrack.attach(el);
                      }
                    }} />
                  )}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[11px] px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white">
                    <span className="truncate">{p.name.split(' ')[0]}</span>
                    <div className="flex items-center gap-1">
                      {p.isMuted ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right Sidebar */}
        {activeSidebarTab && (
          <div className="w-80 border-l border-white/10 bg-[#0d1322] flex flex-col">
            <div className="flex items-center border-b border-white/10">
              <button
                onClick={() => setActiveSidebarTab('chat')}
                className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                  activeSidebarTab === 'chat'
                    ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('participants')}
                className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                  activeSidebarTab === 'participants'
                    ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Participants ({participants.length})</span>
              </button>
            </div>

            {/* Chat Tab */}
            {activeSidebarTab === 'chat' && (
              <div className="flex-1 flex flex-col p-3 overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {chatMessages.length === 0 && (
                    <p className="text-xs text-slate-500 text-center pt-8">No messages yet. Say hello! 👋</p>
                  )}
                  {chatMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-xl text-xs space-y-1 ${
                        msg.senderId === (user?.id || 'self')
                          ? 'bg-sky-500/15 border border-sky-500/20 text-slate-200 ml-4'
                          : msg.isInstructor
                          ? 'bg-amber-500/10 border border-amber-500/20 text-slate-200 mr-2'
                          : 'bg-slate-900 border border-white/5 text-slate-300 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-sky-400 flex items-center gap-1">
                          {msg.senderName}
                          {msg.isInstructor && (
                            <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300">Host</span>
                          )}
                        </span>
                        <span className="text-slate-500 font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{msg.message}</p>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/10 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Participants Tab */}
            {activeSidebarTab === 'participants' && (
              <div className="flex-1 p-3 overflow-y-auto space-y-2">
                {participants.map(p => (
                  <div
                    key={p.identity}
                    className={`flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border text-xs ${
                      p.isSpeaking ? 'border-emerald-400/30' : 'border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                        p.isLocal ? 'bg-sky-600' : 'bg-slate-700'
                      }`}>
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200 flex items-center gap-1">
                          <span>{p.name}</span>
                          {p.isLocal && <span className="text-[10px] text-sky-400">(You)</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {p.isSpeaking && <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {p.isMuted ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                      {p.isCameraOff ? <CameraOff className="w-3 h-3 text-slate-500" /> : <Camera className="w-3 h-3 text-slate-400" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="h-20 px-6 bg-[#0b0f19] border-t border-white/10 flex items-center justify-between z-20">
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${connectionState === 'connected' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            {connectionState === 'connected' ? 'LiveKit Connected' : connectionState === 'reconnecting' ? 'Reconnecting…' : 'Disconnected'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMic}
            className={`p-3.5 rounded-full transition-all shadow-lg focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none ${
              isMuted ? 'bg-rose-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleToggleCamera}
            className={`p-3.5 rounded-full transition-all shadow-lg focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none ${
              isCameraOff ? 'bg-rose-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10'
            }`}
            title={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
            aria-label={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isCameraOff ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
          </button>

          <button
            onClick={handleToggleScreenShare}
            className={`p-3.5 rounded-full transition-all shadow-lg focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none ${
              isScreenSharing ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10'
            }`}
            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
            aria-label={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          >
            <ScreenShare className="w-5 h-5" />
          </button>

          <button
            onClick={handleToggleHand}
            className={`p-3.5 rounded-full transition-all shadow-lg focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none ${
              isHandRaised ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10'
            }`}
            title={isHandRaised ? 'Lower hand' : 'Raise hand'}
            aria-label={isHandRaised ? 'Lower hand' : 'Raise hand'}
          >
            <Hand className="w-5 h-5" />
          </button>

          <button
            onClick={handleLeave}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            aria-label="Leave Classroom"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSidebarTab(activeSidebarTab === 'chat' ? null : 'chat')}
            className={`p-3 rounded-xl border transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none ${
              activeSidebarTab === 'chat'
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-400'
                : 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Toggle Live Chat"
            aria-label="Toggle Live Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveSidebarTab(activeSidebarTab === 'participants' ? null : 'participants')}
            className={`p-3 rounded-xl border transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none ${
              activeSidebarTab === 'participants'
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-400'
                : 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Toggle Participants"
            aria-label="Toggle Participants"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
