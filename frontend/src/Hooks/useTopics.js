import { useState, useEffect } from "react"
import { getTopics } from "../Services/topicsservice"

export const useTopics = () => {
  const [topics, setTopics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTopics()
      .then((data) => {
        setTopics(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(true)
        setLoading(false)
      })
  }, [])

  return { topics, loading, error }
}
