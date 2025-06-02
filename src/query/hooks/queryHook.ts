import { useMutation, useQuery } from "@tanstack/react-query";

import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { TMutationProp, TQueryProp, TSingleQueryProp } from "../../components/lib/types/common";
import { TApiResponse } from "../../components/lib/models";

export function useGetQuery({ key, params, isEnabled, func }: TQueryProp) {
  const offset = params?.offset || 0;
  const limit = params?.limit || 10;

  const queryParams = {
    ...params,
    offset,
    limit,
  };
  const keyArr: any[] = [...key];
  for (const [key, value] of Object.entries(queryParams)) {
    keyArr.push({ [key]: value });
  }
  return useQuery({
    queryKey: keyArr,
    queryFn: () => func(queryParams),
    enabled: isEnabled !== undefined ? isEnabled : true,
  });
}

export function useGetSingleQuery({ key, params, isEnabled, func }: TSingleQueryProp) {
  const queryParams = {
    ...params,
  };
  const keyArr: any[] = [...key];
  for (const [key, value] of Object.entries(queryParams)) {
    keyArr.push({ [key]: value });
  }
  return useQuery({
    queryKey: keyArr,
    queryFn: () => func(queryParams),
    enabled: isEnabled !== undefined ? isEnabled : true,
  });
}

// export function useMutationQuery({ key, func, onSuccess }: TMutationProp) {
//     const client = useQueryClient();
//     return useMutation({
//         mutationFn: func,
//         onSuccess: (data: TApiResponse<any>) => {
//             if (data.success) {
//                 onSuccess();
//                 client.invalidateQueries({ queryKey: key });
//             } else {
//                 toast.error(data?.message || '');
//             }
//         }
//     });
// };

// export function useMutationQuery({ key, func, onSuccess }: TMutationProp) {
//   const client = useQueryClient();
//   return useMutation({
//     mutationFn: func,
//     onSuccess: (data: TApiResponse<any>) => {
//       if (data.success) {
//         onSuccess();
//         // Handle both single key and array of keys
//         if (Array.isArray(key)) {
//           key.forEach((k) => {
//             client.invalidateQueries({ queryKey: k });
//           });
//         } else {
//           client.invalidateQueries({ queryKey: key });
//         }
//       } else {
//         toast.error(data?.message || "");
//       }
//     },
//   });
// }

// export function useMutationQuery({ key, func, onSuccess }: TMutationProp) {
//   const client = useQueryClient();
//   return useMutation({
//     mutationFn: func,
//     onSuccess: (data: TApiResponse<any>) => {
//       console.log("data", data);
//       if (data.success) {
//         onSuccess();
//         if (Array.isArray(key)) {
//           key.forEach((k) => client.invalidateQueries({ queryKey: k }));
//         } else {
//           client.invalidateQueries({ queryKey: key });
//         }
//       } else {
//         toast.error(data?.message || "");
//       }
//     },
//   });
// }

// export function useMutationQuery({ key, func, onSuccess }: TMutationProp) {
//   const client = useQueryClient();
//   return useMutation({
//     mutationFn: func,
//     onSuccess: (data: TApiResponse<any>) => {
//       if (data.success) {
//         onSuccess();
//         if (Array.isArray(key)) {
//           key.forEach((k) => client.invalidateQueries({ queryKey: k }));
//         } else {
//           client.invalidateQueries({ queryKey: key });
//         }
//       } else {
//         toast.error(data?.message || "");
//       }
//     },
//   });
// }

export function useMutationQuery({ key, func, onSuccess, onError }: TMutationProp) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: func,
    onSuccess: (data: TApiResponse<any>) => {
      if (data.success) {
        onSuccess?.();
        if (Array.isArray(key)) {
          key.forEach((k) => client.invalidateQueries({ queryKey: k }));
        } else {
          client.invalidateQueries({ queryKey: key });
        }
      } else {
        toast.error(data?.message || "Operation failed");
        onError?.(); // Call onError if the API response indicates failure
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred");
      onError?.(); // Call onError for network/request errors
    },
  });
}
