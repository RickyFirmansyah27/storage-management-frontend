import { useMutation, useQuery } from "@tanstack/react-query";
import { apiPost, apiGet, apiPut, apiDelete } from "./axios-client";
import { AddItems, EditItems } from "@/services/types";

const DEFAULT_QUERY_OPTIONS = {
  retry: 1,
  refetchOnWindowFocus: false,
};

const basePath = "/items";

export const useAddItems = () => {
  return useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: (body: AddItems) => apiPost(`${basePath}/add`, body),
  });
};

export const useGetAllItems = (query = {}) => {
  return useQuery({
    ...DEFAULT_QUERY_OPTIONS,
    queryKey: ["get all Items", query],
    queryFn: async () => {
      return await apiGet(`${basePath}`, query);
    },
  });
};

export const useEditItems = () => {
  return useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: ({ id, body }: { id: string; body: EditItems }) =>
      apiPut(`${basePath}/edit/${id}`, body),
  });
};

export const useDeleteItems = () => {
  return useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: (id: string) => apiDelete(`${basePath}/${id}`),
  });
};

export const useGetItemsById = (id: string) => {
  return useQuery({
    ...DEFAULT_QUERY_OPTIONS,
    queryKey: ["get Items by id", id],
    queryFn: async () => {
      return await apiGet(`${basePath}/${id}`);
    },
  });
};