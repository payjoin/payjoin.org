import type { AcceptedWallet } from './types';

export const WALLET_ADOPTION: AcceptedWallet[] = [
	{
		name: 'BDK-CLI',
		href: 'https://github.com/bitcoindevkit/bdk-cli/pull/156',
		sending: false,
		receiving: false
	},
	{
		name: 'Bitcoin Core (payjoin-cli)',
		href: 'https://crates.io/crates/payjoin-cli',
		sending: true,
		receiving: true
	},
	{
		name: 'BitMask',
		href: 'https://segwit.bitmask.app/',
		sending: true,
		receiving: false
	},
	{
		name: 'Blink (Bitcoin Beach Wallet)',
		href: 'https://www.blink.sv/',
		sending: false,
		receiving: false
	},
	{
		name: 'Blixt Wallet',
		href: 'https://github.com/hsjoberg/blixt-wallet/issues/1262',
		sending: false,
		receiving: false
	},
	{
		name: 'Blockstream Green',
		href: 'https://blockstream.com/green/',
		sending: false,
		receiving: false
	},
	{
		name: 'BlueWallet',
		href: 'https://twitter.com/bluewalletio/status/1313822205286010883',
		sending: true,
		receiving: false
	},
	{
		name: 'Boltz',
		href: 'https://github.com/BoltzExchange/boltz-backend/issues/449',
		sending: false,
		receiving: false
	},
	{
		name: 'BTCPay Server',
		href: 'https://docs.btcpayserver.org/Payjoin/',
		sending: true,
		receiving: true
	},
	{
		name: 'Bull Bitcoin',
		href: 'https://github.com/SatoshiPortal/bullbitcoin-mobile/issues',
		sending: false,
		receiving: false
	},
	{
		name: 'Casa',
		href: 'https://casa.io/',
		sending: false,
		receiving: false
	},
	{
		name: 'Core Lightning',
		href: 'https://github.com/payjoin/nolooking/issues/67',
		sending: false,
		receiving: false
	},
	{
		name: 'Electrum',
		href: 'https://github.com/spesmilo/electrum/issues/6585',
		sending: false,
		receiving: false
	},
	{
		name: 'Envoy',
		href: 'https://github.com/Foundation-Devices/envoy/pull/84',
		sending: false,
		receiving: false
	},
	{
		name: 'Fedimint',
		href: 'https://github.com/fedimint/fedimint/discussions/1764',
		sending: false,
		receiving: false
	},
	{
		name: 'FireBolt',
		href: 'https://github.com/AreaLayer/FireBolt',
		sending: false,
		receiving: false
	},
	{
		name: 'Fully Noded',
		href: 'https://github.com/Fonta1n3/FullyNoded/issues/126',
		sending: false,
		receiving: false
	},
	{
		name: 'Gordian Wallet',
		href: 'https://github.com/orgs/BlockchainCommons/discussions/49',
		sending: false,
		receiving: false
	},
	{
		name: 'JAM',
		href: 'https://github.com/joinmarket-webui/jam/issues/406',
		sending: false,
		receiving: false
	},
	{
		name: 'JoinMarket',
		href: 'https://joinmarket-org.github.io/joinmarket-clientserver/PAYJOIN.html',
		sending: true,
		receiving: true
	},
	{
		name: 'Liana',
		href: 'https://github.com/wizardsardine/liana/issues/534',
		sending: false,
		receiving: false
	},
	{
		name: 'LND (nolooking)',
		href: 'https://github.com/payjoin/nolooking',
		sending: true,
		receiving: true
	},
	{
		name: 'Mutiny Wallet',
		href: 'https://github.com/MutinyWallet/mutiny-node/issues/194',
		sending: false,
		receiving: false
	},
	{
		name: 'Nunchuk',
		href: 'https://nunchuk.io/',
		sending: false,
		receiving: false
	},
	{
		name: 'Phoenix',
		href: 'https://github.com/ACINQ/phoenix/issues/161',
		sending: false,
		receiving: false
	},
	{
		name: 'Sparrow Wallet',
		href: 'https://sparrowwallet.com/docs/spending-privately.html',
		sending: true,
		receiving: false
	},
	{
		name: 'Stack Wallet',
		href: 'https://github.com/cypherstack/stack_wallet/issues/445',
		sending: false,
		receiving: false
	},
	{
		name: 'Trezor Suite',
		href: 'https://trezor.io/trezor-suite',
		sending: false,
		receiving: false
	},
	{
		name: 'Wasabi Wallet',
		href: 'https://docs.wasabiwallet.io/using-wasabi/PayJoin.html',
		sending: true,
		receiving: false
	},
	{
		name: 'Zeus',
		href: 'https://zeusln.app/',
		sending: false,
		receiving: false
	}
];
