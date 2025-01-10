import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {domain} from "../../../constants/constants";

export const LKApi = createApi({
    reducerPath: 'LKApi',
    // tagTypes: ['PartsSort', 'getPart'],
    baseQuery: fetchBaseQuery({ baseUrl: domain }),
    endpoints: (builder) => ({
        getUserCars: builder.query({
            query: ({ typeSort, sort, limit }) => `/api/products/${typeSort}/${sort}/${limit}`
        }),
        addCarToUser: builder.query({
            query: ({ formData, page }) => ({
                url: `/api/products/filter?page=${page}`,
                method: 'POST',
                body: formData
            })

        }),
    })
})

export const {
    useGetUserCarsQuery,
    useAddCarToUserQuery,
} = LKApi