'use client'

import { useState, useEffect } from 'react'
import { createClient } from '~/lib/supabase/client'
import type { GiftAnalytics } from '~/types/gift-list'
import { useAuth } from '~/contexts/auth'
import { giftListApi } from '~/services/gift-list-api'

export function useGiftAnalytics() {
  const [analytics, setAnalytics] = useState<GiftAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      setAnalytics(null)
      setLoading(false)
      return
    }

    const fetchAnalytics = async () => {
      try {
        const { data, success } = await giftListApi.getGiftAnalytics()
        if (success) {
          setAnalytics(data)
        }
      } catch (err) {
        console.error('Error fetching gift analytics:', err)
        setError('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()

    // Subscribe to changes
    const subscription = supabase
      .channel('gift_analytics_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'gifts'
        }, 
        () => {
          fetchAnalytics()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  return {
    analytics,
    loading,
    error
  }
}
