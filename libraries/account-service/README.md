# account-service

## Installation
```
# Use npm
npm install @fangcha/account

# Or use yarn
yarn add @fangcha/account
```

## Options
```
interface Options {
  database: FCDatabase

  // Default: fc_account
  tableName_Account?: string

  // Default: fc_account_carrier
  tableName_AccountCarrier?: string

  // Default: fc_account_carrier_extras
  tableName_AccountCarrierExtras?: string
}
```

## Usage
```
import { AccountServer } from '@fangcha/account'

const accountServer = new AccountServer({
  database: ……,
})

……

// Find account by accountUid
await accountServer.findAccount(accountUid)

// Find account by email
await accountServer.findCarrier(CarrierType.Email, email)

// Create Account
await accountServer.createAccount(params)
```
