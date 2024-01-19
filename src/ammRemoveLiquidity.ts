import assert from 'assert'

import { jsonInfo2PoolKeys, Liquidity, LiquidityPoolKeys, TokenAmount } from '@raydium-io/raydium-sdk'
import { Keypair } from '@solana/web3.js'

import { connection, DEFAULT_TOKEN, makeTxVersion, wallet } from '../config'
import { formatAmmKeysById } from './formatAmmKeysById'
import { buildAndSendTx, getWalletTokenAccount } from './util'

type WalletTokenAccounts = Awaited<ReturnType<typeof getWalletTokenAccount>>
type TestTxInputInfo = {
  removeLpTokenAmount: TokenAmount
  targetPool: string
  walletTokenAccounts: WalletTokenAccounts
  wallet: Keypair
}

async function ammRemoveLiquidity(input: TestTxInputInfo) {
  // -------- pre-action: fetch basic info --------
  const targetPoolInfo = await formatAmmKeysById(input.targetPool)
  assert(targetPoolInfo, 'cannot find the target pool')

  // -------- step 1: make instructions --------
  const poolKeys = jsonInfo2PoolKeys(targetPoolInfo) as LiquidityPoolKeys
  const removeLiquidityInstructionResponse = await Liquidity.makeRemoveLiquidityInstructionSimple({
    connection,
    poolKeys,
    userKeys: {
      owner: input.wallet.publicKey,
      payer: input.wallet.publicKey,
      tokenAccounts: input.walletTokenAccounts,
    },
    amountIn: input.removeLpTokenAmount,
    makeTxVersion,
  })

  return { txids: await buildAndSendTx(removeLiquidityInstructionResponse.innerTransactions) }
}

async function howToUse() {
  const lpToken = DEFAULT_TOKEN['TEST-WSOL-LP'] // LP
  const removeLpTokenAmount = new TokenAmount(lpToken, 100)
  const targetPool = 'EQXmTPq9MEZvZ8Apn2fKxP5XkPGVhKsQ7MNLtWrxdvJW' // RAY-USDC pool
  const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey)

  ammRemoveLiquidity({
    removeLpTokenAmount,
    targetPool,
    walletTokenAccounts,
    wallet: wallet,
  }).then(({ txids }) => {
    /** continue with txids */
    console.log('txids', txids)
  })
}
howToUse()
