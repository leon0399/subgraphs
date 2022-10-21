# Factoria Subgraph

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
