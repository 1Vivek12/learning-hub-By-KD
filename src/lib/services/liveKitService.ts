import { AccessToken } from "livekit-server-sdk";

export class LiveKitService {
  /**
   * Generates a secure LiveKit token based on the user's role and class room.
   */
  static async generateToken(roomId: string, userId: string, userName: string, role: string): Promise<string> {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error("LiveKit configuration is missing on the server.");
    }

    const isInstructor = role === 'INSTRUCTOR' || role === 'ADMIN' || role === 'SUPER_ADMIN';

    const at = new AccessToken(apiKey, apiSecret, {
      identity: userId,
      name: userName,
    });

    // Determine room permissions based on Learning Hub RBAC
    at.addGrant({
      roomJoin: true,
      room: roomId,
      canPublish: isInstructor,     // Only instructors can publish AV by default
      canSubscribe: true,           // Everyone can subscribe
      canPublishData: true,         // Chat
      canUpdateOwnMetadata: true,
    });

    return await at.toJwt();
  }
}
