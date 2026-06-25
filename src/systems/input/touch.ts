// Shared virtual D-pad state, written by the on-screen TouchControls and read by the
// world scene each frame (OR-ed with the keyboard). Action is delivered via the bus.
export const touch = { up: false, down: false, left: false, right: false };

export function resetTouch(): void {
  touch.up = touch.down = touch.left = touch.right = false;
}
