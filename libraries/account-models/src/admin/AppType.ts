import { Descriptor } from '@fangcha/tools'

export enum AppType {
  Admin = 'Admin',
  Open = 'Open',
}

const values = [AppType.Admin, AppType.Open]

const describe = (code: AppType) => {
  switch (code) {
    case AppType.Admin:
      return 'Admin'
    case AppType.Open:
      return 'OpenAPI'
  }
  return 'Unknown'
}

export const AppTypeDescriptor = new Descriptor(values, describe)
