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

type TestTxInputInfo = {
  marketId: string
}

async function ammFetchPoolId(input: TestTxInputInfo): Promise<{ requirePoolData: any }> {
  const data = await formatAmmKeys(PROGRAMIDS.AmmV4.toString())
  console.log('Data', data)
  const requirePoolData = data.filter((item) => item.marketId === input.marketId)
  console.log('Required Pool Data', requirePoolData)
  return { requirePoolData }
}

async function howToUse() {
  const marketId = '5qcqkjE4iXTMrsgS7547HpRDvC84N9v6vWsrLP4QaBaM'
  ammFetchPoolId({
    marketId,
  }).then(({ requirePoolData }) => {
    /** continue with txids */
    console.log('Target Pool Id', requirePoolData[0].id)
  })
}
howToUse()
