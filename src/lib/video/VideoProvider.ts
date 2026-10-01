export interface PlaybackInfo {
  token: string;
  url: string;
  expiresAt: Date;
  provider: string;
}

export interface VideoProvider {
  /**
   * Generates a short-lived playback authorization token/URL
   */
  getPlaybackAccess(providerRef: string, userId: string): Promise<PlaybackInfo>;
  
  /**
   * Abstract creation of asset
   */
  createAsset(fileUrl: string): Promise<{ id: string; status: string }>;
  
  /**
   * Fetch current status of processing asset
   */
  getAssetStatus(providerRef: string): Promise<string>;
  
  /**
   * Delete video asset from provider
   */
  deleteAsset(providerRef: string): Promise<void>;
}

export class MockVideoProvider implements VideoProvider {
  async getPlaybackAccess(providerRef: string, userId: string): Promise<PlaybackInfo> {
    // Generates a mock signed URL for development
    // DO NOT USE in production for secure content
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    return {
      token: `mock_jwt_token_${userId}_${Date.now()}`,
      url: `https://mock-provider.com/stream/${providerRef}?token=mock`,
      expiresAt,
      provider: 'MOCK_PROVIDER',
    };
  }

  async createAsset(fileUrl: string): Promise<{ id: string; status: string }> {
    return { id: `mock_asset_${Date.now()}`, status: "ready" };
  }

  async getAssetStatus(providerRef: string): Promise<string> {
    return "ready";
  }

  async deleteAsset(providerRef: string): Promise<void> {
    console.log(`Deleted asset ${providerRef}`);
  }
}

// Factory to get configured provider
export function getVideoProvider(): VideoProvider {
  // In future, if process.env.VIDEO_PROVIDER === 'MUX', return new MuxProvider()
  return new MockVideoProvider();
}
