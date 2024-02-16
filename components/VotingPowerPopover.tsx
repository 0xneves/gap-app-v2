/* eslint-disable no-nested-ternary */

"use client";

import { formatNumberPercentage, isDelegateOf } from "@/utilities";
import formatCurrency from "@/utilities/formatCurrency";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import type { Community, Hex } from "@show-karma/karma-gap-sdk";
import { type FC, type ReactNode, useEffect, useState, Fragment } from "react";

interface VotingPowerPopoverProps {
  reviewer: string | Hex;
  children: ReactNode;
  community: Community;
}

export const VotingPowerPopover: FC<VotingPowerPopoverProps> = ({
  reviewer,
  children,
  community,
}) => {
  const [votingPower, setVotingPower] = useState<string | null>(null);
  const [delegatedVotes, setDelegatedVotes] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isDelegate, setIsDelegate] = useState(false);
  const [canFetch, setCanFetch] = useState(false);

  useEffect(() => {
    const getVotingPower = async () => {
      if (!community.details?.slug) return;
      setIsFetching(true);
      try {
        const daoDictionary: Record<string, string> = {
          arb: "arbitrum",
        };
        const data = await isDelegateOf(
          daoDictionary[community.details?.slug] || community.details?.slug,
          reviewer
        );

        if (data) {
          setVotingPower(data.voteWeight);
          setDelegatedVotes(data.delegatedVotes);
        }
        setIsDelegate(!!data);
      } catch (error) {
        console.log(error);
        setVotingPower(null);
        setIsDelegate(false);
      } finally {
        setIsFetching(false);
      }
    };
    if (canFetch) {
      getVotingPower();
    }
  }, [canFetch]);

  return (
    <div className="w-full max-w-md">
      <Popover className="relative">
        {({ open }) => {
          if (open) {
            setCanFetch(true);
          }
          return (
            <>
              <Popover.Button
                className={`
                ${open ? "text-white" : "text-white/90"}
                group inline-flex items-center rounded-md text-base font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
              >
                {children}
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 mt-3 w-xl transform px-4 sm:px-0">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                    <div className="relative flex flex-col gap-4 bg-white py-4 justify-start items-start">
                      <p className="px-4 text-xl border-b border-b-gray-300 font-bold w-full">
                        Grant Reviewer
                      </p>
                      <div className="px-4 flex flex-col gap-2 items-center rounded-lg transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50">
                        <p className="text-base font-medium text-gray-900 w-full">
                          Delegate of {community.details?.name}:{" "}
                          <span>{isDelegate ? "Yes" : "No"}</span>
                        </p>
                        <div className="flex flex-row gap-3 text-base font-medium">
                          <p>Voting power: </p>
                          <span>{`${formatCurrency(
                            +(delegatedVotes || 0)
                          )} (${formatNumberPercentage(
                            +(votingPower || 0)
                          )})`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          );
        }}
      </Popover>
    </div>
  );
};
