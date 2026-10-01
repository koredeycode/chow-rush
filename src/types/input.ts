export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  hop: boolean;
  horn: boolean;
  action: boolean;
}

export const EMPTY_INPUT: InputState = {
  left: false,
  right: false,
  up: false,
  down: false,
  hop: false,
  horn: false,
  action: false,
};
