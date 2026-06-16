"use server";

type PlanCheck = {
  canAsk: boolean;
  reason?: string;
  plan?: {
    type?: string;
    questionsUsed?: number;
    questionLimit?: number;
  };
};

export async function checkCanAskQuestionAction(): Promise<PlanCheck> {
  return { canAsk: true };
}

export async function incrementQuestionCountAction(): Promise<void> {
  // Backend should track usage; no-op when plan API is unavailable.
}
