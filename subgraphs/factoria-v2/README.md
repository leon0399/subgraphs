# Factoria Subgraph

Subgraph for [Factoria](https://factoria.app/)

[![Discord](https://img.shields.io/discord/966090258104062023?label=Discord&logo=discord)](https://discord.gg/YUtRKAqty2)
[![Developer's Twitter](https://img.shields.io/twitter/follow/leon0399?color=%231DA1F2&label=Developer%27s%20Twitter&logo=twitter)](https://twitter.com/leon0399)

## Deployment

| Network | Hosted Service |
| :------ | :------------- |
| Mainnet | https://thegraph.com/hosted-service/subgraph/leon0399/factoria-v2        |
| Goerli  | https://thegraph.com/hosted-service/subgraph/leon0399/factoria-v2-goerli |

## Example Queries

### Get collection token transfers

```graphql
{
  collection(id: "0x2dab63ebfcc7fc918fa06b8015eefc6597fa88a7") {
    name
    symbol
    transfers {
      tokenId
      from
      to
    }
  }
}
```

### Get tokens, owned by account

```graphql
{
  tokens(where: { ownerId: "0xd0428c1385c86461104272a7049ee79c561d326b", collection: "0x2dab63ebfcc7fc918fa06b8015eefc6597fa88a7" }) {
    collection {
      id
      name
      symbol
    }
    tokenId
  }
}
```
