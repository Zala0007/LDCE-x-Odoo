export type ActionState = {
  message?: string;
  success?: boolean;
  fieldErrors?: Record<string, string[]>;
  resetPath?: string;
};

export const initialActionState: ActionState = {};
