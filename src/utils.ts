export const isMobileDevice = (() => {
  if (typeof navigator === "undefined") return false;

  // ✅ userAgentData가 존재하는 최신 브라우저
  const uaData = (navigator as any).userAgentData;
  if (uaData && uaData.mobile !== undefined) {
    return uaData.mobile;
  }

  // ✅ 구형 브라우저 fallback
  const ua = navigator.userAgent.toLowerCase();
  return /android|iphone|ipad|ipod|mobile|blackberry|opera mini|iemobile/.test(
    ua
  );
})();
