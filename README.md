# radium-sdk-demo-by-MOHSIN

To Add Liquidity :
Update config.ts for devnet or mainnet

then create token on devnet or mainnet and make sure to disable mint authority and freeze authority

You can use this link [https://sol-tools.tonyboyle.io/token-tools/create-token] to create token

then update mint address and deciimal, name , symbol in config.ts DEFAULT_TOKEN list array

then do following steps :

Step 1: Create Market for your pair of token

`yarn clean && yarn build && yarn start js/src/utilsCreateMarket.js` and make sure to note the MarketId

Step 2: Create pool for your pair of token and add initial liquidity

`yarn clean && yarn build && yarn start js/src/ammCreatePool.js`

Step 3: fetch the pool id by giving the market id followng script : ammFetchPoolId.ts

`yarn clean && yarn build && yarn start js/src/ammFetchPoolId.js` -> It will console the Target Pool Id : note and use it for further actions

Step 3: Add Liquidity using the desired tokens and updating the target pool id

`yarn clean && yarn build && yarn start js/src/ammAddLiquidity.js`

You can play around the values of base Token, quote token, baseTokenAmount as input, quote token amount as second input
