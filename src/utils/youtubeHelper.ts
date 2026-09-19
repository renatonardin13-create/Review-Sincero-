/**
 * YouTube helper for White-Label VIP Members Area
 * Extracts video IDs and builds clean embed URLs avoiding distractions and branding
 */

export function extractYouTubeId(urlOrInput: string): string {
  if (!urlOrInput) return '';
  const trimmed = urlOrInput.trim();

  // If already a clean 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex patterns
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return '';
}

export function buildWhiteLabelEmbedUrl(videoId: string, autoplay: boolean = false): string {
  const cleanId = extractYouTubeId(videoId) || videoId;
  if (!cleanId) return '';

  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    modestbranding: '1',
    rel: '0',
    iv_load_policy: '3',
    playsinline: '1',
    fs: '1',
    enablejsapi: '1',
    controls: '1',
    disablekb: '0'
  });

  return `https://www.youtube-nocookie.com/embed/${cleanId}?${params.toString()}`;
}

export function getYouTubeThumbnail(videoId: string): string {
  const cleanId = extractYouTubeId(videoId) || videoId;
  if (!cleanId) {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
  }
  return `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`;
}
