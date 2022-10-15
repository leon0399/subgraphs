import { AccountBalance } from "../../generated/schema"
import { BIGINT_ZERO } from "./constants"

export function getAccountBalanceId(accountId: string, collectionId: string): string {
  return `${accountId}/${collectionId}`
}

export function createAccountBalance(accountId: string, collectionId: string): AccountBalance {
  const balanceId = getAccountBalanceId(accountId, collectionId);
  const acountBalance = new AccountBalance(balanceId);

  acountBalance.account = accountId;
  acountBalance.collection = collectionId;
  acountBalance.tokenCount = BIGINT_ZERO;

  return acountBalance;
}

export function getOrCreateAccountBalance(accountId: string, collectionId: string): AccountBalance {
  const balanceId = getAccountBalanceId(accountId, collectionId);

  let balance = AccountBalance.load(balanceId)
  if (balance != null) {
    return balance as AccountBalance
  }

  return createAccountBalance(accountId, collectionId)
}