/**
 * Frontend LiveClassService
 * 
 * This service previously contained mock WebRTC participants and fake chat messages.
 * All mock logic has been removed in Phase 6C.
 * 
 * The VirtualClassroom component now connects directly to LiveKit via
 * POST /api/live-classes/[id]/token for real WebRTC.
 * 
 * This file is retained for any utility methods that may be needed
 * by other parts of the frontend (e.g., pre-join device enumeration).
 */

export interface MediaDeviceState {
  audioInputs: MediaDeviceInfo[];
  videoInputs: MediaDeviceInfo[];
  audioOutputs: MediaDeviceInfo[];
  selectedAudioInputId: string;
  selectedVideoInputId: string;
  selectedAudioOutputId: string;
}

export class LiveClassService {
  // Get available devices for pre-join device selection
  static async getAvailableDevices(): Promise<MediaDeviceState> {
    const defaultState: MediaDeviceState = {
      audioInputs: [],
      videoInputs: [],
      audioOutputs: [],
      selectedAudioInputId: '',
      selectedVideoInputId: '',
      selectedAudioOutputId: '',
    };

    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return defaultState;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter((d) => d.kind === 'audioinput');
      const videoInputs = devices.filter((d) => d.kind === 'videoinput');
      const audioOutputs = devices.filter((d) => d.kind === 'audiooutput');

      return {
        audioInputs,
        videoInputs,
        audioOutputs,
        selectedAudioInputId: audioInputs[0]?.deviceId || '',
        selectedVideoInputId: videoInputs[0]?.deviceId || '',
        selectedAudioOutputId: audioOutputs[0]?.deviceId || '',
      };
    } catch (e) {
      console.error('Error enumerating devices', e);
      return defaultState;
    }
  }

  static async requestMediaPermissions(audioId?: string, videoId?: string): Promise<{ stream?: MediaStream, error?: string }> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioId ? { deviceId: { exact: audioId } } : true,
        video: videoId ? { deviceId: { exact: videoId } } : true,
      });
      return { stream };
    } catch (err: any) {
      return { error: err.message || "Failed to get media permissions" };
    }
  }

  static startMicVolumeMonitoring(stream: MediaStream, onVolume: (level: number) => void): () => void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyzer = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
  
      analyzer.smoothingTimeConstant = 0.8;
      analyzer.fftSize = 1024;
  
      microphone.connect(analyzer);
      analyzer.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);
  
      javascriptNode.onaudioprocess = () => {
        const array = new Uint8Array(analyzer.frequencyBinCount);
        analyzer.getByteFrequencyData(array);
        let values = 0;
        const length = array.length;
        for (let i = 0; i < length; i++) {
          values += (array[i]);
        }
        const average = values / length;
        onVolume(Math.round(average));
      };
      
      return () => {
        javascriptNode.disconnect();
        analyzer.disconnect();
        microphone.disconnect();
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
      };
    } catch (e) {
      console.error(e);
      return () => {};
    }
  }
}
