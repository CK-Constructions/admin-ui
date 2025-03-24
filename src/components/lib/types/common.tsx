import { TApiResponse, TApiSingleResponse } from "../models";

export type TMutationProp = {
    key: string[];
    func: (body: any) => Promise<TApiResponse<any>>;
    onSuccess: () => void;
};

export type TOption = {
    id: number;
    label: string;
    value: string | number;
};

export type TQueryParams = {
    id?: number | null;
    offset?: number;
    limit?: number;
    brand?: number | string;
    model?: number | string;
    showTransferred?: boolean;
    serial_number?: string;
    branch?: number | string;
    startDate?: string;
    endDate?: string;
    name?: string;
    mobile?: string;
    contact?: string;
    patientId?: number | string;
    workflow?: boolean;
    referral?: boolean;
    showReferredFrom?: boolean;
    appointmentFor?: number | string;
    appointment_for?: number | string;
    day?: number;
    showReferred?: boolean;
    role?: number | string;
    designation?: number | string;
    email?: string;
    specialty?: number | string;
    year?: string | number | null;
    month?: string | number | null;
    employeeId?: string | number;
    specialist?: string | number;
    status?: string | number;
    patientName?: string;
    appointment?: number | string;
    appointmentId?: number;
    type?: string;
    patient?: number | string;
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
