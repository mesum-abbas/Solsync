export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface PetalData {
  id: string;
  color: string;
  size: number;
  position: Vector3;
  rotation: Vector3;
  velocity: Vector3;
  createdAt: string;
}

export type ActionType = 
  | 'uplift'    // Positive community action
  | 'support'   // Supporting others
  | 'heal'      // Healing action
  | 'grow'      // Growth action
  | 'connect';  // Connection action

export interface CommunityAction {
  id: string;
  type: ActionType;
  position: Vector3;
  intensity: number;  // 0-1 scale of action impact
  timestamp: string;
  userId: string;
}

export interface PetalSystemState {
  petals: PetalData[];
  communityActions: CommunityAction[];
  lastUpdated: string;
}

export interface PetalAnimationConfig {
  swirlSpeed: number;      // Speed of the swirling motion
  liftForce: number;       // Upward force on petals
  turbulence: number;      // Random movement factor
  gravity: number;         // Downward force
  windForce: Vector3;      // Directional wind effect
  interactionRadius: number; // How far community actions affect petals
} 