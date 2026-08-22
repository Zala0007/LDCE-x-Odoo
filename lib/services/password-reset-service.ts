import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/services/password-service";

const TOKEN_LIFETIME_MS = 30 * 60 * 1000;

export function digestResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createPasswordResetToken(email: string) {
  const user = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return null;

  const token = randomBytes(32).toString("hex");
  await db.$transaction([
    db.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } }),
    db.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: digestResetToken(token),
        expiresAt: new Date(Date.now() + TOKEN_LIFETIME_MS),
      },
    }),
  ]);
  return token;
}

export async function consumePasswordResetToken(token: string, password: string) {
  const tokenHash = digestResetToken(token);
  return db.$transaction(async (tx) => {
    const record = await tx.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!record || record.usedAt || record.expiresAt <= new Date()) return false;

    await tx.user.update({
      where: { id: record.userId },
      data: { passwordHash: await hashPassword(password) },
    });
    await tx.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });
    await tx.session.deleteMany({ where: { userId: record.userId } });
    return true;
  });
}
