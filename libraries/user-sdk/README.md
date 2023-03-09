# user-sdk

## Installation

```
# Use npm
npm install @fangcha/user-sdk

# Or use yarn
yarn add @fangcha/user-sdk
```

## Usage

```
// Init a global checker
const checker = AdminUserCenter.useAutoReloadingChecker(new UserProxy(……))

// checkUserHasPermission: boolean
checker.checkUserHasPermission(userKey, permissionKey)

// getPermissionKeysForUser: string[]
checker.getPermissionKeysForUser(userKey)
```

```
// Wait until the initial data is ready
await AdminUserCenter.waitForReady()
```
