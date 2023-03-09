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

// checkUserHasPermission
checker.checkUserHasPermission(userName, permissionKey)
```

```
// Wait until the initial data is ready
await AdminUserCenter.waitForReady()
```
