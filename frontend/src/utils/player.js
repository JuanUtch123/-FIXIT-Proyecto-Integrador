export const playerLevel = (score = 0) => Math.floor(score / 1000) + 1;
export const levelPercent = (score = 0) => score % 1000 / 10;
export const formatTime = (seconds = 0) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours ? `${hours}h ${minutes ? `${minutes}m` : ""}`.trim() : `${minutes}m`;
};
