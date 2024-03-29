import { PaginationDTO, PaginationQueryDTO } from './pagination.dto';

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
  };
}
