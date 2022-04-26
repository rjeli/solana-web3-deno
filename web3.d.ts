import { Buffer } from "https://deno.land/std@0.136.0/node/buffer.ts";

declare class Struct {
  constructor(properties: any);
  encode(): Buffer;
  static decode(data: Buffer): any;
  static decodeUnchecked(data: Buffer): any;
}
declare class Enum extends Struct {
  enum: string;
  constructor(properties: any);
}
declare const SOLANA_SCHEMA: Map<Function, any>;

/**
 * Maximum length of derived pubkey seed
 */
declare const MAX_SEED_LENGTH = 32;
/**
 * Value to be converted into public key
 */
declare type PublicKeyInitData =
  | number
  | string
  | Buffer
  | Uint8Array
  | Array<number>
  | PublicKeyData;
/**
 * JSON object representation of PublicKey class
 */
declare type PublicKeyData = {};
/**
 * A public key
 */
declare class PublicKey extends Struct {
  /**
   * Create a new PublicKey object
   * @param value ed25519 public key as buffer or base-58 encoded string
   */
  constructor(value: PublicKeyInitData);
  /**
   * Default public key value. (All zeros)
   */
  static default: PublicKey;
  /**
   * Checks if two publicKeys are equal
   */
  equals(publicKey: PublicKey): boolean;
  /**
   * Return the base-58 representation of the public key
   */
  toBase58(): string;
  toJSON(): string;
  /**
   * Return the byte array representation of the public key
   */
  toBytes(): Uint8Array;
  /**
   * Return the Buffer representation of the public key
   */
  toBuffer(): Buffer;
  /**
   * Return the base-58 representation of the public key
   */
  toString(): string;
  /**
   * Derive a public key from another key, a seed, and a program ID.
   * The program ID will also serve as the owner of the public key, giving
   * it permission to write data to the account.
   */
  static createWithSeed(
    fromPublicKey: PublicKey,
    seed: string,
    programId: PublicKey,
  ): Promise<PublicKey>;
  /**
   * Derive a program address from seeds and a program ID.
   */
  static createProgramAddressSync(
    seeds: Array<Buffer | Uint8Array>,
    programId: PublicKey,
  ): PublicKey;
  /**
   * Async version of createProgramAddressSync
   * For backwards compatibility
   */
  static createProgramAddress(
    seeds: Array<Buffer | Uint8Array>,
    programId: PublicKey,
  ): Promise<PublicKey>;
  /**
   * Find a valid program address
   *
   * Valid program addresses must fall off the ed25519 curve.  This function
   * iterates a nonce until it finds one that when combined with the seeds
   * results in a valid program address.
   */
  static findProgramAddressSync(
    seeds: Array<Buffer | Uint8Array>,
    programId: PublicKey,
  ): [PublicKey, number];
  /**
   * Async version of findProgramAddressSync
   * For backwards compatibility
   */
  static findProgramAddress(
    seeds: Array<Buffer | Uint8Array>,
    programId: PublicKey,
  ): Promise<[PublicKey, number]>;
  /**
   * Check that a pubkey is on the ed25519 curve.
   */
  static isOnCurve(pubkeyData: PublicKeyInitData): boolean;
}

/**
 * An account key pair (public and secret keys).
 *
 * @deprecated since v1.10.0, please use {@link Keypair} instead.
 */
declare class Account {
  /**
   * Create a new Account object
   *
   * If the secretKey parameter is not provided a new key pair is randomly
   * created for the account
   *
   * @param secretKey Secret key for the account
   */
  constructor(secretKey?: Buffer | Uint8Array | Array<number>);
  /**
   * The public key for this account
   */
  get publicKey(): PublicKey;
  /**
   * The **unencrypted** secret key for this account
   */
  get secretKey(): Buffer;
}

/**
 * Blockhash as Base58 string.
 */
declare type Blockhash = string;

declare const BPF_LOADER_DEPRECATED_PROGRAM_ID: PublicKey;

/**
 * Epoch schedule
 * (see https://docs.solana.com/terminology#epoch)
 * Can be retrieved with the {@link connection.getEpochSchedule} method
 */
declare class EpochSchedule {
  /** The maximum number of slots in each epoch */
  slotsPerEpoch: number;
  /** The number of slots before beginning of an epoch to calculate a leader schedule for that epoch */
  leaderScheduleSlotOffset: number;
  /** Indicates whether epochs start short and grow */
  warmup: boolean;
  /** The first epoch with `slotsPerEpoch` slots */
  firstNormalEpoch: number;
  /** The first slot of `firstNormalEpoch` */
  firstNormalSlot: number;
  constructor(
    slotsPerEpoch: number,
    leaderScheduleSlotOffset: number,
    warmup: boolean,
    firstNormalEpoch: number,
    firstNormalSlot: number,
  );
  getEpoch(slot: number): number;
  getEpochAndSlotIndex(slot: number): [number, number];
  getFirstSlotInEpoch(epoch: number): number;
  getLastSlotInEpoch(epoch: number): number;
  getSlotsInEpoch(epoch: number): number;
}

/**
 * Calculator for transaction fees.
 */
interface FeeCalculator {
  /** Cost in lamports to validate a signature. */
  lamportsPerSignature: number;
}

declare const NONCE_ACCOUNT_LENGTH: number;
/**
 * NonceAccount class
 */
declare class NonceAccount {
  authorizedPubkey: PublicKey;
  nonce: Blockhash;
  feeCalculator: FeeCalculator;
  /**
   * Deserialize NonceAccount from the account data.
   *
   * @param buffer account data
   * @return NonceAccount
   */
  static fromAccountData(
    buffer: Buffer | Uint8Array | Array<number>,
  ): NonceAccount;
}

/**
 * Keypair signer interface
 */
interface Signer {
  publicKey: PublicKey;
  secretKey: Uint8Array;
}
/**
 * Ed25519 Keypair
 */
interface Ed25519Keypair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}
/**
 * An account keypair used for signing transactions.
 */
declare class Keypair {
  private _keypair;
  /**
   * Create a new keypair instance.
   * Generate random keypair if no {@link Ed25519Keypair} is provided.
   *
   * @param keypair ed25519 keypair
   */
  constructor(keypair?: Ed25519Keypair);
  /**
   * Generate a new random keypair
   */
  static generate(): Keypair;
  /**
   * Create a keypair from a raw secret key byte array.
   *
   * This method should only be used to recreate a keypair from a previously
   * generated secret key. Generating keypairs from a random seed should be done
   * with the {@link Keypair.fromSeed} method.
   *
   * @throws error if the provided secret key is invalid and validation is not skipped.
   *
   * @param secretKey secret key byte array
   * @param options: skip secret key validation
   */
  static fromSecretKey(
    secretKey: Uint8Array,
    options?: {
      skipValidation?: boolean;
    },
  ): Keypair;
  /**
   * Generate a keypair from a 32 byte seed.
   *
   * @param seed seed byte array
   */
  static fromSeed(seed: Uint8Array): Keypair;
  /**
   * The public key for this keypair
   */
  get publicKey(): PublicKey;
  /**
   * The raw secret key for this keypair
   */
  get secretKey(): Uint8Array;
}

/**
 * The message header, identifying signed and read-only account
 */
declare type MessageHeader = {
  /**
   * The number of signatures required for this message to be considered valid. The
   * signatures must match the first `numRequiredSignatures` of `accountKeys`.
   */
  numRequiredSignatures: number;
  /** The last `numReadonlySignedAccounts` of the signed keys are read-only accounts */
  numReadonlySignedAccounts: number;
  /** The last `numReadonlySignedAccounts` of the unsigned keys are read-only accounts */
  numReadonlyUnsignedAccounts: number;
};
/**
 * An instruction to execute by a program
 *
 * @property {number} programIdIndex
 * @property {number[]} accounts
 * @property {string} data
 */
declare type CompiledInstruction = {
  /** Index into the transaction keys array indicating the program account that executes this instruction */
  programIdIndex: number;
  /** Ordered indices into the transaction keys array indicating which accounts to pass to the program */
  accounts: number[];
  /** The program input data encoded as base 58 */
  data: string;
};
/**
 * Message constructor arguments
 */
declare type MessageArgs = {
  /** The message header, identifying signed and read-only `accountKeys` */
  header: MessageHeader;
  /** All the account keys used by this transaction */
  accountKeys: string[];
  /** The hash of a recent ledger block */
  recentBlockhash: Blockhash;
  /** Instructions that will be executed in sequence and committed in one atomic transaction if all succeed. */
  instructions: CompiledInstruction[];
};
/**
 * List of instructions to be processed atomically
 */
declare class Message {
  header: MessageHeader;
  accountKeys: PublicKey[];
  recentBlockhash: Blockhash;
  instructions: CompiledInstruction[];
  private indexToProgramIds;
  constructor(args: MessageArgs);
  isAccountSigner(index: number): boolean;
  isAccountWritable(index: number): boolean;
  isProgramId(index: number): boolean;
  programIds(): PublicKey[];
  nonProgramIds(): PublicKey[];
  serialize(): Buffer;
  /**
   * Decode a compiled message into a Message object.
   */
  static from(buffer: Buffer | Uint8Array | Array<number>): Message;
}

/**
 * Transaction signature as base-58 encoded string
 */
declare type TransactionSignature = string;
/**
 * Maximum over-the-wire size of a Transaction
 *
 * 1280 is IPv6 minimum MTU
 * 40 bytes is the size of the IPv6 header
 * 8 bytes is the size of the fragment header
 */
declare const PACKET_DATA_SIZE: number;
/**
 * Account metadata used to define instructions
 */
declare type AccountMeta = {
  /** An account's public key */
  pubkey: PublicKey;
  /** True if an instruction requires a transaction signature matching `pubkey` */
  isSigner: boolean;
  /** True if the `pubkey` can be loaded as a read-write account. */
  isWritable: boolean;
};
/**
 * List of TransactionInstruction object fields that may be initialized at construction
 */
declare type TransactionInstructionCtorFields = {
  keys: Array<AccountMeta>;
  programId: PublicKey;
  data?: Buffer;
};
/**
 * Configuration object for Transaction.serialize()
 */
declare type SerializeConfig = {
  /** Require all transaction signatures be present (default: true) */
  requireAllSignatures?: boolean;
  /** Verify provided signatures (default: true) */
  verifySignatures?: boolean;
};
/**
 * Transaction Instruction class
 */
declare class TransactionInstruction {
  /**
   * Public keys to include in this transaction
   * Boolean represents whether this pubkey needs to sign the transaction
   */
  keys: Array<AccountMeta>;
  /**
   * Program Id to execute
   */
  programId: PublicKey;
  /**
   * Program input
   */
  data: Buffer;
  constructor(opts: TransactionInstructionCtorFields);
}
/**
 * Pair of signature and corresponding public key
 */
declare type SignaturePubkeyPair = {
  signature: Buffer | null;
  publicKey: PublicKey;
};
/**
 * List of Transaction object fields that may be initialized at construction
 *
 */
declare type TransactionCtorFields = {
  /** A recent blockhash */
  recentBlockhash?: Blockhash | null;
  /** Optional nonce information used for offline nonce'd transactions */
  nonceInfo?: NonceInformation | null;
  /** The transaction fee payer */
  feePayer?: PublicKey | null;
  /** One or more signatures */
  signatures?: Array<SignaturePubkeyPair>;
};
/**
 * Nonce information to be used to build an offline Transaction.
 */
declare type NonceInformation = {
  /** The current blockhash stored in the nonce */
  nonce: Blockhash;
  /** AdvanceNonceAccount Instruction */
  nonceInstruction: TransactionInstruction;
};
/**
 * Transaction class
 */
declare class Transaction {
  /**
   * Signatures for the transaction.  Typically created by invoking the
   * `sign()` method
   */
  signatures: Array<SignaturePubkeyPair>;
  /**
   * The first (payer) Transaction signature
   */
  get signature(): Buffer | null;
  /**
   * The transaction fee payer
   */
  feePayer?: PublicKey;
  /**
   * The instructions to atomically execute
   */
  instructions: Array<TransactionInstruction>;
  /**
   * A recent transaction id. Must be populated by the caller
   */
  recentBlockhash?: Blockhash;
  /**
   * Optional Nonce information. If populated, transaction will use a durable
   * Nonce hash instead of a recentBlockhash. Must be populated by the caller
   */
  nonceInfo?: NonceInformation;
  /**
   * Construct an empty Transaction
   */
  constructor(opts?: TransactionCtorFields);
  /**
   * Add one or more instructions to this Transaction
   */
  add(
    ...items: Array<
      Transaction | TransactionInstruction | TransactionInstructionCtorFields
    >
  ): Transaction;
  /**
   * Compile transaction data
   */
  compileMessage(): Message;
  /**
   * Get a buffer of the Transaction data that need to be covered by signatures
   */
  serializeMessage(): Buffer;
  /**
   * Get the estimated fee associated with a transaction
   */
  getEstimatedFee(connection: Connection): Promise<number>;
  /**
   * Specify the public keys which will be used to sign the Transaction.
   * The first signer will be used as the transaction fee payer account.
   *
   * Signatures can be added with either `partialSign` or `addSignature`
   *
   * @deprecated Deprecated since v0.84.0. Only the fee payer needs to be
   * specified and it can be set in the Transaction constructor or with the
   * `feePayer` property.
   */
  setSigners(...signers: Array<PublicKey>): void;
  /**
   * Sign the Transaction with the specified signers. Multiple signatures may
   * be applied to a Transaction. The first signature is considered "primary"
   * and is used identify and confirm transactions.
   *
   * If the Transaction `feePayer` is not set, the first signer will be used
   * as the transaction fee payer account.
   *
   * Transaction fields should not be modified after the first call to `sign`,
   * as doing so may invalidate the signature and cause the Transaction to be
   * rejected.
   *
   * The Transaction must be assigned a valid `recentBlockhash` before invoking this method
   */
  sign(...signers: Array<Signer>): void;
  /**
   * Partially sign a transaction with the specified accounts. All accounts must
   * correspond to either the fee payer or a signer account in the transaction
   * instructions.
   *
   * All the caveats from the `sign` method apply to `partialSign`
   */
  partialSign(...signers: Array<Signer>): void;
  /**
   * Add an externally created signature to a transaction. The public key
   * must correspond to either the fee payer or a signer account in the transaction
   * instructions.
   */
  addSignature(pubkey: PublicKey, signature: Buffer): void;
  /**
   * Verify signatures of a complete, signed Transaction
   */
  verifySignatures(): boolean;
  /**
   * Serialize the Transaction in the wire format.
   */
  serialize(config?: SerializeConfig): Buffer;
  /**
   * Parse a wire transaction into a Transaction object.
   */
  static from(buffer: Buffer | Uint8Array | Array<number>): Transaction;
  /**
   * Populate Transaction object from message and signatures
   */
  static populate(message: Message, signatures?: Array<string>): Transaction;
}

declare type TokenAccountsFilter =
  | {
      mint: PublicKey;
    }
  | {
      programId: PublicKey;
    };
/**
 * Extra contextual information for RPC responses
 */
declare type Context = {
  slot: number;
};
/**
 * Options for sending transactions
 */
declare type SendOptions = {
  /** disable transaction verification step */
  skipPreflight?: boolean;
  /** preflight commitment level */
  preflightCommitment?: Commitment;
  /** Maximum number of times for the RPC node to retry sending the transaction to the leader. */
  maxRetries?: number;
};
/**
 * Options for confirming transactions
 */
declare type ConfirmOptions = {
  /** disable transaction verification step */
  skipPreflight?: boolean;
  /** desired commitment level */
  commitment?: Commitment;
  /** preflight commitment level */
  preflightCommitment?: Commitment;
  /** Maximum number of times for the RPC node to retry sending the transaction to the leader. */
  maxRetries?: number;
};
/**
 * Options for getConfirmedSignaturesForAddress2
 */
declare type ConfirmedSignaturesForAddress2Options = {
  /**
   * Start searching backwards from this transaction signature.
   * @remark If not provided the search starts from the highest max confirmed block.
   */
  before?: TransactionSignature;
  /** Search until this transaction signature is reached, if found before `limit`. */
  until?: TransactionSignature;
  /** Maximum transaction signatures to return (between 1 and 1,000, default: 1,000). */
  limit?: number;
};
/**
 * Options for getSignaturesForAddress
 */
declare type SignaturesForAddressOptions = {
  /**
   * Start searching backwards from this transaction signature.
   * @remark If not provided the search starts from the highest max confirmed block.
   */
  before?: TransactionSignature;
  /** Search until this transaction signature is reached, if found before `limit`. */
  until?: TransactionSignature;
  /** Maximum transaction signatures to return (between 1 and 1,000, default: 1,000). */
  limit?: number;
};
/**
 * RPC Response with extra contextual information
 */
declare type RpcResponseAndContext<T> = {
  /** response context */
  context: Context;
  /** response value */
  value: T;
};
/**
 * The level of commitment desired when querying state
 * <pre>
 *   'processed': Query the most recent block which has reached 1 confirmation by the connected node
 *   'confirmed': Query the most recent block which has reached 1 confirmation by the cluster
 *   'finalized': Query the most recent block which has been finalized by the cluster
 * </pre>
 */
declare type Commitment =
  | 'processed'
  | 'confirmed'
  | 'finalized'
  | 'recent'
  | 'single'
  | 'singleGossip'
  | 'root'
  | 'max';
/**
 * A subset of Commitment levels, which are at least optimistically confirmed
 * <pre>
 *   'confirmed': Query the most recent block which has reached 1 confirmation by the cluster
 *   'finalized': Query the most recent block which has been finalized by the cluster
 * </pre>
 */
declare type Finality = 'confirmed' | 'finalized';
/**
 * Filter for largest accounts query
 * <pre>
 *   'circulating':    Return the largest accounts that are part of the circulating supply
 *   'nonCirculating': Return the largest accounts that are not part of the circulating supply
 * </pre>
 */
declare type LargestAccountsFilter = 'circulating' | 'nonCirculating';
/**
 * Configuration object for changing `getLargestAccounts` query behavior
 */
declare type GetLargestAccountsConfig = {
  /** The level of commitment desired */
  commitment?: Commitment;
  /** Filter largest accounts by whether they are part of the circulating supply */
  filter?: LargestAccountsFilter;
};
/**
 * Configuration object for changing `getSupply` request behavior
 */
declare type GetSupplyConfig = {
  /** The level of commitment desired */
  commitment?: Commitment;
  /** Exclude non circulating accounts list from response */
  excludeNonCirculatingAccountsList?: boolean;
};
/**
 * Configuration object for changing query behavior
 */
declare type SignatureStatusConfig = {
  /** enable searching status history, not needed for recent transactions */
  searchTransactionHistory: boolean;
};
/**
 * Information describing a cluster node
 */
declare type ContactInfo = {
  /** Identity public key of the node */
  pubkey: string;
  /** Gossip network address for the node */
  gossip: string | null;
  /** TPU network address for the node (null if not available) */
  tpu: string | null;
  /** JSON RPC network address for the node (null if not available) */
  rpc: string | null;
  /** Software version of the node (null if not available) */
  version: string | null;
};
/**
 * Information describing a vote account
 */
declare type VoteAccountInfo = {
  /** Public key of the vote account */
  votePubkey: string;
  /** Identity public key of the node voting with this account */
  nodePubkey: string;
  /** The stake, in lamports, delegated to this vote account and activated */
  activatedStake: number;
  /** Whether the vote account is staked for this epoch */
  epochVoteAccount: boolean;
  /** Recent epoch voting credit history for this voter */
  epochCredits: Array<[number, number, number]>;
  /** A percentage (0-100) of rewards payout owed to the voter */
  commission: number;
  /** Most recent slot voted on by this vote account */
  lastVote: number;
};
/**
 * A collection of cluster vote accounts
 */
declare type VoteAccountStatus = {
  /** Active vote accounts */
  current: Array<VoteAccountInfo>;
  /** Inactive vote accounts */
  delinquent: Array<VoteAccountInfo>;
};
/**
 * Network Inflation
 * (see https://docs.solana.com/implemented-proposals/ed_overview)
 */
declare type InflationGovernor = {
  foundation: number;
  foundationTerm: number;
  initial: number;
  taper: number;
  terminal: number;
};
/**
 * The inflation reward for an epoch
 */
declare type InflationReward = {
  /** epoch for which the reward occurs */
  epoch: number;
  /** the slot in which the rewards are effective */
  effectiveSlot: number;
  /** reward amount in lamports */
  amount: number;
  /** post balance of the account in lamports */
  postBalance: number;
};
/**
 * Information about the current epoch
 */
declare type EpochInfo = {
  epoch: number;
  slotIndex: number;
  slotsInEpoch: number;
  absoluteSlot: number;
  blockHeight?: number;
  transactionCount?: number;
};
/**
 * Leader schedule
 * (see https://docs.solana.com/terminology#leader-schedule)
 */
declare type LeaderSchedule = {
  [address: string]: number[];
};
/**
 * Version info for a node
 */
declare type Version = {
  /** Version of solana-core */
  'solana-core': string;
  'feature-set'?: number;
};
declare type SimulatedTransactionAccountInfo = {
  /** `true` if this account's data contains a loaded program */
  executable: boolean;
  /** Identifier of the program that owns the account */
  owner: string;
  /** Number of lamports assigned to the account */
  lamports: number;
  /** Optional data assigned to the account */
  data: string[];
  /** Optional rent epoch info for account */
  rentEpoch?: number;
};
declare type SimulatedTransactionResponse = {
  err: TransactionError | string | null;
  logs: Array<string> | null;
  accounts?: (SimulatedTransactionAccountInfo | null)[] | null;
  unitsConsumed?: number;
};
declare type ParsedInnerInstruction = {
  index: number;
  instructions: (ParsedInstruction | PartiallyDecodedInstruction)[];
};
declare type TokenBalance = {
  accountIndex: number;
  mint: string;
  owner?: string;
  uiTokenAmount: TokenAmount;
};
/**
 * Metadata for a parsed confirmed transaction on the ledger
 *
 * @deprecated Deprecated since Solana v1.8.0. Please use {@link ParsedTransactionMeta} instead.
 */
declare type ParsedConfirmedTransactionMeta = ParsedTransactionMeta;
/**
 * Metadata for a parsed transaction on the ledger
 */
declare type ParsedTransactionMeta = {
  /** The fee charged for processing the transaction */
  fee: number;
  /** An array of cross program invoked parsed instructions */
  innerInstructions?: ParsedInnerInstruction[] | null;
  /** The balances of the transaction accounts before processing */
  preBalances: Array<number>;
  /** The balances of the transaction accounts after processing */
  postBalances: Array<number>;
  /** An array of program log messages emitted during a transaction */
  logMessages?: Array<string> | null;
  /** The token balances of the transaction accounts before processing */
  preTokenBalances?: Array<TokenBalance> | null;
  /** The token balances of the transaction accounts after processing */
  postTokenBalances?: Array<TokenBalance> | null;
  /** The error result of transaction processing */
  err: TransactionError | null;
};
declare type CompiledInnerInstruction = {
  index: number;
  instructions: CompiledInstruction[];
};
/**
 * Metadata for a confirmed transaction on the ledger
 */
declare type ConfirmedTransactionMeta = {
  /** The fee charged for processing the transaction */
  fee: number;
  /** An array of cross program invoked instructions */
  innerInstructions?: CompiledInnerInstruction[] | null;
  /** The balances of the transaction accounts before processing */
  preBalances: Array<number>;
  /** The balances of the transaction accounts after processing */
  postBalances: Array<number>;
  /** An array of program log messages emitted during a transaction */
  logMessages?: Array<string> | null;
  /** The token balances of the transaction accounts before processing */
  preTokenBalances?: Array<TokenBalance> | null;
  /** The token balances of the transaction accounts after processing */
  postTokenBalances?: Array<TokenBalance> | null;
  /** The error result of transaction processing */
  err: TransactionError | null;
};
/**
 * A processed transaction from the RPC API
 */
declare type TransactionResponse = {
  /** The slot during which the transaction was processed */
  slot: number;
  /** The transaction */
  transaction: {
    /** The transaction message */
    message: Message;
    /** The transaction signatures */
    signatures: string[];
  };
  /** Metadata produced from the transaction */
  meta: ConfirmedTransactionMeta | null;
  /** The unix timestamp of when the transaction was processed */
  blockTime?: number | null;
};
/**
 * A confirmed transaction on the ledger
 */
declare type ConfirmedTransaction = {
  /** The slot during which the transaction was processed */
  slot: number;
  /** The details of the transaction */
  transaction: Transaction;
  /** Metadata produced from the transaction */
  meta: ConfirmedTransactionMeta | null;
  /** The unix timestamp of when the transaction was processed */
  blockTime?: number | null;
};
/**
 * A partially decoded transaction instruction
 */
declare type PartiallyDecodedInstruction = {
  /** Program id called by this instruction */
  programId: PublicKey;
  /** Public keys of accounts passed to this instruction */
  accounts: Array<PublicKey>;
  /** Raw base-58 instruction data */
  data: string;
};
/**
 * A parsed transaction message account
 */
declare type ParsedMessageAccount = {
  /** Public key of the account */
  pubkey: PublicKey;
  /** Indicates if the account signed the transaction */
  signer: boolean;
  /** Indicates if the account is writable for this transaction */
  writable: boolean;
};
/**
 * A parsed transaction instruction
 */
declare type ParsedInstruction = {
  /** Name of the program for this instruction */
  program: string;
  /** ID of the program for this instruction */
  programId: PublicKey;
  /** Parsed instruction info */
  parsed: any;
};
/**
 * A parsed transaction message
 */
declare type ParsedMessage = {
  /** Accounts used in the instructions */
  accountKeys: ParsedMessageAccount[];
  /** The atomically executed instructions for the transaction */
  instructions: (ParsedInstruction | PartiallyDecodedInstruction)[];
  /** Recent blockhash */
  recentBlockhash: string;
};
/**
 * A parsed transaction
 */
declare type ParsedTransaction = {
  /** Signatures for the transaction */
  signatures: Array<string>;
  /** Message of the transaction */
  message: ParsedMessage;
};
/**
 * A parsed and confirmed transaction on the ledger
 *
 * @deprecated Deprecated since Solana v1.8.0. Please use {@link ParsedTransactionWithMeta} instead.
 */
declare type ParsedConfirmedTransaction = ParsedTransactionWithMeta;
/**
 * A parsed transaction on the ledger with meta
 */
declare type ParsedTransactionWithMeta = {
  /** The slot during which the transaction was processed */
  slot: number;
  /** The details of the transaction */
  transaction: ParsedTransaction;
  /** Metadata produced from the transaction */
  meta: ParsedTransactionMeta | null;
  /** The unix timestamp of when the transaction was processed */
  blockTime?: number | null;
};
/**
 * A processed block fetched from the RPC API
 */
declare type BlockResponse = {
  /** Blockhash of this block */
  blockhash: Blockhash;
  /** Blockhash of this block's parent */
  previousBlockhash: Blockhash;
  /** Slot index of this block's parent */
  parentSlot: number;
  /** Vector of transactions with status meta and original message */
  transactions: Array<{
    /** The transaction */
    transaction: {
      /** The transaction message */
      message: Message;
      /** The transaction signatures */
      signatures: string[];
    };
    /** Metadata produced from the transaction */
    meta: ConfirmedTransactionMeta | null;
  }>;
  /** Vector of block rewards */
  rewards?: Array<{
    /** Public key of reward recipient */
    pubkey: string;
    /** Reward value in lamports */
    lamports: number;
    /** Account balance after reward is applied */
    postBalance: number | null;
    /** Type of reward received */
    rewardType: string | null;
  }>;
  /** The unix timestamp of when the block was processed */
  blockTime: number | null;
};
/**
 * A ConfirmedBlock on the ledger
 */
declare type ConfirmedBlock = {
  /** Blockhash of this block */
  blockhash: Blockhash;
  /** Blockhash of this block's parent */
  previousBlockhash: Blockhash;
  /** Slot index of this block's parent */
  parentSlot: number;
  /** Vector of transactions and status metas */
  transactions: Array<{
    transaction: Transaction;
    meta: ConfirmedTransactionMeta | null;
  }>;
  /** Vector of block rewards */
  rewards?: Array<{
    pubkey: string;
    lamports: number;
    postBalance: number | null;
    rewardType: string | null;
  }>;
  /** The unix timestamp of when the block was processed */
  blockTime: number | null;
};
/**
 * A Block on the ledger with signatures only
 */
declare type BlockSignatures = {
  /** Blockhash of this block */
  blockhash: Blockhash;
  /** Blockhash of this block's parent */
  previousBlockhash: Blockhash;
  /** Slot index of this block's parent */
  parentSlot: number;
  /** Vector of signatures */
  signatures: Array<string>;
  /** The unix timestamp of when the block was processed */
  blockTime: number | null;
};
/**
 * recent block production information
 */
declare type BlockProduction = Readonly<{
  /** a dictionary of validator identities, as base-58 encoded strings. Value is a two element array containing the number of leader slots and the number of blocks produced */
  byIdentity: Readonly<Record<string, ReadonlyArray<number>>>;
  /** Block production slot range */
  range: Readonly<{
    /** first slot of the block production information (inclusive) */
    firstSlot: number;
    /** last slot of block production information (inclusive) */
    lastSlot: number;
  }>;
}>;
declare type GetBlockProductionConfig = {
  /** Optional commitment level */
  commitment?: Commitment;
  /** Slot range to return block production for. If parameter not provided, defaults to current epoch. */
  range?: {
    /** first slot to return block production information for (inclusive) */
    firstSlot: number;
    /** last slot to return block production information for (inclusive). If parameter not provided, defaults to the highest slot */
    lastSlot?: number;
  };
  /** Only return results for this validator identity (base-58 encoded) */
  identity?: string;
};
/**
 * A performance sample
 */
declare type PerfSample = {
  /** Slot number of sample */
  slot: number;
  /** Number of transactions in a sample window */
  numTransactions: number;
  /** Number of slots in a sample window */
  numSlots: number;
  /** Sample window in seconds */
  samplePeriodSecs: number;
};
/**
 * Supply
 */
declare type Supply = {
  /** Total supply in lamports */
  total: number;
  /** Circulating supply in lamports */
  circulating: number;
  /** Non-circulating supply in lamports */
  nonCirculating: number;
  /** List of non-circulating account addresses */
  nonCirculatingAccounts: Array<PublicKey>;
};
/**
 * Token amount object which returns a token amount in different formats
 * for various client use cases.
 */
declare type TokenAmount = {
  /** Raw amount of tokens as string ignoring decimals */
  amount: string;
  /** Number of decimals configured for token's mint */
  decimals: number;
  /** Token amount as float, accounts for decimals */
  uiAmount: number | null;
  /** Token amount as string, accounts for decimals */
  uiAmountString?: string;
};
/**
 * Token address and balance.
 */
declare type TokenAccountBalancePair = {
  /** Address of the token account */
  address: PublicKey;
  /** Raw amount of tokens as string ignoring decimals */
  amount: string;
  /** Number of decimals configured for token's mint */
  decimals: number;
  /** Token amount as float, accounts for decimals */
  uiAmount: number | null;
  /** Token amount as string, accounts for decimals */
  uiAmountString?: string;
};
/**
 * Pair of an account address and its balance
 */
declare type AccountBalancePair = {
  address: PublicKey;
  lamports: number;
};
/**
 * Slot updates which can be used for tracking the live progress of a cluster.
 * - `"firstShredReceived"`: connected node received the first shred of a block.
 * Indicates that a new block that is being produced.
 * - `"completed"`: connected node has received all shreds of a block. Indicates
 * a block was recently produced.
 * - `"optimisticConfirmation"`: block was optimistically confirmed by the
 * cluster. It is not guaranteed that an optimistic confirmation notification
 * will be sent for every finalized blocks.
 * - `"root"`: the connected node rooted this block.
 * - `"createdBank"`: the connected node has started validating this block.
 * - `"frozen"`: the connected node has validated this block.
 * - `"dead"`: the connected node failed to validate this block.
 */
declare type SlotUpdate =
  | {
      type: 'firstShredReceived';
      slot: number;
      timestamp: number;
    }
  | {
      type: 'completed';
      slot: number;
      timestamp: number;
    }
  | {
      type: 'createdBank';
      slot: number;
      timestamp: number;
      parent: number;
    }
  | {
      type: 'frozen';
      slot: number;
      timestamp: number;
      stats: {
        numTransactionEntries: number;
        numSuccessfulTransactions: number;
        numFailedTransactions: number;
        maxTransactionsPerEntry: number;
      };
    }
  | {
      type: 'dead';
      slot: number;
      timestamp: number;
      err: string;
    }
  | {
      type: 'optimisticConfirmation';
      slot: number;
      timestamp: number;
    }
  | {
      type: 'root';
      slot: number;
      timestamp: number;
    };
/**
 * Information about the latest slot being processed by a node
 */
declare type SlotInfo = {
  /** Currently processing slot */
  slot: number;
  /** Parent of the current slot */
  parent: number;
  /** The root block of the current slot's fork */
  root: number;
};
/**
 * Parsed account data
 */
declare type ParsedAccountData = {
  /** Name of the program that owns this account */
  program: string;
  /** Parsed account data */
  parsed: any;
  /** Space used by account data */
  space: number;
};
/**
 * Stake Activation data
 */
declare type StakeActivationData = {
  /** the stake account's activation state */
  state: 'active' | 'inactive' | 'activating' | 'deactivating';
  /** stake active during the epoch */
  active: number;
  /** stake inactive during the epoch */
  inactive: number;
};
/**
 * Data slice argument for getProgramAccounts
 */
declare type DataSlice = {
  /** offset of data slice */
  offset: number;
  /** length of data slice */
  length: number;
};
/**
 * Memory comparison filter for getProgramAccounts
 */
declare type MemcmpFilter = {
  memcmp: {
    /** offset into program account data to start comparison */
    offset: number;
    /** data to match, as base-58 encoded string and limited to less than 129 bytes */
    bytes: string;
  };
};
/**
 * Data size comparison filter for getProgramAccounts
 */
declare type DataSizeFilter = {
  /** Size of data for program account data length comparison */
  dataSize: number;
};
/**
 * A filter object for getProgramAccounts
 */
declare type GetProgramAccountsFilter = MemcmpFilter | DataSizeFilter;
/**
 * Configuration object for getProgramAccounts requests
 */
declare type GetProgramAccountsConfig = {
  /** Optional commitment level */
  commitment?: Commitment;
  /** Optional encoding for account data (default base64)
   * To use "jsonParsed" encoding, please refer to `getParsedProgramAccounts` in connection.ts
   * */
  encoding?: 'base64';
  /** Optional data slice to limit the returned account data */
  dataSlice?: DataSlice;
  /** Optional array of filters to apply to accounts */
  filters?: GetProgramAccountsFilter[];
};
/**
 * Configuration object for getParsedProgramAccounts
 */
declare type GetParsedProgramAccountsConfig = {
  /** Optional commitment level */
  commitment?: Commitment;
  /** Optional array of filters to apply to accounts */
  filters?: GetProgramAccountsFilter[];
};
/**
 * Configuration object for getMultipleAccounts
 */
declare type GetMultipleAccountsConfig = {
  /** Optional commitment level */
  commitment?: Commitment;
  /** Optional encoding for account data (default base64) */
  encoding?: 'base64' | 'jsonParsed';
};
/**
 * Information describing an account
 */
declare type AccountInfo<T> = {
  /** `true` if this account's data contains a loaded program */
  executable: boolean;
  /** Identifier of the program that owns the account */
  owner: PublicKey;
  /** Number of lamports assigned to the account */
  lamports: number;
  /** Optional data assigned to the account */
  data: T;
  /** Optional rent epoch info for account */
  rentEpoch?: number;
};
/**
 * Account information identified by pubkey
 */
declare type KeyedAccountInfo = {
  accountId: PublicKey;
  accountInfo: AccountInfo<Buffer>;
};
/**
 * Callback function for account change notifications
 */
declare type AccountChangeCallback = (
  accountInfo: AccountInfo<Buffer>,
  context: Context,
) => void;
/**
 * Callback function for program account change notifications
 */
declare type ProgramAccountChangeCallback = (
  keyedAccountInfo: KeyedAccountInfo,
  context: Context,
) => void;
/**
 * Callback function for slot change notifications
 */
declare type SlotChangeCallback = (slotInfo: SlotInfo) => void;
/**
 * Callback function for slot update notifications
 */
declare type SlotUpdateCallback = (slotUpdate: SlotUpdate) => void;
/**
 * Callback function for signature status notifications
 */
declare type SignatureResultCallback = (
  signatureResult: SignatureResult,
  context: Context,
) => void;
/**
 * Signature status notification with transaction result
 */
declare type SignatureStatusNotification = {
  type: 'status';
  result: SignatureResult;
};
/**
 * Signature received notification
 */
declare type SignatureReceivedNotification = {
  type: 'received';
};
/**
 * Callback function for signature notifications
 */
declare type SignatureSubscriptionCallback = (
  notification: SignatureStatusNotification | SignatureReceivedNotification,
  context: Context,
) => void;
/**
 * Signature subscription options
 */
declare type SignatureSubscriptionOptions = {
  commitment?: Commitment;
  enableReceivedNotification?: boolean;
};
/**
 * Callback function for root change notifications
 */
declare type RootChangeCallback = (root: number) => void;
/**
 * Logs result.
 */
declare type Logs = {
  err: TransactionError | null;
  logs: string[];
  signature: string;
};
/**
 * Filter for log subscriptions.
 */
declare type LogsFilter = PublicKey | 'all' | 'allWithVotes';
/**
 * Callback function for log notifications.
 */
declare type LogsCallback = (logs: Logs, ctx: Context) => void;
/**
 * Signature result
 */
declare type SignatureResult = {
  err: TransactionError | null;
};
/**
 * Transaction error
 */
declare type TransactionError = {} | string;
/**
 * Transaction confirmation status
 * <pre>
 *   'processed': Transaction landed in a block which has reached 1 confirmation by the connected node
 *   'confirmed': Transaction landed in a block which has reached 1 confirmation by the cluster
 *   'finalized': Transaction landed in a block which has been finalized by the cluster
 * </pre>
 */
declare type TransactionConfirmationStatus =
  | 'processed'
  | 'confirmed'
  | 'finalized';
/**
 * Signature status
 */
declare type SignatureStatus = {
  /** when the transaction was processed */
  slot: number;
  /** the number of blocks that have been confirmed and voted on in the fork containing `slot` */
  confirmations: number | null;
  /** transaction error, if any */
  err: TransactionError | null;
  /** cluster confirmation status, if data available. Possible responses: `processed`, `confirmed`, `finalized` */
  confirmationStatus?: TransactionConfirmationStatus;
};
/**
 * A confirmed signature with its status
 */
declare type ConfirmedSignatureInfo = {
  /** the transaction signature */
  signature: string;
  /** when the transaction was processed */
  slot: number;
  /** error, if any */
  err: TransactionError | null;
  /** memo associated with the transaction, if any */
  memo: string | null;
  /** The unix timestamp of when the transaction was processed */
  blockTime?: number | null;
};
/**
 * An object defining headers to be passed to the RPC server
 */
declare type HttpHeaders = {
  [header: string]: string;
};
/**
 * A callback used to augment the outgoing HTTP request
 */
declare type FetchMiddleware = (
  url: string,
  options: any,
  fetch: (modifiedUrl: string, modifiedOptions: any) => void,
) => void;
/**
 * Configuration for instantiating a Connection
 */
declare type ConnectionConfig = {
  /** Optional commitment level */
  commitment?: Commitment;
  /** Optional endpoint URL to the fullnode JSON RPC PubSub WebSocket Endpoint */
  wsEndpoint?: string;
  /** Optional HTTP headers object */
  httpHeaders?: HttpHeaders;
  /** Optional custom fetch function */
  fetch?: typeof fetch;
  /** Optional fetch middleware callback */
  fetchMiddleware?: FetchMiddleware;
  /** Optional Disable retrying calls when server responds with HTTP 429 (Too Many Requests) */
  disableRetryOnRateLimit?: boolean;
  /** time to allow for the server to initially process a transaction (in milliseconds) */
  confirmTransactionInitialTimeout?: number;
};
/**
 * A connection to a fullnode JSON RPC endpoint
 */
declare class Connection {
  /**
   * Establish a JSON RPC connection
   *
   * @param endpoint URL to the fullnode JSON RPC endpoint
   * @param commitmentOrConfig optional default commitment level or optional ConnectionConfig configuration object
   */
  constructor(
    endpoint: string,
    commitmentOrConfig?: Commitment | ConnectionConfig,
  );
  /**
   * The default commitment used for requests
   */
  get commitment(): Commitment | undefined;
  /**
   * The RPC endpoint
   */
  get rpcEndpoint(): string;
  /**
   * Fetch the balance for the specified public key, return with context
   */
  getBalanceAndContext(
    publicKey: PublicKey,
    commitment?: Commitment,
  ): Promise<RpcResponseAndContext<number>>;
  /**
   * Fetch the balance for the specified public key
   */
  getBalance(publicKey: PublicKey, commitment?: Commitment): Promise<number>;
  /**
   * Fetch the estimated production time of a block
   */
  getBlockTime(slot: number): Promise<number | null>;
  /**
   * Fetch the lowest slot that the node has information about in its ledger.
   * This value may increase over time if the node is configured to purge older ledger data
   */
  getMinimumLedgerSlot(): Promise<number>;
  /**
   * Fetch the slot of the lowest confirmed block that has not been purged from the ledger
   */
  getFirstAvailableBlock(): Promise<number>;
  /**
   * Fetch information about the current supply
   */
  getSupply(
    config?: GetSupplyConfig | Commitment,
  ): Promise<RpcResponseAndContext<Supply>>;
  /**
   * Fetch the current supply of a token mint
   */
  getTokenSupply(
    tokenMintAddress: PublicKey,
    commitment?: Commitment,
  ): Promise<RpcResponseAndContext<TokenAmount>>;
  /**
   * Fetch the current balance of a token account
   */
  getTokenAccountBalance(
    tokenAddress: PublicKey,
    commitment?: Commitment,
  ): Promise<RpcResponseAndContext<TokenAmount>>;
  /**
   * Fetch all the token accounts owned by the specified account
   *
   * @return {Promise<RpcResponseAndContext<Array<{pubkey: PublicKey, account: AccountInfo<Buffer>}>>>}
   */
  getTokenAccountsByOwner(
    ownerAddress: PublicKey,
    filter: TokenAccountsFilter,
    commitment?: Commitment,
  ): Promise<
    RpcResponseAndContext<
      Array<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer>;
      }>
    >
  >;
  /**
   * Fetch parsed token accounts owned by the specified account
   *
   * @return {Promise<RpcResponseAndContext<Array<{pubkey: PublicKey, account: AccountInfo<ParsedAccountData>}>>>}
   */
  getParsedTokenAccountsByOwner(
    ownerAddress: PublicKey,
    filter: TokenAccountsFilter,
    commitment?: Commitment,
  ): Promise<
    RpcResponseAndContext<
      Array<{
        pubkey: PublicKey;
        account: AccountInfo<ParsedAccountData>;
      }>
    >
  >;
  /**
   * Fetch the 20 largest accounts with their current balances
   */
  getLargestAccounts(
    config?: GetLargestAccountsConfig,
  ): Promise<RpcResponseAndContext<Array<AccountBalancePair>>>;
  /**
   * Fetch the 20 largest token accounts with their current balances
   * for a given mint.
   */
  getTokenLargestAccounts(
    mintAddress: PublicKey,
    commitment?: Commitment,
  ): Promise<RpcResponseAndContext<Array<TokenAccountBalancePair>>>;
  /**
   * Fetch all the account info for the specified public key, return with context
   */
  getAccountInfoAndContext(
    publicKey: PublicKey,
    commitment?: Commitment,
  ): Promise<RpcResponseAndContext<AccountInfo<Buffer> | null>>;
  /**
   * Fetch parsed account info for the specified public key
   */
  getParsedAccountInfo(
    publicKey: PublicKey,
    commitment?: Commitment,
  ): Promise<
    RpcResponseAndContext<AccountInfo<Buffer | ParsedAccountData> | null>
  >;
  /**
   * Fetch all the account info for the specified public key
   */
  getAccountInfo(
    publicKey: PublicKey,
    commitment?: Commitment,
  ): Promise<AccountInfo<Buffer> | null>;
  /**
   * Fetch all the account info for multiple accounts specified by an array of public keys, return with context
   */
  getMultipleAccountsInfoAndContext(
    publicKeys: PublicKey[],
    commitment?: Commitment,
  ): Promise<RpcResponseAndContext<(AccountInfo<Buffer> | null)[]>>;
  /**
   * Fetch all the account info for multiple accounts specified by an array of public keys
   */
  getMultipleAccountsInfo(
    publicKeys: PublicKey[],
    commitment?: Commitment,
  ): Promise<(AccountInfo<Buffer> | null)[]>;
  /**
   * Returns epoch activation information for a stake account that has been delegated
   */
  getStakeActivation(
    publicKey: PublicKey,
    commitment?: Commitment,
    epoch?: number,
  ): Promise<StakeActivationData>;
  /**
   * Fetch all the accounts owned by the specified program id
   *
   * @return {Promise<Array<{pubkey: PublicKey, account: AccountInfo<Buffer>}>>}
   */
  getProgramAccounts(
    programId: PublicKey,
    configOrCommitment?: GetProgramAccountsConfig | Commitment,
  ): Promise<
    Array<{
      pubkey: PublicKey;
      account: AccountInfo<Buffer>;
    }>
  >;
  /**
   * Fetch and parse all the accounts owned by the specified program id
   *
   * @return {Promise<Array<{pubkey: PublicKey, account: AccountInfo<Buffer | ParsedAccountData>}>>}
   */
  getParsedProgramAccounts(
    programId: PublicKey,
    configOrCommitment?: GetParsedProgramAccountsConfig | Commitment,
  ): Promise<
    Array<{
      pubkey: PublicKey;
      account: AccountInfo<Buffer | ParsedAccountData>;
    }>
  >;
  /**
   * Confirm the transaction identified by the specified signature.
   */
  confirmTransaction(
    signature: TransactionSignature,
    commitment?: Commitment,
  ): Promise<RpcResponseAndContext<SignatureResult>>;
  /**
   * Return the list of nodes that are currently participating in the cluster
   */
  getClusterNodes(): Promise<Array<ContactInfo>>;
  /**
   * Return the list of nodes that are currently participating in the cluster
   */
  getVoteAccounts(commitment?: Commitment): Promise<VoteAccountStatus>;
  /**
   * Fetch the current slot that the node is processing
   */
  getSlot(commitment?: Commitment): Promise<number>;
  /**
   * Fetch the current slot leader of the cluster
   */
  getSlotLeader(commitment?: Commitment): Promise<string>;
  /**
   * Fetch `limit` number of slot leaders starting from `startSlot`
   *
   * @param startSlot fetch slot leaders starting from this slot
   * @param limit number of slot leaders to return
   */
  getSlotLeaders(startSlot: number, limit: number): Promise<Array<PublicKey>>;
  /**
   * Fetch the current status of a signature
   */
  getSignatureStatus(
    signature: TransactionSignature,
    config?: SignatureStatusConfig,
  ): Promise<RpcResponseAndContext<SignatureStatus | null>>;
  /**
   * Fetch the current statuses of a batch of signatures
   */
  getSignatureStatuses(
    signatures: Array<TransactionSignature>,
    config?: SignatureStatusConfig,
  ): Promise<RpcResponseAndContext<Array<SignatureStatus | null>>>;
  /**
   * Fetch the current transaction count of the cluster
   */
  getTransactionCount(commitment?: Commitment): Promise<number>;
  /**
   * Fetch the current total currency supply of the cluster in lamports
   *
   * @deprecated Deprecated since v1.2.8. Please use {@link getSupply} instead.
   */
  getTotalSupply(commitment?: Commitment): Promise<number>;
  /**
   * Fetch the cluster InflationGovernor parameters
   */
  getInflationGovernor(commitment?: Commitment): Promise<InflationGovernor>;
  /**
   * Fetch the inflation reward for a list of addresses for an epoch
   */
  getInflationReward(
    addresses: PublicKey[],
    epoch?: number,
    commitment?: Commitment,
  ): Promise<(InflationReward | null)[]>;
  /**
   * Fetch the Epoch Info parameters
   */
  getEpochInfo(commitment?: Commitment): Promise<EpochInfo>;
  /**
   * Fetch the Epoch Schedule parameters
   */
  getEpochSchedule(): Promise<EpochSchedule>;
  /**
   * Fetch the leader schedule for the current epoch
   * @return {Promise<RpcResponseAndContext<LeaderSchedule>>}
   */
  getLeaderSchedule(): Promise<LeaderSchedule>;
  /**
   * Fetch the minimum balance needed to exempt an account of `dataLength`
   * size from rent
   */
  getMinimumBalanceForRentExemption(
    dataLength: number,
    commitment?: Commitment,
  ): Promise<number>;
  /**
   * Fetch a recent blockhash from the cluster, return with context
   * @return {Promise<RpcResponseAndContext<{blockhash: Blockhash, feeCalculator: FeeCalculator}>>}
   *
   * @deprecated Deprecated since Solana v1.8.0. Please use {@link getLatestBlockhash} instead.
   */
  getRecentBlockhashAndContext(commitment?: Commitment): Promise<
    RpcResponseAndContext<{
      blockhash: Blockhash;
      feeCalculator: FeeCalculator;
    }>
  >;
  /**
   * Fetch recent performance samples
   * @return {Promise<Array<PerfSample>>}
   */
  getRecentPerformanceSamples(limit?: number): Promise<Array<PerfSample>>;
  /**
   * Fetch the fee calculator for a recent blockhash from the cluster, return with context
   *
   * @deprecated Deprecated since Solana v1.8.0. Please use {@link getFeeForMessage} instead.
   */
  getFeeCalculatorForBlockhash(
    blockhash: Blockhash,
    commitment?: Commitment,
  ): Promise<RpcResponseAndContext<FeeCalculator | null>>;
  /**
   * Fetch the fee for a message from the cluster, return with context
   */
  getFeeForMessage(
    message: Message,
    commitment?: Commitment,
  ): Promise<RpcResponseAndContext<number>>;
  /**
   * Fetch a recent blockhash from the cluster
   * @return {Promise<{blockhash: Blockhash, feeCalculator: FeeCalculator}>}
   *
   * @deprecated Deprecated since Solana v1.8.0. Please use {@link getLatestBlockhash} instead.
   */
  getRecentBlockhash(commitment?: Commitment): Promise<{
    blockhash: Blockhash;
    feeCalculator: FeeCalculator;
  }>;
  /**
   * Fetch the latest blockhash from the cluster
   * @return {Promise<{blockhash: Blockhash, lastValidBlockHeight: number}>}
   */
  getLatestBlockhash(commitment?: Commitment): Promise<{
    blockhash: Blockhash;
    lastValidBlockHeight: number;
  }>;
  /**
   * Fetch the latest blockhash from the cluster
   * @return {Promise<{blockhash: Blockhash, lastValidBlockHeight: number}>}
   */
  getLatestBlockhashAndContext(commitment?: Commitment): Promise<
    RpcResponseAndContext<{
      blockhash: Blockhash;
      lastValidBlockHeight: number;
    }>
  >;
  /**
   * Fetch the node version
   */
  getVersion(): Promise<Version>;
  /**
   * Fetch the genesis hash
   */
  getGenesisHash(): Promise<string>;
  /**
   * Fetch a processed block from the cluster.
   */
  getBlock(
    slot: number,
    opts?: {
      commitment?: Finality;
    },
  ): Promise<BlockResponse | null>;
  getBlockHeight(commitment?: Commitment): Promise<number>;
  getBlockProduction(
    configOrCommitment?: GetBlockProductionConfig | Commitment,
  ): Promise<RpcResponseAndContext<BlockProduction>>;
  /**
   * Fetch a confirmed or finalized transaction from the cluster.
   */
  getTransaction(
    signature: string,
    opts?: {
      commitment?: Finality;
    },
  ): Promise<TransactionResponse | null>;
  /**
   * Fetch parsed transaction details for a confirmed or finalized transaction
   */
  getParsedTransaction(
    signature: TransactionSignature,
    commitment?: Finality,
  ): Promise<ParsedConfirmedTransaction | null>;
  /**
   * Fetch parsed transaction details for a batch of confirmed transactions
   */
  getParsedTransactions(
    signatures: TransactionSignature[],
    commitment?: Finality,
  ): Promise<(ParsedConfirmedTransaction | null)[]>;
  /**
   * Fetch transaction details for a batch of confirmed transactions.
   * Similar to {@link getParsedTransactions} but returns a {@link TransactionResponse}.
   */
  getTransactions(
    signatures: TransactionSignature[],
    commitment?: Finality,
  ): Promise<(TransactionResponse | null)[]>;
  /**
   * Fetch a list of Transactions and transaction statuses from the cluster
   * for a confirmed block.
   *
   * @deprecated Deprecated since v1.13.0. Please use {@link getBlock} instead.
   */
  getConfirmedBlock(
    slot: number,
    commitment?: Finality,
  ): Promise<ConfirmedBlock>;
  /**
   * Fetch confirmed blocks between two slots
   */
  getBlocks(
    startSlot: number,
    endSlot?: number,
    commitment?: Finality,
  ): Promise<Array<number>>;
  /**
   * Fetch a list of Signatures from the cluster for a block, excluding rewards
   */
  getBlockSignatures(
    slot: number,
    commitment?: Finality,
  ): Promise<BlockSignatures>;
  /**
   * Fetch a list of Signatures from the cluster for a confirmed block, excluding rewards
   *
   * @deprecated Deprecated since Solana v1.8.0. Please use {@link getBlockSignatures} instead.
   */
  getConfirmedBlockSignatures(
    slot: number,
    commitment?: Finality,
  ): Promise<BlockSignatures>;
  /**
   * Fetch a transaction details for a confirmed transaction
   *
   * @deprecated Deprecated since Solana v1.8.0. Please use {@link getTransaction} instead.
   */
  getConfirmedTransaction(
    signature: TransactionSignature,
    commitment?: Finality,
  ): Promise<ConfirmedTransaction | null>;
  /**
   * Fetch parsed transaction details for a confirmed transaction
   *
   * @deprecated Deprecated since Solana v1.8.0. Please use {@link getParsedTransaction} instead.
   */
  getParsedConfirmedTransaction(
    signature: TransactionSignature,
    commitment?: Finality,
  ): Promise<ParsedConfirmedTransaction | null>;
  /**
   * Fetch parsed transaction details for a batch of confirmed transactions
   *
   * @deprecated Deprecated since Solana v1.8.0. Please use {@link getParsedTransactions} instead.
   */
  getParsedConfirmedTransactions(
    signatures: TransactionSignature[],
    commitment?: Finality,
  ): Promise<(ParsedConfirmedTransaction | null)[]>;
  /**
   * Fetch a list of all the confirmed signatures for transactions involving an address
   * within a specified slot range. Max range allowed is 10,000 slots.
   *
   * @deprecated Deprecated since v1.3. Please use {@link getConfirmedSignaturesForAddress2} instead.
   *
   * @param address queried address
   * @param startSlot start slot, inclusive
   * @param endSlot end slot, inclusive
   */
  getConfirmedSignaturesForAddress(
    address: PublicKey,
    startSlot: number,
    endSlot: number,
  ): Promise<Array<TransactionSignature>>;
  /**
   * Returns confirmed signatures for transactions involving an
   * address backwards in time from the provided signature or most recent confirmed block
   *
   *
   * @param address queried address
   * @param options
   */
  getConfirmedSignaturesForAddress2(
    address: PublicKey,
    options?: ConfirmedSignaturesForAddress2Options,
    commitment?: Finality,
  ): Promise<Array<ConfirmedSignatureInfo>>;
  /**
   * Returns confirmed signatures for transactions involving an
   * address backwards in time from the provided signature or most recent confirmed block
   *
   *
   * @param address queried address
   * @param options
   */
  getSignaturesForAddress(
    address: PublicKey,
    options?: SignaturesForAddressOptions,
    commitment?: Finality,
  ): Promise<Array<ConfirmedSignatureInfo>>;
  /**
   * Fetch the contents of a Nonce account from the cluster, return with context
   */
  getNonceAndContext(
    nonceAccount: PublicKey,
    commitment?: Commitment,
  ): Promise<RpcResponseAndContext<NonceAccount | null>>;
  /**
   * Fetch the contents of a Nonce account from the cluster
   */
  getNonce(
    nonceAccount: PublicKey,
    commitment?: Commitment,
  ): Promise<NonceAccount | null>;
  /**
   * Request an allocation of lamports to the specified address
   *
   * ```typescript
   * import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
   *
   * (async () => {
   *   const connection = new Connection("https://api.testnet.solana.com", "confirmed");
   *   const myAddress = new PublicKey("2nr1bHFT86W9tGnyvmYW4vcHKsQB3sVQfnddasz4kExM");
   *   const signature = await connection.requestAirdrop(myAddress, LAMPORTS_PER_SOL);
   *   await connection.confirmTransaction(signature);
   * })();
   * ```
   */
  requestAirdrop(
    to: PublicKey,
    lamports: number,
  ): Promise<TransactionSignature>;
  /**
   * Simulate a transaction
   */
  simulateTransaction(
    transactionOrMessage: Transaction | Message,
    signers?: Array<Signer>,
    includeAccounts?: boolean | Array<PublicKey>,
  ): Promise<RpcResponseAndContext<SimulatedTransactionResponse>>;
  /**
   * Sign and send a transaction
   */
  sendTransaction(
    transaction: Transaction,
    signers: Array<Signer>,
    options?: SendOptions,
  ): Promise<TransactionSignature>;
  /**
   * Send a transaction that has already been signed and serialized into the
   * wire format
   */
  sendRawTransaction(
    rawTransaction: Buffer | Uint8Array | Array<number>,
    options?: SendOptions,
  ): Promise<TransactionSignature>;
  /**
   * Send a transaction that has already been signed, serialized into the
   * wire format, and encoded as a base64 string
   */
  sendEncodedTransaction(
    encodedTransaction: string,
    options?: SendOptions,
  ): Promise<TransactionSignature>;
  /**
   * Register a callback to be invoked whenever the specified account changes
   *
   * @param publicKey Public key of the account to monitor
   * @param callback Function to invoke whenever the account is changed
   * @param commitment Specify the commitment level account changes must reach before notification
   * @return subscription id
   */
  onAccountChange(
    publicKey: PublicKey,
    callback: AccountChangeCallback,
    commitment?: Commitment,
  ): number;
  /**
   * Deregister an account notification callback
   *
   * @param id subscription id to deregister
   */
  removeAccountChangeListener(id: number): Promise<void>;
  /**
   * Register a callback to be invoked whenever accounts owned by the
   * specified program change
   *
   * @param programId Public key of the program to monitor
   * @param callback Function to invoke whenever the account is changed
   * @param commitment Specify the commitment level account changes must reach before notification
   * @param filters The program account filters to pass into the RPC method
   * @return subscription id
   */
  onProgramAccountChange(
    programId: PublicKey,
    callback: ProgramAccountChangeCallback,
    commitment?: Commitment,
    filters?: GetProgramAccountsFilter[],
  ): number;
  /**
   * Deregister an account notification callback
   *
   * @param id subscription id to deregister
   */
  removeProgramAccountChangeListener(id: number): Promise<void>;
  /**
   * Registers a callback to be invoked whenever logs are emitted.
   */
  onLogs(
    filter: LogsFilter,
    callback: LogsCallback,
    commitment?: Commitment,
  ): number;
  /**
   * Deregister a logs callback.
   *
   * @param id subscription id to deregister.
   */
  removeOnLogsListener(id: number): Promise<void>;
  /**
   * Register a callback to be invoked upon slot changes
   *
   * @param callback Function to invoke whenever the slot changes
   * @return subscription id
   */
  onSlotChange(callback: SlotChangeCallback): number;
  /**
   * Deregister a slot notification callback
   *
   * @param id subscription id to deregister
   */
  removeSlotChangeListener(id: number): Promise<void>;
  /**
   * Register a callback to be invoked upon slot updates. {@link SlotUpdate}'s
   * may be useful to track live progress of a cluster.
   *
   * @param callback Function to invoke whenever the slot updates
   * @return subscription id
   */
  onSlotUpdate(callback: SlotUpdateCallback): number;
  /**
   * Deregister a slot update notification callback
   *
   * @param id subscription id to deregister
   */
  removeSlotUpdateListener(id: number): Promise<void>;
  _buildArgs(
    args: Array<any>,
    override?: Commitment,
    encoding?: 'jsonParsed' | 'base64',
    extra?: any,
  ): Array<any>;
  /**
   * Register a callback to be invoked upon signature updates
   *
   * @param signature Transaction signature string in base 58
   * @param callback Function to invoke on signature notifications
   * @param commitment Specify the commitment level signature must reach before notification
   * @return subscription id
   */
  onSignature(
    signature: TransactionSignature,
    callback: SignatureResultCallback,
    commitment?: Commitment,
  ): number;
  /**
   * Register a callback to be invoked when a transaction is
   * received and/or processed.
   *
   * @param signature Transaction signature string in base 58
   * @param callback Function to invoke on signature notifications
   * @param options Enable received notifications and set the commitment
   *   level that signature must reach before notification
   * @return subscription id
   */
  onSignatureWithOptions(
    signature: TransactionSignature,
    callback: SignatureSubscriptionCallback,
    options?: SignatureSubscriptionOptions,
  ): number;
  /**
   * Deregister a signature notification callback
   *
   * @param id subscription id to deregister
   */
  removeSignatureListener(id: number): Promise<void>;
  /**
   * Register a callback to be invoked upon root changes
   *
   * @param callback Function to invoke whenever the root changes
   * @return subscription id
   */
  onRootChange(callback: RootChangeCallback): number;
  /**
   * Deregister a root notification callback
   *
   * @param id subscription id to deregister
   */
  removeRootChangeListener(id: number): Promise<void>;
}

declare const BPF_LOADER_PROGRAM_ID: PublicKey;
/**
 * Factory class for transactions to interact with a program loader
 */
declare class BpfLoader {
  /**
   * Minimum number of signatures required to load a program not including
   * retries
   *
   * Can be used to calculate transaction fees
   */
  static getMinNumSignatures(dataLength: number): number;
  /**
   * Load a BPF program
   *
   * @param connection The connection to use
   * @param payer Account that will pay program loading fees
   * @param program Account to load the program into
   * @param elf The entire ELF containing the BPF program
   * @param loaderProgramId The program id of the BPF loader to use
   * @return true if program was loaded successfully, false if program was already loaded
   */
  static load(
    connection: Connection,
    payer: Signer,
    program: Signer,
    elf: Buffer | Uint8Array | Array<number>,
    loaderProgramId: PublicKey,
  ): Promise<boolean>;
}

/**
 * Compute Budget Instruction class
 */
declare class ComputeBudgetInstruction {
  /**
   * Decode a compute budget instruction and retrieve the instruction type.
   */
  static decodeInstructionType(
    instruction: TransactionInstruction,
  ): ComputeBudgetInstructionType;
  /**
   * Decode request units compute budget instruction and retrieve the instruction params.
   */
  static decodeRequestUnits(
    instruction: TransactionInstruction,
  ): RequestUnitsParams;
  /**
   * Decode request heap frame compute budget instruction and retrieve the instruction params.
   */
  static decodeRequestHeapFrame(
    instruction: TransactionInstruction,
  ): RequestHeapFrameParams;
}
/**
 * An enumeration of valid ComputeBudgetInstructionType's
 */
declare type ComputeBudgetInstructionType = 'RequestUnits' | 'RequestHeapFrame';
/**
 * Request units instruction params
 */
interface RequestUnitsParams {
  /** Units to request for transaction-wide compute */
  units: number;
  /** Additional fee to pay */
  additionalFee: number;
}
/**
 * Request heap frame instruction params
 */
declare type RequestHeapFrameParams = {
  /** Requested transaction-wide program heap size in bytes. Must be multiple of 1024. Applies to each program, including CPIs. */
  bytes: number;
};
/**
 * Factory class for transaction instructions to interact with the Compute Budget program
 */
declare class ComputeBudgetProgram {
  /**
   * Public key that identifies the Compute Budget program
   */
  static programId: PublicKey;
  static requestUnits(params: RequestUnitsParams): TransactionInstruction;
  static requestHeapFrame(
    params: RequestHeapFrameParams,
  ): TransactionInstruction;
}

/**
 * Params for creating an ed25519 instruction using a public key
 */
declare type CreateEd25519InstructionWithPublicKeyParams = {
  publicKey: Uint8Array;
  message: Uint8Array;
  signature: Uint8Array;
  instructionIndex?: number;
};
/**
 * Params for creating an ed25519 instruction using a private key
 */
declare type CreateEd25519InstructionWithPrivateKeyParams = {
  privateKey: Uint8Array;
  message: Uint8Array;
  instructionIndex?: number;
};
declare class Ed25519Program {
  /**
   * Public key that identifies the ed25519 program
   */
  static programId: PublicKey;
  /**
   * Create an ed25519 instruction with a public key and signature. The
   * public key must be a buffer that is 32 bytes long, and the signature
   * must be a buffer of 64 bytes.
   */
  static createInstructionWithPublicKey(
    params: CreateEd25519InstructionWithPublicKeyParams,
  ): TransactionInstruction;
  /**
   * Create an ed25519 instruction with a private key. The private key
   * must be a buffer that is 64 bytes long.
   */
  static createInstructionWithPrivateKey(
    params: CreateEd25519InstructionWithPrivateKeyParams,
  ): TransactionInstruction;
}

/**
 * Program loader interface
 */
declare class Loader {
  /**
   * Amount of program data placed in each load Transaction
   */
  static chunkSize: number;
  /**
   * Minimum number of signatures required to load a program not including
   * retries
   *
   * Can be used to calculate transaction fees
   */
  static getMinNumSignatures(dataLength: number): number;
  /**
   * Loads a generic program
   *
   * @param connection The connection to use
   * @param payer System account that pays to load the program
   * @param program Account to load the program into
   * @param programId Public key that identifies the loader
   * @param data Program octets
   * @return true if program was loaded successfully, false if program was already loaded
   */
  static load(
    connection: Connection,
    payer: Signer,
    program: Signer,
    programId: PublicKey,
    data: Buffer | Uint8Array | Array<number>,
  ): Promise<boolean>;
}

/**
 * Address of the stake config account which configures the rate
 * of stake warmup and cooldown as well as the slashing penalty.
 */
declare const STAKE_CONFIG_ID: PublicKey;
/**
 * Stake account authority info
 */
declare class Authorized {
  /** stake authority */
  staker: PublicKey;
  /** withdraw authority */
  withdrawer: PublicKey;
  /**
   * Create a new Authorized object
   * @param staker the stake authority
   * @param withdrawer the withdraw authority
   */
  constructor(staker: PublicKey, withdrawer: PublicKey);
}
/**
 * Stake account lockup info
 */
declare class Lockup {
  /** Unix timestamp of lockup expiration */
  unixTimestamp: number;
  /** Epoch of lockup expiration */
  epoch: number;
  /** Lockup custodian authority */
  custodian: PublicKey;
  /**
   * Create a new Lockup object
   */
  constructor(unixTimestamp: number, epoch: number, custodian: PublicKey);
  /**
   * Default, inactive Lockup value
   */
  static default: Lockup;
}
/**
 * Create stake account transaction params
 */
declare type CreateStakeAccountParams = {
  /** Address of the account which will fund creation */
  fromPubkey: PublicKey;
  /** Address of the new stake account */
  stakePubkey: PublicKey;
  /** Authorities of the new stake account */
  authorized: Authorized;
  /** Lockup of the new stake account */
  lockup?: Lockup;
  /** Funding amount */
  lamports: number;
};
/**
 * Create stake account with seed transaction params
 */
declare type CreateStakeAccountWithSeedParams = {
  fromPubkey: PublicKey;
  stakePubkey: PublicKey;
  basePubkey: PublicKey;
  seed: string;
  authorized: Authorized;
  lockup?: Lockup;
  lamports: number;
};
/**
 * Initialize stake instruction params
 */
declare type InitializeStakeParams = {
  stakePubkey: PublicKey;
  authorized: Authorized;
  lockup?: Lockup;
};
/**
 * Delegate stake instruction params
 */
declare type DelegateStakeParams = {
  stakePubkey: PublicKey;
  authorizedPubkey: PublicKey;
  votePubkey: PublicKey;
};
/**
 * Authorize stake instruction params
 */
declare type AuthorizeStakeParams = {
  stakePubkey: PublicKey;
  authorizedPubkey: PublicKey;
  newAuthorizedPubkey: PublicKey;
  stakeAuthorizationType: StakeAuthorizationType;
  custodianPubkey?: PublicKey;
};
/**
 * Authorize stake instruction params using a derived key
 */
declare type AuthorizeWithSeedStakeParams = {
  stakePubkey: PublicKey;
  authorityBase: PublicKey;
  authoritySeed: string;
  authorityOwner: PublicKey;
  newAuthorizedPubkey: PublicKey;
  stakeAuthorizationType: StakeAuthorizationType;
  custodianPubkey?: PublicKey;
};
/**
 * Split stake instruction params
 */
declare type SplitStakeParams = {
  stakePubkey: PublicKey;
  authorizedPubkey: PublicKey;
  splitStakePubkey: PublicKey;
  lamports: number;
};
/**
 * Split with seed transaction params
 */
declare type SplitStakeWithSeedParams = {
  stakePubkey: PublicKey;
  authorizedPubkey: PublicKey;
  splitStakePubkey: PublicKey;
  basePubkey: PublicKey;
  seed: string;
  lamports: number;
};
/**
 * Withdraw stake instruction params
 */
declare type WithdrawStakeParams = {
  stakePubkey: PublicKey;
  authorizedPubkey: PublicKey;
  toPubkey: PublicKey;
  lamports: number;
  custodianPubkey?: PublicKey;
};
/**
 * Deactivate stake instruction params
 */
declare type DeactivateStakeParams = {
  stakePubkey: PublicKey;
  authorizedPubkey: PublicKey;
};
/**
 * Merge stake instruction params
 */
declare type MergeStakeParams = {
  stakePubkey: PublicKey;
  sourceStakePubKey: PublicKey;
  authorizedPubkey: PublicKey;
};
/**
 * Stake Instruction class
 */
declare class StakeInstruction {
  /**
   * Decode a stake instruction and retrieve the instruction type.
   */
  static decodeInstructionType(
    instruction: TransactionInstruction,
  ): StakeInstructionType;
  /**
   * Decode a initialize stake instruction and retrieve the instruction params.
   */
  static decodeInitialize(
    instruction: TransactionInstruction,
  ): InitializeStakeParams;
  /**
   * Decode a delegate stake instruction and retrieve the instruction params.
   */
  static decodeDelegate(
    instruction: TransactionInstruction,
  ): DelegateStakeParams;
  /**
   * Decode an authorize stake instruction and retrieve the instruction params.
   */
  static decodeAuthorize(
    instruction: TransactionInstruction,
  ): AuthorizeStakeParams;
  /**
   * Decode an authorize-with-seed stake instruction and retrieve the instruction params.
   */
  static decodeAuthorizeWithSeed(
    instruction: TransactionInstruction,
  ): AuthorizeWithSeedStakeParams;
  /**
   * Decode a split stake instruction and retrieve the instruction params.
   */
  static decodeSplit(instruction: TransactionInstruction): SplitStakeParams;
  /**
   * Decode a merge stake instruction and retrieve the instruction params.
   */
  static decodeMerge(instruction: TransactionInstruction): MergeStakeParams;
  /**
   * Decode a withdraw stake instruction and retrieve the instruction params.
   */
  static decodeWithdraw(
    instruction: TransactionInstruction,
  ): WithdrawStakeParams;
  /**
   * Decode a deactivate stake instruction and retrieve the instruction params.
   */
  static decodeDeactivate(
    instruction: TransactionInstruction,
  ): DeactivateStakeParams;
}
/**
 * An enumeration of valid StakeInstructionType's
 */
declare type StakeInstructionType =
  | 'Authorize'
  | 'AuthorizeWithSeed'
  | 'Deactivate'
  | 'Delegate'
  | 'Initialize'
  | 'Merge'
  | 'Split'
  | 'Withdraw';
/**
 * Stake authorization type
 */
declare type StakeAuthorizationType = {
  /** The Stake Authorization index (from solana-stake-program) */
  index: number;
};
/**
 * An enumeration of valid StakeAuthorizationLayout's
 */
declare const StakeAuthorizationLayout: Readonly<{
  Staker: {
    index: number;
  };
  Withdrawer: {
    index: number;
  };
}>;
/**
 * Factory class for transactions to interact with the Stake program
 */
declare class StakeProgram {
  /**
   * Public key that identifies the Stake program
   */
  static programId: PublicKey;
  /**
   * Max space of a Stake account
   *
   * This is generated from the solana-stake-program StakeState struct as
   * `StakeState::size_of()`:
   * https://docs.rs/solana-stake-program/latest/solana_stake_program/stake_state/enum.StakeState.html
   */
  static space: number;
  /**
   * Generate an Initialize instruction to add to a Stake Create transaction
   */
  static initialize(params: InitializeStakeParams): TransactionInstruction;
  /**
   * Generate a Transaction that creates a new Stake account at
   *   an address generated with `from`, a seed, and the Stake programId
   */
  static createAccountWithSeed(
    params: CreateStakeAccountWithSeedParams,
  ): Transaction;
  /**
   * Generate a Transaction that creates a new Stake account
   */
  static createAccount(params: CreateStakeAccountParams): Transaction;
  /**
   * Generate a Transaction that delegates Stake tokens to a validator
   * Vote PublicKey. This transaction can also be used to redelegate Stake
   * to a new validator Vote PublicKey.
   */
  static delegate(params: DelegateStakeParams): Transaction;
  /**
   * Generate a Transaction that authorizes a new PublicKey as Staker
   * or Withdrawer on the Stake account.
   */
  static authorize(params: AuthorizeStakeParams): Transaction;
  /**
   * Generate a Transaction that authorizes a new PublicKey as Staker
   * or Withdrawer on the Stake account.
   */
  static authorizeWithSeed(params: AuthorizeWithSeedStakeParams): Transaction;
  /**
   * Generate a Transaction that splits Stake tokens into another stake account
   */
  static split(params: SplitStakeParams): Transaction;
  /**
   * Generate a Transaction that splits Stake tokens into another account
   * derived from a base public key and seed
   */
  static splitWithSeed(params: SplitStakeWithSeedParams): Transaction;
  /**
   * Generate a Transaction that merges Stake accounts.
   */
  static merge(params: MergeStakeParams): Transaction;
  /**
   * Generate a Transaction that withdraws deactivated Stake tokens.
   */
  static withdraw(params: WithdrawStakeParams): Transaction;
  /**
   * Generate a Transaction that deactivates Stake tokens.
   */
  static deactivate(params: DeactivateStakeParams): Transaction;
}

/**
 * Create account system transaction params
 */
declare type CreateAccountParams = {
  /** The account that will transfer lamports to the created account */
  fromPubkey: PublicKey;
  /** Public key of the created account */
  newAccountPubkey: PublicKey;
  /** Amount of lamports to transfer to the created account */
  lamports: number;
  /** Amount of space in bytes to allocate to the created account */
  space: number;
  /** Public key of the program to assign as the owner of the created account */
  programId: PublicKey;
};
/**
 * Transfer system transaction params
 */
declare type TransferParams = {
  /** Account that will transfer lamports */
  fromPubkey: PublicKey;
  /** Account that will receive transferred lamports */
  toPubkey: PublicKey;
  /** Amount of lamports to transfer */
  lamports: number;
};
/**
 * Assign system transaction params
 */
declare type AssignParams = {
  /** Public key of the account which will be assigned a new owner */
  accountPubkey: PublicKey;
  /** Public key of the program to assign as the owner */
  programId: PublicKey;
};
/**
 * Create account with seed system transaction params
 */
declare type CreateAccountWithSeedParams = {
  /** The account that will transfer lamports to the created account */
  fromPubkey: PublicKey;
  /** Public key of the created account. Must be pre-calculated with PublicKey.createWithSeed() */
  newAccountPubkey: PublicKey;
  /** Base public key to use to derive the address of the created account. Must be the same as the base key used to create `newAccountPubkey` */
  basePubkey: PublicKey;
  /** Seed to use to derive the address of the created account. Must be the same as the seed used to create `newAccountPubkey` */
  seed: string;
  /** Amount of lamports to transfer to the created account */
  lamports: number;
  /** Amount of space in bytes to allocate to the created account */
  space: number;
  /** Public key of the program to assign as the owner of the created account */
  programId: PublicKey;
};
/**
 * Create nonce account system transaction params
 */
declare type CreateNonceAccountParams = {
  /** The account that will transfer lamports to the created nonce account */
  fromPubkey: PublicKey;
  /** Public key of the created nonce account */
  noncePubkey: PublicKey;
  /** Public key to set as authority of the created nonce account */
  authorizedPubkey: PublicKey;
  /** Amount of lamports to transfer to the created nonce account */
  lamports: number;
};
/**
 * Create nonce account with seed system transaction params
 */
declare type CreateNonceAccountWithSeedParams = {
  /** The account that will transfer lamports to the created nonce account */
  fromPubkey: PublicKey;
  /** Public key of the created nonce account */
  noncePubkey: PublicKey;
  /** Public key to set as authority of the created nonce account */
  authorizedPubkey: PublicKey;
  /** Amount of lamports to transfer to the created nonce account */
  lamports: number;
  /** Base public key to use to derive the address of the nonce account */
  basePubkey: PublicKey;
  /** Seed to use to derive the address of the nonce account */
  seed: string;
};
/**
 * Initialize nonce account system instruction params
 */
declare type InitializeNonceParams = {
  /** Nonce account which will be initialized */
  noncePubkey: PublicKey;
  /** Public key to set as authority of the initialized nonce account */
  authorizedPubkey: PublicKey;
};
/**
 * Advance nonce account system instruction params
 */
declare type AdvanceNonceParams = {
  /** Nonce account */
  noncePubkey: PublicKey;
  /** Public key of the nonce authority */
  authorizedPubkey: PublicKey;
};
/**
 * Withdraw nonce account system transaction params
 */
declare type WithdrawNonceParams = {
  /** Nonce account */
  noncePubkey: PublicKey;
  /** Public key of the nonce authority */
  authorizedPubkey: PublicKey;
  /** Public key of the account which will receive the withdrawn nonce account balance */
  toPubkey: PublicKey;
  /** Amount of lamports to withdraw from the nonce account */
  lamports: number;
};
/**
 * Authorize nonce account system transaction params
 */
declare type AuthorizeNonceParams = {
  /** Nonce account */
  noncePubkey: PublicKey;
  /** Public key of the current nonce authority */
  authorizedPubkey: PublicKey;
  /** Public key to set as the new nonce authority */
  newAuthorizedPubkey: PublicKey;
};
/**
 * Allocate account system transaction params
 */
declare type AllocateParams = {
  /** Account to allocate */
  accountPubkey: PublicKey;
  /** Amount of space in bytes to allocate */
  space: number;
};
/**
 * Allocate account with seed system transaction params
 */
declare type AllocateWithSeedParams = {
  /** Account to allocate */
  accountPubkey: PublicKey;
  /** Base public key to use to derive the address of the allocated account */
  basePubkey: PublicKey;
  /** Seed to use to derive the address of the allocated account */
  seed: string;
  /** Amount of space in bytes to allocate */
  space: number;
  /** Public key of the program to assign as the owner of the allocated account */
  programId: PublicKey;
};
/**
 * Assign account with seed system transaction params
 */
declare type AssignWithSeedParams = {
  /** Public key of the account which will be assigned a new owner */
  accountPubkey: PublicKey;
  /** Base public key to use to derive the address of the assigned account */
  basePubkey: PublicKey;
  /** Seed to use to derive the address of the assigned account */
  seed: string;
  /** Public key of the program to assign as the owner */
  programId: PublicKey;
};
/**
 * Transfer with seed system transaction params
 */
declare type TransferWithSeedParams = {
  /** Account that will transfer lamports */
  fromPubkey: PublicKey;
  /** Base public key to use to derive the funding account address */
  basePubkey: PublicKey;
  /** Account that will receive transferred lamports */
  toPubkey: PublicKey;
  /** Amount of lamports to transfer */
  lamports: number;
  /** Seed to use to derive the funding account address */
  seed: string;
  /** Program id to use to derive the funding account address */
  programId: PublicKey;
};
/**
 * System Instruction class
 */
declare class SystemInstruction {
  /**
   * Decode a system instruction and retrieve the instruction type.
   */
  static decodeInstructionType(
    instruction: TransactionInstruction,
  ): SystemInstructionType;
  /**
   * Decode a create account system instruction and retrieve the instruction params.
   */
  static decodeCreateAccount(
    instruction: TransactionInstruction,
  ): CreateAccountParams;
  /**
   * Decode a transfer system instruction and retrieve the instruction params.
   */
  static decodeTransfer(instruction: TransactionInstruction): TransferParams;
  /**
   * Decode a transfer with seed system instruction and retrieve the instruction params.
   */
  static decodeTransferWithSeed(
    instruction: TransactionInstruction,
  ): TransferWithSeedParams;
  /**
   * Decode an allocate system instruction and retrieve the instruction params.
   */
  static decodeAllocate(instruction: TransactionInstruction): AllocateParams;
  /**
   * Decode an allocate with seed system instruction and retrieve the instruction params.
   */
  static decodeAllocateWithSeed(
    instruction: TransactionInstruction,
  ): AllocateWithSeedParams;
  /**
   * Decode an assign system instruction and retrieve the instruction params.
   */
  static decodeAssign(instruction: TransactionInstruction): AssignParams;
  /**
   * Decode an assign with seed system instruction and retrieve the instruction params.
   */
  static decodeAssignWithSeed(
    instruction: TransactionInstruction,
  ): AssignWithSeedParams;
  /**
   * Decode a create account with seed system instruction and retrieve the instruction params.
   */
  static decodeCreateWithSeed(
    instruction: TransactionInstruction,
  ): CreateAccountWithSeedParams;
  /**
   * Decode a nonce initialize system instruction and retrieve the instruction params.
   */
  static decodeNonceInitialize(
    instruction: TransactionInstruction,
  ): InitializeNonceParams;
  /**
   * Decode a nonce advance system instruction and retrieve the instruction params.
   */
  static decodeNonceAdvance(
    instruction: TransactionInstruction,
  ): AdvanceNonceParams;
  /**
   * Decode a nonce withdraw system instruction and retrieve the instruction params.
   */
  static decodeNonceWithdraw(
    instruction: TransactionInstruction,
  ): WithdrawNonceParams;
  /**
   * Decode a nonce authorize system instruction and retrieve the instruction params.
   */
  static decodeNonceAuthorize(
    instruction: TransactionInstruction,
  ): AuthorizeNonceParams;
}
/**
 * An enumeration of valid SystemInstructionType's
 */
declare type SystemInstructionType =
  | 'AdvanceNonceAccount'
  | 'Allocate'
  | 'AllocateWithSeed'
  | 'Assign'
  | 'AssignWithSeed'
  | 'AuthorizeNonceAccount'
  | 'Create'
  | 'CreateWithSeed'
  | 'InitializeNonceAccount'
  | 'Transfer'
  | 'TransferWithSeed'
  | 'WithdrawNonceAccount';
/**
 * Factory class for transactions to interact with the System program
 */
declare class SystemProgram {
  /**
   * Public key that identifies the System program
   */
  static programId: PublicKey;
  /**
   * Generate a transaction instruction that creates a new account
   */
  static createAccount(params: CreateAccountParams): TransactionInstruction;
  /**
   * Generate a transaction instruction that transfers lamports from one account to another
   */
  static transfer(
    params: TransferParams | TransferWithSeedParams,
  ): TransactionInstruction;
  /**
   * Generate a transaction instruction that assigns an account to a program
   */
  static assign(
    params: AssignParams | AssignWithSeedParams,
  ): TransactionInstruction;
  /**
   * Generate a transaction instruction that creates a new account at
   *   an address generated with `from`, a seed, and programId
   */
  static createAccountWithSeed(
    params: CreateAccountWithSeedParams,
  ): TransactionInstruction;
  /**
   * Generate a transaction that creates a new Nonce account
   */
  static createNonceAccount(
    params: CreateNonceAccountParams | CreateNonceAccountWithSeedParams,
  ): Transaction;
  /**
   * Generate an instruction to initialize a Nonce account
   */
  static nonceInitialize(params: InitializeNonceParams): TransactionInstruction;
  /**
   * Generate an instruction to advance the nonce in a Nonce account
   */
  static nonceAdvance(params: AdvanceNonceParams): TransactionInstruction;
  /**
   * Generate a transaction instruction that withdraws lamports from a Nonce account
   */
  static nonceWithdraw(params: WithdrawNonceParams): TransactionInstruction;
  /**
   * Generate a transaction instruction that authorizes a new PublicKey as the authority
   * on a Nonce account.
   */
  static nonceAuthorize(params: AuthorizeNonceParams): TransactionInstruction;
  /**
   * Generate a transaction instruction that allocates space in an account without funding
   */
  static allocate(
    params: AllocateParams | AllocateWithSeedParams,
  ): TransactionInstruction;
}

/**
 * Params for creating an secp256k1 instruction using a public key
 */
declare type CreateSecp256k1InstructionWithPublicKeyParams = {
  publicKey: Buffer | Uint8Array | Array<number>;
  message: Buffer | Uint8Array | Array<number>;
  signature: Buffer | Uint8Array | Array<number>;
  recoveryId: number;
  instructionIndex?: number;
};
/**
 * Params for creating an secp256k1 instruction using an Ethereum address
 */
declare type CreateSecp256k1InstructionWithEthAddressParams = {
  ethAddress: Buffer | Uint8Array | Array<number> | string;
  message: Buffer | Uint8Array | Array<number>;
  signature: Buffer | Uint8Array | Array<number>;
  recoveryId: number;
  instructionIndex?: number;
};
/**
 * Params for creating an secp256k1 instruction using a private key
 */
declare type CreateSecp256k1InstructionWithPrivateKeyParams = {
  privateKey: Buffer | Uint8Array | Array<number>;
  message: Buffer | Uint8Array | Array<number>;
  instructionIndex?: number;
};
declare class Secp256k1Program {
  /**
   * Public key that identifies the secp256k1 program
   */
  static programId: PublicKey;
  /**
   * Construct an Ethereum address from a secp256k1 public key buffer.
   * @param {Buffer} publicKey a 64 byte secp256k1 public key buffer
   */
  static publicKeyToEthAddress(
    publicKey: Buffer | Uint8Array | Array<number>,
  ): Buffer;
  /**
   * Create an secp256k1 instruction with a public key. The public key
   * must be a buffer that is 64 bytes long.
   */
  static createInstructionWithPublicKey(
    params: CreateSecp256k1InstructionWithPublicKeyParams,
  ): TransactionInstruction;
  /**
   * Create an secp256k1 instruction with an Ethereum address. The address
   * must be a hex string or a buffer that is 20 bytes long.
   */
  static createInstructionWithEthAddress(
    params: CreateSecp256k1InstructionWithEthAddressParams,
  ): TransactionInstruction;
  /**
   * Create an secp256k1 instruction with a private key. The private key
   * must be a buffer that is 32 bytes long.
   */
  static createInstructionWithPrivateKey(
    params: CreateSecp256k1InstructionWithPrivateKeyParams,
  ): TransactionInstruction;
}

declare const VALIDATOR_INFO_KEY: PublicKey;
/**
 * Info used to identity validators.
 */
declare type Info = {
  /** validator name */
  name: string;
  /** optional, validator website */
  website?: string;
  /** optional, extra information the validator chose to share */
  details?: string;
  /** optional, used to identify validators on keybase.io */
  keybaseUsername?: string;
};
/**
 * ValidatorInfo class
 */
declare class ValidatorInfo {
  /**
   * validator public key
   */
  key: PublicKey;
  /**
   * validator information
   */
  info: Info;
  /**
   * Construct a valid ValidatorInfo
   *
   * @param key validator public key
   * @param info validator information
   */
  constructor(key: PublicKey, info: Info);
  /**
   * Deserialize ValidatorInfo from the config account data. Exactly two config
   * keys are required in the data.
   *
   * @param buffer config account data
   * @return null if info was not found
   */
  static fromConfigData(
    buffer: Buffer | Uint8Array | Array<number>,
  ): ValidatorInfo | null;
}

declare const VOTE_PROGRAM_ID: PublicKey;
declare type Lockout = {
  slot: number;
  confirmationCount: number;
};
/**
 * History of how many credits earned by the end of each epoch
 */
declare type EpochCredits = Readonly<{
  epoch: number;
  credits: number;
  prevCredits: number;
}>;
declare type AuthorizedVoter = Readonly<{
  epoch: number;
  authorizedVoter: PublicKey;
}>;
declare type PriorVoter = Readonly<{
  authorizedPubkey: PublicKey;
  epochOfLastAuthorizedSwitch: number;
  targetEpoch: number;
}>;
declare type BlockTimestamp = Readonly<{
  slot: number;
  timestamp: number;
}>;
/**
 * VoteAccount class
 */
declare class VoteAccount {
  nodePubkey: PublicKey;
  authorizedWithdrawer: PublicKey;
  commission: number;
  rootSlot: number | null;
  votes: Lockout[];
  authorizedVoters: AuthorizedVoter[];
  priorVoters: PriorVoter[];
  epochCredits: EpochCredits[];
  lastTimestamp: BlockTimestamp;
  /**
   * Deserialize VoteAccount from the account data.
   *
   * @param buffer account data
   * @return VoteAccount
   */
  static fromAccountData(
    buffer: Buffer | Uint8Array | Array<number>,
  ): VoteAccount;
}

/**
 * Vote account info
 */
declare class VoteInit {
  nodePubkey: PublicKey;
  authorizedVoter: PublicKey;
  authorizedWithdrawer: PublicKey;
  commission: number; /** [0, 100] */
  constructor(
    nodePubkey: PublicKey,
    authorizedVoter: PublicKey,
    authorizedWithdrawer: PublicKey,
    commission: number,
  );
}
/**
 * Create vote account transaction params
 */
declare type CreateVoteAccountParams = {
  fromPubkey: PublicKey;
  votePubkey: PublicKey;
  voteInit: VoteInit;
  lamports: number;
};
/**
 * InitializeAccount instruction params
 */
declare type InitializeAccountParams = {
  votePubkey: PublicKey;
  nodePubkey: PublicKey;
  voteInit: VoteInit;
};
/**
 * Authorize instruction params
 */
declare type AuthorizeVoteParams = {
  votePubkey: PublicKey;
  /** Current vote or withdraw authority, depending on `voteAuthorizationType` */
  authorizedPubkey: PublicKey;
  newAuthorizedPubkey: PublicKey;
  voteAuthorizationType: VoteAuthorizationType;
};
/**
 * Withdraw from vote account transaction params
 */
declare type WithdrawFromVoteAccountParams = {
  votePubkey: PublicKey;
  authorizedWithdrawerPubkey: PublicKey;
  lamports: number;
  toPubkey: PublicKey;
};
/**
 * Vote Instruction class
 */
declare class VoteInstruction {
  /**
   * Decode a vote instruction and retrieve the instruction type.
   */
  static decodeInstructionType(
    instruction: TransactionInstruction,
  ): VoteInstructionType;
  /**
   * Decode an initialize vote instruction and retrieve the instruction params.
   */
  static decodeInitializeAccount(
    instruction: TransactionInstruction,
  ): InitializeAccountParams;
  /**
   * Decode an authorize instruction and retrieve the instruction params.
   */
  static decodeAuthorize(
    instruction: TransactionInstruction,
  ): AuthorizeVoteParams;
  /**
   * Decode a withdraw instruction and retrieve the instruction params.
   */
  static decodeWithdraw(
    instruction: TransactionInstruction,
  ): WithdrawFromVoteAccountParams;
}
/**
 * An enumeration of valid VoteInstructionType's
 */
declare type VoteInstructionType =
  | 'Authorize'
  | 'InitializeAccount'
  | 'Withdraw';
/**
 * VoteAuthorize type
 */
declare type VoteAuthorizationType = {
  /** The VoteAuthorize index (from solana-vote-program) */
  index: number;
};
/**
 * An enumeration of valid VoteAuthorization layouts.
 */
declare const VoteAuthorizationLayout: Readonly<{
  Voter: {
    index: number;
  };
  Withdrawer: {
    index: number;
  };
}>;
/**
 * Factory class for transactions to interact with the Vote program
 */
declare class VoteProgram {
  /**
   * Public key that identifies the Vote program
   */
  static programId: PublicKey;
  /**
   * Max space of a Vote account
   *
   * This is generated from the solana-vote-program VoteState struct as
   * `VoteState::size_of()`:
   * https://docs.rs/solana-vote-program/1.9.5/solana_vote_program/vote_state/struct.VoteState.html#method.size_of
   */
  static space: number;
  /**
   * Generate an Initialize instruction.
   */
  static initializeAccount(
    params: InitializeAccountParams,
  ): TransactionInstruction;
  /**
   * Generate a transaction that creates a new Vote account.
   */
  static createAccount(params: CreateVoteAccountParams): Transaction;
  /**
   * Generate a transaction that authorizes a new Voter or Withdrawer on the Vote account.
   */
  static authorize(params: AuthorizeVoteParams): Transaction;
  /**
   * Generate a transaction to withdraw from a Vote account.
   */
  static withdraw(params: WithdrawFromVoteAccountParams): Transaction;
}

declare const SYSVAR_CLOCK_PUBKEY: PublicKey;
declare const SYSVAR_EPOCH_SCHEDULE_PUBKEY: PublicKey;
declare const SYSVAR_INSTRUCTIONS_PUBKEY: PublicKey;
declare const SYSVAR_RECENT_BLOCKHASHES_PUBKEY: PublicKey;
declare const SYSVAR_RENT_PUBKEY: PublicKey;
declare const SYSVAR_REWARDS_PUBKEY: PublicKey;
declare const SYSVAR_SLOT_HASHES_PUBKEY: PublicKey;
declare const SYSVAR_SLOT_HISTORY_PUBKEY: PublicKey;
declare const SYSVAR_STAKE_HISTORY_PUBKEY: PublicKey;

declare class SendTransactionError extends Error {
  logs: string[] | undefined;
  constructor(message: string, logs?: string[]);
}

/**
 * Sign, send and confirm a transaction.
 *
 * If `commitment` option is not specified, defaults to 'max' commitment.
 *
 * @param {Connection} connection
 * @param {Transaction} transaction
 * @param {Array<Signer>} signers
 * @param {ConfirmOptions} [options]
 * @returns {Promise<TransactionSignature>}
 */
declare function sendAndConfirmTransaction(
  connection: Connection,
  transaction: Transaction,
  signers: Array<Signer>,
  options?: ConfirmOptions,
): Promise<TransactionSignature>;

/**
 * Send and confirm a raw transaction
 *
 * If `commitment` option is not specified, defaults to 'max' commitment.
 *
 * @param {Connection} connection
 * @param {Buffer} rawTransaction
 * @param {ConfirmOptions} [options]
 * @returns {Promise<TransactionSignature>}
 */
declare function sendAndConfirmRawTransaction(
  connection: Connection,
  rawTransaction: Buffer,
  options?: ConfirmOptions,
): Promise<TransactionSignature>;

declare type Cluster = 'devnet' | 'testnet' | 'mainnet-beta';
/**
 * Retrieves the RPC API URL for the specified cluster
 */
declare function clusterApiUrl(cluster?: Cluster, tls?: boolean): string;

/**
 * There are 1-billion lamports in one SOL
 */
declare const LAMPORTS_PER_SOL = 1000000000;

export {
  Account,
  AccountBalancePair,
  AccountChangeCallback,
  AccountInfo,
  AccountMeta,
  AdvanceNonceParams,
  AllocateParams,
  AllocateWithSeedParams,
  AssignParams,
  AssignWithSeedParams,
  AuthorizeNonceParams,
  AuthorizeStakeParams,
  AuthorizeVoteParams,
  AuthorizeWithSeedStakeParams,
  Authorized,
  AuthorizedVoter,
  BPF_LOADER_DEPRECATED_PROGRAM_ID,
  BPF_LOADER_PROGRAM_ID,
  BlockProduction,
  BlockResponse,
  BlockSignatures,
  BlockTimestamp,
  Blockhash,
  BpfLoader,
  Cluster,
  Commitment,
  CompiledInnerInstruction,
  CompiledInstruction,
  ComputeBudgetInstruction,
  ComputeBudgetInstructionType,
  ComputeBudgetProgram,
  ConfirmOptions,
  ConfirmedBlock,
  ConfirmedSignatureInfo,
  ConfirmedSignaturesForAddress2Options,
  ConfirmedTransaction,
  ConfirmedTransactionMeta,
  Connection,
  ConnectionConfig,
  ContactInfo,
  Context,
  CreateAccountParams,
  CreateAccountWithSeedParams,
  CreateEd25519InstructionWithPrivateKeyParams,
  CreateEd25519InstructionWithPublicKeyParams,
  CreateNonceAccountParams,
  CreateNonceAccountWithSeedParams,
  CreateSecp256k1InstructionWithEthAddressParams,
  CreateSecp256k1InstructionWithPrivateKeyParams,
  CreateSecp256k1InstructionWithPublicKeyParams,
  CreateStakeAccountParams,
  CreateStakeAccountWithSeedParams,
  CreateVoteAccountParams,
  DataSizeFilter,
  DataSlice,
  DeactivateStakeParams,
  DelegateStakeParams,
  Ed25519Keypair,
  Ed25519Program,
  Enum,
  EpochCredits,
  EpochInfo,
  EpochSchedule,
  FeeCalculator,
  FetchMiddleware,
  Finality,
  GetBlockProductionConfig,
  GetLargestAccountsConfig,
  GetMultipleAccountsConfig,
  GetParsedProgramAccountsConfig,
  GetProgramAccountsConfig,
  GetProgramAccountsFilter,
  GetSupplyConfig,
  HttpHeaders,
  InflationGovernor,
  InflationReward,
  Info,
  InitializeAccountParams,
  InitializeNonceParams,
  InitializeStakeParams,
  KeyedAccountInfo,
  Keypair,
  LAMPORTS_PER_SOL,
  LargestAccountsFilter,
  LeaderSchedule,
  Loader,
  Lockout,
  Lockup,
  Logs,
  LogsCallback,
  LogsFilter,
  MAX_SEED_LENGTH,
  MemcmpFilter,
  MergeStakeParams,
  Message,
  MessageArgs,
  MessageHeader,
  NONCE_ACCOUNT_LENGTH,
  NonceAccount,
  NonceInformation,
  PACKET_DATA_SIZE,
  ParsedAccountData,
  ParsedConfirmedTransaction,
  ParsedConfirmedTransactionMeta,
  ParsedInnerInstruction,
  ParsedInstruction,
  ParsedMessage,
  ParsedMessageAccount,
  ParsedTransaction,
  ParsedTransactionMeta,
  ParsedTransactionWithMeta,
  PartiallyDecodedInstruction,
  PerfSample,
  PriorVoter,
  ProgramAccountChangeCallback,
  PublicKey,
  PublicKeyData,
  PublicKeyInitData,
  RequestHeapFrameParams,
  RequestUnitsParams,
  RootChangeCallback,
  RpcResponseAndContext,
  SOLANA_SCHEMA,
  STAKE_CONFIG_ID,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_EPOCH_SCHEDULE_PUBKEY,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_REWARDS_PUBKEY,
  SYSVAR_SLOT_HASHES_PUBKEY,
  SYSVAR_SLOT_HISTORY_PUBKEY,
  SYSVAR_STAKE_HISTORY_PUBKEY,
  Secp256k1Program,
  SendOptions,
  SendTransactionError,
  SerializeConfig,
  SignaturePubkeyPair,
  SignatureReceivedNotification,
  SignatureResult,
  SignatureResultCallback,
  SignatureStatus,
  SignatureStatusConfig,
  SignatureStatusNotification,
  SignatureSubscriptionCallback,
  SignatureSubscriptionOptions,
  SignaturesForAddressOptions,
  Signer,
  SimulatedTransactionAccountInfo,
  SimulatedTransactionResponse,
  SlotChangeCallback,
  SlotInfo,
  SlotUpdate,
  SlotUpdateCallback,
  SplitStakeParams,
  SplitStakeWithSeedParams,
  StakeActivationData,
  StakeAuthorizationLayout,
  StakeAuthorizationType,
  StakeInstruction,
  StakeInstructionType,
  StakeProgram,
  Struct,
  Supply,
  SystemInstruction,
  SystemInstructionType,
  SystemProgram,
  TokenAccountBalancePair,
  TokenAccountsFilter,
  TokenAmount,
  TokenBalance,
  Transaction,
  TransactionConfirmationStatus,
  TransactionCtorFields,
  TransactionError,
  TransactionInstruction,
  TransactionInstructionCtorFields,
  TransactionResponse,
  TransactionSignature,
  TransferParams,
  TransferWithSeedParams,
  VALIDATOR_INFO_KEY,
  VOTE_PROGRAM_ID,
  ValidatorInfo,
  Version,
  VoteAccount,
  VoteAccountInfo,
  VoteAccountStatus,
  VoteAuthorizationLayout,
  VoteAuthorizationType,
  VoteInit,
  VoteInstruction,
  VoteInstructionType,
  VoteProgram,
  WithdrawFromVoteAccountParams,
  WithdrawNonceParams,
  WithdrawStakeParams,
  clusterApiUrl,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
};
