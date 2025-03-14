import { publicKeyToBtcAddress } from '@stacks/encryption';
import { pubKeyfromPrivKey } from '@stacks/transactions';
import * as bitcoinjs from 'bitcoinjs-lib';
import { TransactionSigner } from 'blockstack';
import { DEFAULT_MAX_ID_SEARCH_INDEX } from './argparse';
import { CLINetworkAdapter } from './network';

let maxIDSearchIndex = DEFAULT_MAX_ID_SEARCH_INDEX;

export function getMaxIDSearchIndex() {
  return maxIDSearchIndex;
}

export function setMaxIDSearchIndex(index: number) {
  maxIDSearchIndex = index;
}

export class CLITransactionSigner implements TransactionSigner {
  address: string;
  isComplete: boolean;

  constructor(address = '') {
    this.address = address;
    this.isComplete = false;
  }

  getAddress(): Promise<string> {
    return Promise.resolve().then(() => this.address);
  }

  signTransaction(_txIn: bitcoinjs.TransactionBuilder, _signingIndex: number): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return Promise.resolve().then(() => {});
  }

  signerVersion(): number {
    return 0;
  }
}

/*
 * Get a private key's address.  Honor the 01 to compress the public key
 * @privateKey (string) the hex-encoded private key
 */
export function getPrivateKeyAddress(
  network: CLINetworkAdapter,
  privateKey: string | CLITransactionSigner
): string {
  if (isCLITransactionSigner(privateKey)) {
    return privateKey.address;
  }

  const pubKey = pubKeyfromPrivKey(privateKey);
  const btcAddress = publicKeyToBtcAddress(pubKey.data);
  return network.coerceAddress(btcAddress);
}

export function isCLITransactionSigner(
  signer: string | CLITransactionSigner
): signer is CLITransactionSigner {
  return (signer as CLITransactionSigner).signerVersion !== undefined;
}
