"use client";

import type { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import {
  getWalletClient,
  type PublicClient,
  type WalletClient,
} from "@wagmi/core";
import { providers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { type HttpTransport } from "viem";
import {
  useAccount,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from "wagmi";

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    );
  return new providers.JsonRpcProvider(transport.url, network);
}

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);

  return signer;
}

export const getSigner = async (chainId: number) => {
  const walletClient = await getWalletClient({
    chainId,
  });
  if (!walletClient) return;
  const signer = walletClientToSigner(walletClient);
  return signer;
};

export function useSigner() {
  const { data: walletClient } = useWalletClient();

  const { isConnected, address, connector } = useAccount();

  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);
  const { chain } = useNetwork();
  useMemo(() => {
    if (!isConnected) {
      setSigner(undefined);
      return;
    }
    async function getSigner() {
      if (!walletClient) return;

      const tmpSigner = walletClientToSigner(walletClient);

      setSigner(tmpSigner);
    }

    getSigner();
  }, [walletClient, address, connector, chain?.id]);
  return signer;
}

export function useProvider() {
  const publicClient = usePublicClient();

  const [provider, setProvider] = useState<JsonRpcProvider | undefined>(
    undefined
  );
  useEffect(() => {
    async function getSigner() {
      if (!publicClient) return;

      const tmpProvider = publicClientToProvider(publicClient);

      setProvider(tmpProvider as JsonRpcProvider);
    }

    getSigner();
  }, [publicClient]);
  return provider;
}
