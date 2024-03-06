-- AlterTable
ALTER TABLE "UserToken" ALTER COLUMN "revoked" SET DEFAULT false,
ALTER COLUMN "revokedByIp" SET DEFAULT '',
ALTER COLUMN "replacedByToken" SET DEFAULT '';
