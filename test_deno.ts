import * as web3 from './mod.ts';

const conn = new web3.Connection(web3.clusterApiUrl('mainnet-beta'), {
  commitment: 'confirmed',
  fetch,
});

const slot = await conn.getSlot();
console.log({slot});
