import { permission } from './permission/hasPermi'
export default function directive(app: any) {
  app.directive('permission', permission)
}
