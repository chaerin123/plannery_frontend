/**
 * 그룹 관련 타입 정의
 */

export interface Group {
  id: string;
  name: string;
  color: string; // hex color code
}

export const GROUP_COLORS = [
  '#FF6B6B', // Red
  '#FF8E53', // Orange
  '#FFC93C', // Yellow
  '#6BCB77', // Green
  '#4D96FF', // Blue
  '#8D8DF5', // Purple (main)
  '#FF6B9D', // Pink
  '#C44569', // Dark Pink
  '#A8E6CF', // Light Green
  '#FFD93D', // Light Yellow
  '#95E1D3', // Turquoise
  '#F38181', // Coral
  '#AA96DA', // Lavender
  '#FCBAD3', // Light Pink
  '#FFD3A5', // Peach
  '#A8D8EA', // Sky Blue
  '#FFAAA5', // Salmon
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Gold
] as const;
