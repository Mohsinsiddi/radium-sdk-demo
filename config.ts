import {
  ENDPOINT as _ENDPOINT,
  Currency,
  DEVNET_PROGRAM_ID,
  LOOKUP_TABLE_CACHE,
  MAINNET_PROGRAM_ID,
  RAYDIUM_MAINNET,
  Token,
  TOKEN_PROGRAM_ID,
  TxVersion,
  NativeTokenInfo,
  SOL,
} from '@raydium-io/raydium-sdk'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import bs58 from 'bs58'

export const rpcUrl: string = ''
export const rpcToken: string | undefined = undefined
const pvtKey = ''
export const wallet = Keypair.fromSecretKey(bs58.decode(pvtKey))

export const connection = new Connection(rpcUrl)

export const PROGRAMIDS = DEVNET_PROGRAM_ID

export const ENDPOINT = _ENDPOINT

export const RAYDIUM_MAINNET_API = RAYDIUM_MAINNET

export const makeTxVersion = TxVersion.V0 // LEGACY

export const addLookupTableInfo = undefined // only mainnet. other = undefined

export const DEFAULT_TOKEN = {
  SOL: SOL,
  SOL1: new Currency(9, 'USDC', 'USDC'),
  WSOL: new Token(TOKEN_PROGRAM_ID, new PublicKey('So11111111111111111111111111111111111111112'), 9, 'WSOL', 'WSOL'),
  USDC: new Token(TOKEN_PROGRAM_ID, new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), 6, 'USDC', 'USDC'),
  RAY: new Token(TOKEN_PROGRAM_ID, new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'), 6, 'RAY', 'RAY'),
  'RAY_USDC-LP': new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey('FGYXP4vBkMEtKhxrmEBcWN8VNmXX8qNgEJpENKDETZ4Y'),
    6,
    'RAY-USDC',
    'RAY-USDC'
  ),

  TOKEN1: new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'),
    6,
    'USD Coin Dev',
    'USDC'
  ),

  TOKEN2: new Token(TOKEN_PROGRAM_ID, new PublicKey('HT4EocuQFCwNQnsTse334RtK9Ev2WX4rGmm9sugy57Pb'), 6, 'XYZ', 'XYZ'),
  TOKEN3: new Token(TOKEN_PROGRAM_ID, new PublicKey('J5A4oMQ52FTGJVnJX5kHWc2jYuPACFWyUxprW86HrWvt'), 9, '', ''),
  TOKEN4: new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey('HgM9opPBVL1bZVqLa6PtEntT7aKmq4NkkGQ52WGQvHtP'),
    6,
    'Test Token',
    'TEST'
  ),
  TOKEN5: new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey('2QGEzYDy6Bbvj9ZksyaXFmWr8UcdGxuA1cschdDWukz9'),
    6,
    'Test Token',
    'TEST'
  ),
  'TEST-WSOL-LP': new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey('7kfxK61RtwxmHKXpCAvhHXRUwtdChzBDzo3v615oJ1pG'),
    6,
    'TEST-WSOL',
    'TEST-WSOL'
  ),
}
