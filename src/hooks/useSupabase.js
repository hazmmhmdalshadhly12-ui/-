import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useSupabaseQuery(table, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase.from(table).select(options.select || '*')
      if (options.filter) query = options.filter(query)
      if (options.order) query = query.order(options.order.column, { ascending: options.order.ascending })

      const { data: result, error: err } = await query
      if (err) throw err
      setData(result)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [table, JSON.stringify(options)])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

export function useRealtime(table, filter = {}) {
  const [data, setData] = useState([])

  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table, ...filter }, (payload) => {
        setData(prev => {
          if (payload.eventType === 'INSERT') return [...prev, payload.new]
          if (payload.eventType === 'UPDATE') return prev.map(item => item.id === payload.new.id ? payload.new : item)
          if (payload.eventType === 'DELETE') return prev.filter(item => item.id !== payload.old.id)
          return prev
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table])

  return data
}