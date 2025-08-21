export type TListResult<T> = {
  count?: number;
  list: T[];
};

export interface ApiResponse<T> {
  success: boolean;
  result?: {
    count?: number;
    list: T[];
  };
  message?: string;
}

export type ApiCountResponse = {
  success: boolean;
  count: number;
};

export interface ApiSingleResponse<T> {
  success: boolean;
  result: T;
}

export type TApiResponse<T> = {
  success: boolean;
  result?: T;
  message?: string;
};

export type TApiCountResponse = {
  success: boolean;
  count: number;
};

export type TApiSingleResponse<T> = {
  success: boolean;
  message?: string;
  result: T;
};
