import { useEffect, useState } from 'react'

// API endpoint that returns a list of 30 photos
const API_URL = 'https://picsum.photos/v2/list?limit=30'

function useFetchPhotos() {
    const [photos, setPhotos] = useState([])  // Stores the photos received from the API
    const [loading, setLoading] = useState(true) // Tracks whether the API request is still in progress
    const [error, setError] = useState(null) // Stores an error message if the request fails

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch(API_URL)  // Send a request to the Picsum API

                if (!response.ok) {
                    throw new Error('Failed to fetch photos')
                }

                const data = await response.json()
                setPhotos(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPhotos()
    }, [])

    return { photos, loading, error }
}

export default useFetchPhotos