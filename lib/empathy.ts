import { User, type IUser } from "./models/User";

type EmpathyState = {
  empathyScore: number;
  totalDemerits: number;
  isSuspended: boolean;
  suspendedAt?: Date;
};

/**
 * Ensure empathy-related defaults exist on the user document.
 * - empathyScore defaults to 100
 * - totalDemerits mirrors legacy demeritPoints and defaults to 0
 * - isSuspended defaults to false
 */
export async function ensureEmpathyDefaults(user: IUser | null): Promise<IUser | null> {
  if (!user) return null;

  let needsSave = false;
  if (user.empathyScore === undefined || user.empathyScore === null) {
    user.empathyScore = 100;
    needsSave = true;
  }
  if ((user as any).totalDemerits === undefined || (user as any).totalDemerits === null) {
    (user as any).totalDemerits = user.demeritPoints ?? 0;
    needsSave = true;
  }
  if (user.isSuspended === undefined) {
    user.isSuspended = false;
    needsSave = true;
  }
  if (needsSave) {
    await user.save();
  }
  return user;
}

/**
 * Apply a moderation violation to a user:
 * - Increment totalDemerits by `penalty` (default 15)
 * - Decrease empathyScore by the same penalty (clamped to 0)
 * - Suspend the user if empathyScore <= 35
 */
export async function applyEmpathyViolation(
  userId: string,
  penalty: number = 15
): Promise<EmpathyState> {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  await ensureEmpathyDefaults(user);

  const currentDemerits = (user as any).totalDemerits ?? user.demeritPoints ?? 0;
  const updatedDemerits = currentDemerits + penalty;
  const updatedEmpathy = Math.max(0, (user.empathyScore ?? 100) - penalty);
  const shouldSuspend = updatedEmpathy <= 35;

  const update: any = {
    empathyScore: updatedEmpathy,
    totalDemerits: updatedDemerits,
    demeritPoints: updatedDemerits, // keep legacy field in sync
  };

  if (shouldSuspend) {
    update.isSuspended = true;
    update.suspendedAt = user.suspendedAt ?? new Date();
  }

  await User.updateOne({ _id: userId }, update);

  return {
    empathyScore: updatedEmpathy,
    totalDemerits: updatedDemerits,
    isSuspended: shouldSuspend || user.isSuspended,
    suspendedAt: shouldSuspend ? update.suspendedAt : user.suspendedAt,
  };
}

/**
 * Normalize an arbitrary empathy score (0-1) into the 0-100 range.
 * Safeguards any upstream callers still returning fractional scores.
 */
export function normalizeScoreToPercent(score: number | undefined | null): number {
  if (score === undefined || score === null || Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(100, score <= 1 ? score * 100 : score));
}

