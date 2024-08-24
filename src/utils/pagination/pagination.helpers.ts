import { PaginationDTO, PaginationQueryDTO } from './pagination.dto'

export function parsePagination<T>(
  data: T[],
  query: PaginationQueryDTO,
  count: number
): PaginationDTO<T> {
  return {
    data,
    page: query.page ?? 1,
    total: count,
    totalPages: Math.ceil(count / (query.limit ?? 10))
  }
}

export function buildPaginationParams(query?: PaginationQueryDTO): {
  skip: number
  take: number
} {
  const defaultLimit = 10
  const defaultPage = 1

  return {
    skip: ((query?.page ?? defaultPage) - 1) * (query?.limit ?? defaultLimit),
    take: query?.limit ?? defaultLimit
  }
}
