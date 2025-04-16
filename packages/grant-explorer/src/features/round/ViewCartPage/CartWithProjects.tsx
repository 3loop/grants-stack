import {
  getVotingTokenOptions,
  GroupedCartProjectsByRoundId,
} from "../../api/utils";
import React, { useEffect, useState } from "react";
import { PayoutTokenDropdown } from "./PayoutTokenDropdown";
import { ApplyTooltip } from "./ApplyTooltip";
import { RoundInCart } from "./RoundInCart";
import { useTokenPrice, TToken, stringToBlobUrl, getChainById } from "common";
import { Button, Input } from "common/src/styles";
import { useCartStorage } from "../../../store";
import {
  ArrowRightIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { ChainBalances } from "../../api/types";

type Props = {
  cart: GroupedCartProjectsByRoundId;
  chainId: number;
  totalAmount: number;
  balances: ChainBalances;
  payoutToken: TToken;
  enoughBalance: boolean;
  handleSwap: () => void;
};

export function CartWithProjects({
  cart,
  chainId,
  totalAmount,
  balances,
  payoutToken,
  enoughBalance,
  handleSwap,
}: Props) {
  const chain = getChainById(chainId);
  const cartByRound = Object.values(cart);
  const store = useCartStorage();
  const [fixedDonation, setFixedDonation] = useState("");

  const { setVotingTokenForChain } = useCartStorage();
  const payoutTokenOptions: TToken[] = getVotingTokenOptions(
    Number(chainId)
  ).filter((p) => p.canVote);

  const { data, error, loading } = useTokenPrice(
    payoutToken.redstoneTokenId,
    payoutToken.priceSource
  );
  const payoutTokenPrice = !loading && !error ? Number(data) : null;

  // get number of projects in cartByRound
  const projectCount = cartByRound.reduce((acc, curr) => acc + curr.length, 0);

  /** The payout token data (like permit version etc.) might've changed since the user last visited the page
   * Refresh it to update, default to the first payout token if the previous token was deleted */
  useEffect(() => {
    setVotingTokenForChain(
      chainId,
      getVotingTokenOptions(chainId).find(
        (token) => token.address === payoutToken.address
      ) ?? getVotingTokenOptions(chainId)[0]
    );
    /* We only want this to happen on first render */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  return (
    <div className="grow block px-[16px] lg:pl-0 py-4 bg-white">
      <div className="flex flex-col md:flex-row justify-between border-b-2 pb-2 gap-3 mb-6">
        <div className="flex flex-row gap-2 items-center">
          <img
            className="inline-block h-8 w-8"
            src={stringToBlobUrl(chain.icon)}
            alt={"Chain Logo"}
          />
          <h2 className="text-xl sm:text-2xl font-semibold">{chain.prettyName}</h2>
          <h2 className="text-xl sm:text-2xl font-semibold">({projectCount})</h2>
        </div>
        <div className="hidden sm:flex flex-col sm:flex-row justify-center sm:justify-end gap-3 sm:gap-2 basis-[72%]">
          <div className="flex items-center gap-2 sm:gap-4">
            <p className="text-xs md:text-sm amount-text font-medium">
              Amount
            </p>
            <Input
              aria-label={"Donation amount for all projects "}
              id={"input-donationamount"}
              min="0"
              type="number"
              value={fixedDonation ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFixedDonation(e.target.value);
              }}
              className="w-24 sm:w-16 lg:w-18 max-h-10"
              placeholder={"0"}
            />
            <PayoutTokenDropdown
              selectedPayoutToken={payoutToken}
              setSelectedPayoutToken={(token) => {
                setVotingTokenForChain(chainId, token);
              }}
              payoutTokenOptions={payoutTokenOptions}
              balances={balances}
              balanceWarning={!enoughBalance}
            />
          </div>
          <div className="flex items-center justify-end sm:ml-2">
            <Button
              type="button"
              $variant="outline"
              onClick={() => {
                store.updateDonationsForChain(chainId, fixedDonation);
              }}
              className="text-sm py-2 px-3 text-blue-200 border border-blue-200 rounded h-10 mr-1"
            >
              Apply to all
            </Button>
            <ApplyTooltip />
          </div>
        </div>
      </div>
      {totalAmount > 0 && !enoughBalance && (
        <div className="flex flex-row justify-between my-4">
          <div className="rounded-md bg-red-50 py-2 text-pink-500 flex flex-col sm:flex-row items-center text-sm p-5 w-full justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <ExclamationCircleIcon className="w-6 h-6 mr-2" />
              <span className="p-2 pr-4 sm:flex-1">
                <span className="hidden sm:inline">You do not have enough funds in your wallet to complete this donation.</span>
                <span className="sm:hidden">Insufficient funds on Arbitrum</span>
                <br className="hidden sm:block" />
                <span className="hidden sm:inline">Please bridge funds to this network in order to submit your donation.</span>
              </span>
            </div>
            <div
              onClick={() => handleSwap()}
              className="flex items-center justify-center text-sm decoration-1 cursor-pointer rounded border font-semibold py-3 px-4 border-pink-500 min-h-[44px] w-full sm:w-auto"
            >
              Bridge Funds
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </div>
          </div>
        </div>
      )}
      {cartByRound.map((roundcart, key) => (
        <div key={key}>
          <RoundInCart
            key={key}
            roundCart={roundcart}
            handleRemoveProjectFromCart={store.remove}
            selectedPayoutToken={payoutToken}
            payoutTokenPrice={payoutTokenPrice ?? 0}
          />
        </div>
      ))}
    </div>
  );
}
