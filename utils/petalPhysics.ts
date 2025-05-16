import { Vector3, PetalData, CommunityAction, PetalAnimationConfig } from '../types/petals';

export function updatePetalPosition(
  petal: PetalData,
  config: PetalAnimationConfig,
  deltaTime: number,
  communityActions: CommunityAction[]
): PetalData {
  const newPosition = { ...petal.position };
  const newVelocity = { ...petal.velocity };
  const newRotation = { ...petal.rotation };

  // Apply swirling motion
  const swirlAngle = Math.atan2(newPosition.x, newPosition.z);
  const swirlForce = {
    x: Math.cos(swirlAngle) * config.swirlSpeed,
    y: 0,
    z: Math.sin(swirlAngle) * config.swirlSpeed,
  };

  // Apply lift force
  newVelocity.y += config.liftForce * deltaTime;

  // Apply gravity
  newVelocity.y -= config.gravity * deltaTime;

  // Apply wind force
  newVelocity.x += config.windForce.x * deltaTime;
  newVelocity.y += config.windForce.y * deltaTime;
  newVelocity.z += config.windForce.z * deltaTime;

  // Apply turbulence
  newVelocity.x += (Math.random() - 0.5) * config.turbulence * deltaTime;
  newVelocity.y += (Math.random() - 0.5) * config.turbulence * deltaTime;
  newVelocity.z += (Math.random() - 0.5) * config.turbulence * deltaTime;

  // Apply community action influences
  communityActions.forEach(action => {
    const distance = calculateDistance(petal.position, action.position);
    if (distance < config.interactionRadius) {
      const influence = (1 - distance / config.interactionRadius) * action.intensity;
      const actionForce = getActionForce(action.type);
      
      newVelocity.x += actionForce.x * influence * deltaTime;
      newVelocity.y += actionForce.y * influence * deltaTime;
      newVelocity.z += actionForce.z * influence * deltaTime;
    }
  });

  // Update position based on velocity
  newPosition.x += newVelocity.x * deltaTime;
  newPosition.y += newVelocity.y * deltaTime;
  newPosition.z += newVelocity.z * deltaTime;

  // Update rotation
  newRotation.x += newVelocity.x * 50 * deltaTime;
  newRotation.y += newVelocity.y * 50 * deltaTime;
  newRotation.z += newVelocity.z * 50 * deltaTime;

  // Apply damping to velocity
  const damping = 0.98;
  newVelocity.x *= damping;
  newVelocity.y *= damping;
  newVelocity.z *= damping;

  return {
    ...petal,
    position: newPosition,
    velocity: newVelocity,
    rotation: newRotation,
  };
}

function calculateDistance(pos1: Vector3, pos2: Vector3): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  const dz = pos2.z - pos1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function getActionForce(type: string): Vector3 {
  switch (type) {
    case 'uplift':
      return { x: 0, y: 0.5, z: 0 };
    case 'support':
      return { x: 0.2, y: 0.3, z: 0.2 };
    case 'heal':
      return { x: 0, y: 0.4, z: 0.1 };
    case 'grow':
      return { x: 0.1, y: 0.6, z: 0.1 };
    case 'connect':
      return { x: 0.3, y: 0.2, z: 0.3 };
    default:
      return { x: 0, y: 0, z: 0 };
  }
}

export const defaultPetalConfig: PetalAnimationConfig = {
  swirlSpeed: 0.5,
  liftForce: 0.2,
  turbulence: 0.1,
  gravity: 0.1,
  windForce: { x: 0.1, y: 0, z: 0.1 },
  interactionRadius: 2.0,
}; 