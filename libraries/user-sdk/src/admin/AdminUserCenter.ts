import { AdminAppChecker } from './AdminAppChecker'
import { SimpleUserService } from '../core/SimpleUserService'

export class _AdminUserCenter extends SimpleUserService<AdminAppChecker> {
  protected _checker = new AdminAppChecker()
}

export const AdminUserCenter = new _AdminUserCenter()
