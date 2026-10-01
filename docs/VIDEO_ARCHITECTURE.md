# Secure Video Architecture

## Overview
Learning Hub relies on a robust `VideoProvider` abstraction to prevent tight coupling with a single video delivery network.

## Current Setup
- Abstraction: `src/lib/video/VideoProvider.ts`
- Currently configured with a `MockVideoProvider` for development. It mimics the token signing process without requiring active third-party cloud credentials.

## Video Playback Authorization
1. Client requests `GET /api/lessons/[lessonId]/playback`.
2. Server validates active course enrollment using `CourseAccessService`.
3. Server looks up `VideoAsset.providerRef`.
4. Server generates a short-lived cryptographic signed token (via `VideoProvider`).
5. Client uses the ephemeral URL to initiate stream playback.

## Security Rule
- Never expose the `providerRef` directly in a way that bypasses authentication.
- All public sample MP4s from prototyping phases must be systematically scrubbed from active production content, and development sample links marked clearly as development seeds.
