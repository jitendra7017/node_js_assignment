export default interface IRequest {
  token?: string
  params?: Record<string, string | number | boolean>
  query?: Record<string, string | string[] | undefined>
  headers?: Record<string, string | string[] | undefined>
  body?: unknown
}
