# Cell Subgraph

Subgraph for [cell.computer](http://cell.computer/)

## Deployment

| Network | Hosted Service |
| :------ | :------------- |
| Mainnet | https://thegraph.com/hosted-service/subgraph/leon0399/cell        |
| Goerli  | https://thegraph.com/hosted-service/subgraph/leon0399/cell-goerli |

## Example Queries

### Get collection token transfers

```graphql
{
  collection(id: "0x1b716a471fffab0300296fb8262b2c7cf7e090c3") {
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
  tokens(where: { ownerId: "0xc41f70efe26a0483a1760fc366a3a64548b7f082", collection: "0x1b716a471fffab0300296fb8262b2c7cf7e090c3" }) {
    collection {
      id
      name
      symbol
    }
    tokenId
  }
}
```
