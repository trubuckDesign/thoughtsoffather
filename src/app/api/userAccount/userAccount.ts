import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

export const findUserAccountById = async (userId: string, prisma: PrismaClient) => {
  // Existing code to fetch userAccount
  //console.log("0-userId:", userId);
  const userAccountRelation = await prisma.userAccount.findFirst({
    where: {
      users: { id: userId },
    },
    select: {
      userAcctId: true,
    },
  });
  //console.log("1userAcctRelation:", userAccountRelation, "userId:", userId);
  if (!userAccountRelation) {
    return null;
  }

  const userAcctId = userAccountRelation.userAcctId;
  //console.log("userAcctId findUnique 1");
  let userAccount = await prisma.userAccount.findUnique({
    where: { userAcctId: userAcctId },
  });

  return userAccount;
};
