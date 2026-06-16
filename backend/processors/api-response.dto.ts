import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty()
  data!: T;
}

export class PaginatedResponseDto<T> extends ApiResponseDto<T[]> {
  @ApiProperty()
  total!: number;
}