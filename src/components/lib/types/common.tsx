import { QueryKey } from "@tanstack/react-query";
import { TApiResponse, TApiSingleResponse } from "../models";

export type TMutationProp = {
  // key: string[];
  key?: QueryKey;
  invalidateKey?: QueryKey | QueryKey[];
  func: (body: any) => Promise<TApiResponse<any>>;
  onSuccess: () => void;
};

export type TOption = {
  id: number;
  label: string;
  value: string | number;
};

export type TQueryParams = {
  id?: number | null | string;
  offset?: number;
  limit?: number;
  brand?: number | string;
  model?: number | string;
  username?: string;
  active?: number | string;
  startDate?: string;
  endDate?: string;
  name?: string;
  mobile?: string;
  category?: string;
  seller?: string;
  designation?: number | string;
  email?: string;
  year?: string | number | null;
  month?: string | number | null;
  status?: string | number;
  type?: string;
};

export type TQueryProp = {
  key: string[];
  params?: TQueryParams;
  isEnabled?: boolean;
  func: (params: TQueryParams) => Promise<TApiResponse<any>>;
};

export type TSingleQueryProp = {
  key: string[];
  params?: TQueryParams;
  isEnabled?: boolean;
  func: (params: TQueryParams) => Promise<TApiSingleResponse<any>>;
};

export interface SlicePayload<T> {
  list: T[] | null;
  page: number;
  count: number;
}

export type TableAction = {
  actionType: string;
  handler: (item: any) => void;
};

export type TableItem = {
  key: string | number;
  clickItem?: any;
  value: string | number;
  valueType: string;
  actions?: TableAction[];
  chipStyle?: { backgroundColor: string; color: string };
  chipLabel?: string;
};

export type Methods = "head" | "options" | "put" | "post" | "patch" | "delete" | "get";

export type LoginResponse = {
  id: number;
  username: string;
  fullname: string;
  address: string;
  phone: string;
  email: string;
  token: string;
};

export type TAdminResponse = {
  result: {
    id: number;
    username: string;
    fullname: string;
    address: string;
    phone: string;
    email: string;
    token: string;
  };
  success: boolean;
  message?: string;
};

export interface TApprovalData {
  id: number;
  seller_name: string;
  category_name: string;
  listing_id: number;
  listing_price: number;
  approval_status: number;
  approved_on: string;
}
