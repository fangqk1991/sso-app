import React, { useEffect, useState } from 'react'
import { AxiosBuilder } from '@fangcha/app-request'

interface Response<T = any> {
  isLoading: boolean
  data: T
  error: Error | null
}

export function useRequest<T = any>(request: AxiosBuilder): Response<T> {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    setLoading(true)
    setData(null)
    setError(null)
    request
      .quickSend()
      .then((response) => {
        setLoading(false)
        setData(response)
      })
      .catch((err) => {
        setLoading(false)
        setError(err)
      })
  }, [request])
  return {
    isLoading: isLoading,
    data: data as T,
    error: error,
  }
}
