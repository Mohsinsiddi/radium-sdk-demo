import assert from 'assert'

import {
  CurrencyAmount,
  jsonInfo2PoolKeys,
  Liquidity,
  LiquidityPoolKeys,
  Percent,
  Token,
  TokenAmount,
} from '@raydium-io/raydium-sdk'
import { Keypair } from '@solana/web3.js'

import Decimal from 'decimal.js'
import { connection, DEFAULT_TOKEN, makeTxVersion, PROGRAMIDS, wallet } from '../config'
import { formatAmmKeysById } from './formatAmmKeysById'
import { buildAndSendTx, getWalletTokenAccount } from './util'
import { formatAmmKeys } from './formatAmmKeys'

type WalletTokenAccounts = Awaited<ReturnType<typeof getWalletTokenAccount>>
type TestTxInputInfo = {
  baseToken: Token
  quoteToken: Token
  targetPool: string
  inputTokenAmount: TokenAmount
  slippage: Percent
  walletTokenAccounts: WalletTokenAccounts
  wallet: Keypair
}

async function ammAddLiquidity(
  input: TestTxInputInfo
): Promise<{ txids: string[]; anotherAmount: TokenAmount | CurrencyAmount }> {
  // const data = await formatAmmKeys(PROGRAMIDS.AmmV4.toString())
  // console.log('Data', data)
  const targetPoolInfo = await formatAmmKeysById(input.targetPool)
  console.log('targetPoolInfo')
  assert(targetPoolInfo, 'cannot find the target pool')

  // -------- step 1: compute another amount --------
  const poolKeys = jsonInfo2PoolKeys(targetPoolInfo) as LiquidityPoolKeys
  const extraPoolInfo = await Liquidity.fetchInfo({ connection, poolKeys })
  const { maxAnotherAmount, anotherAmount, liquidity } = Liquidity.computeAnotherAmount({
    poolKeys,
    poolInfo: { ...targetPoolInfo, ...extraPoolInfo },
    amount: input.inputTokenAmount,
    anotherCurrency: input.quoteToken,
    slippage: input.slippage,
  })

  console.log('will add liquidity info', {
    liquidity: liquidity.toString(),
    liquidityD: new Decimal(liquidity.toString()).div(10 ** extraPoolInfo.lpDecimals),
  })

  // -------- step 2: make instructions --------
  const addLiquidityInstructionResponse = await Liquidity.makeAddLiquidityInstructionSimple({
    connection,
    poolKeys,
    userKeys: {
      owner: input.wallet.publicKey,
      payer: input.wallet.publicKey,
      tokenAccounts: input.walletTokenAccounts,
    },
    amountInA: input.inputTokenAmount,
    amountInB: maxAnotherAmount,
    fixedSide: 'a',
    makeTxVersion,
  })
  return {
    txids: [''],
    anotherAmount,
  }
  // return {
  //   txids: await buildAndSendTx(addLiquidityInstructionResponse.innerTransactions, { skipPreflight: true }),
  //   anotherAmount,
  // }
}

async function howToUse() {
  const baseToken = DEFAULT_TOKEN.TOKEN4 // USDC
  const quoteToken = DEFAULT_TOKEN.WSOL // RAY
  //Cr3NVdKhQb294DoX4HnoyAmhBtnFyctbQihzMFUAewZY

  const targetPool = 'EQXmTPq9MEZvZ8Apn2fKxP5XkPGVhKsQ7MNLtWrxdvJW' // RAY-USDC pool
  const inputTokenAmount = new TokenAmount(baseToken, 100)
  const slippage = new Percent(1, 100)
  const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey)

  ammAddLiquidity({
    baseToken,
    quoteToken,
    targetPool,
    inputTokenAmount,
    slippage,
    walletTokenAccounts,
    wallet: wallet,
  }).then(({ txids, anotherAmount }) => {
    /** continue with txids */
    console.log('txids', txids)
  })
}
howToUse()
