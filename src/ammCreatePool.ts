import { BN } from 'bn.js'

import { Liquidity, MAINNET_PROGRAM_ID, Token, DEVNET_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@raydium-io/raydium-sdk'
import { Keypair, PublicKey } from '@solana/web3.js'

import { connection, DEFAULT_TOKEN, makeTxVersion, PROGRAMIDS, wallet } from '../config'
import { buildAndSendTx, getWalletTokenAccount } from './util'

const ZERO = new BN(0)
type BN = typeof ZERO

type CalcStartPrice = {
  addBaseAmount: BN
  addQuoteAmount: BN
}

function calcMarketStartPrice(input: CalcStartPrice) {
  return input.addBaseAmount.toNumber() / 10 ** 6 / (input.addQuoteAmount.toNumber() / 10 ** 6)
}

type LiquidityPairTargetInfo = {
  baseToken: Token
  quoteToken: Token
  targetMargetId: PublicKey
}

function getMarketAssociatedPoolKeys(input: LiquidityPairTargetInfo) {
  return Liquidity.getAssociatedPoolKeys({
    version: 4,
    marketVersion: 3,
    baseMint: input.baseToken.mint,
    quoteMint: input.quoteToken.mint,
    baseDecimals: input.baseToken.decimals,
    quoteDecimals: input.quoteToken.decimals,
    marketId: input.targetMargetId,
    programId: PROGRAMIDS.AmmV4,
    marketProgramId: MAINNET_PROGRAM_ID.OPENBOOK_MARKET,
  })
}

type WalletTokenAccounts = Awaited<ReturnType<typeof getWalletTokenAccount>>
type TestTxInputInfo = LiquidityPairTargetInfo &
  CalcStartPrice & {
    startTime: number // seconds
    walletTokenAccounts: WalletTokenAccounts
    wallet: Keypair
  }

async function ammCreatePool(input: TestTxInputInfo): Promise<{ txids: string[] }> {
  console.log('PROGRAMIDS AMMV4', PROGRAMIDS.AmmV4.toBase58())
  console.log('PROGRAMIDS OPENBOOK_MARKET', PROGRAMIDS.OPENBOOK_MARKET.toBase58())

  // -------- step 1: make instructions --------
  const initPoolInstructionResponse = await Liquidity.makeCreatePoolV4InstructionV2Simple({
    connection,
    programId: PROGRAMIDS.AmmV4,
    marketInfo: {
      marketId: input.targetMargetId,
      programId: PROGRAMIDS.OPENBOOK_MARKET,
    },
    baseMintInfo: input.baseToken,
    quoteMintInfo: input.quoteToken,
    baseAmount: input.addBaseAmount,
    quoteAmount: input.addQuoteAmount,
    startTime: new BN(Math.floor(input.startTime)),
    ownerInfo: {
      feePayer: input.wallet.publicKey,
      wallet: input.wallet.publicKey,
      tokenAccounts: input.walletTokenAccounts,
      useSOLBalance: true,
    },
    associatedOnly: false,
    checkCreateATAOwner: true,
    makeTxVersion,
    feeDestinationId: new PublicKey('3XMrhbv989VxAMi3DErLV9eJht1pHppW5LbKxe9fkEFR'), // only mainnet use this
  })
  console.log('Pool Id', initPoolInstructionResponse.address)
  return { txids: await buildAndSendTx(initPoolInstructionResponse.innerTransactions, { skipPreflight: true }) }
}

async function howToUse() {
  console.log('Wallet pubkey', wallet.publicKey.toBase58())
  const baseToken = DEFAULT_TOKEN.TOKEN4 // USDC
  const quoteToken = DEFAULT_TOKEN.WSOL // RAY
  const targetMargetId = new PublicKey('5qcqkjE4iXTMrsgS7547HpRDvC84N9v6vWsrLP4QaBaM')
  console.log('targetMargetId', targetMargetId.toBase58())
  const addBaseAmount = new BN(1000000) // 10000 / 10 ** 6,
  const addQuoteAmount = new BN(1000000000) // 10000 / 10 ** 6,
  const startTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 // start from 7 days later
  const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey)
  /* do something with start price if needed */
  const startPrice = calcMarketStartPrice({ addBaseAmount, addQuoteAmount })
  /* do something with market associated pool keys if needed */
  const associatedPoolKeys = getMarketAssociatedPoolKeys({
    baseToken,
    quoteToken,
    targetMargetId,
  })

  ammCreatePool({
    startTime,
    addBaseAmount,
    addQuoteAmount,
    baseToken,
    quoteToken,
    targetMargetId,
    wallet,
    walletTokenAccounts,
  }).then((res) => {
    /** continue with txids */
    console.log('txids', res)
  })
}
howToUse()
