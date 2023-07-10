import { OpenAppChecker } from './OpenAppChecker'
import { SimpleUserService } from '../core/SimpleUserService'

export class _OpenUserCenter extends SimpleUserService<OpenAppChecker> {
  protected _checker = new OpenAppChecker()
}

export const OpenUserCenter = new _OpenUserCenter()
