import { useEffect, useReducer } from 'react'

import favoritesReducer, { initialFavorites } from './favoritesReducer'

// Custom hook to manage favorite photos
function useFavorites() {
    // Read saved favorites from localStorage when the hook initializes
    const getInitialFavorites = () => {
        try {
            const savedFavorites = localStorage.getItem('celebrare-favorites')

            // Convert saved JSON text into an array; use empty array if nothing is saved
            return savedFavorites ? JSON.parse(savedFavorites) : initialFavorites
        } catch {
            // If saved data is invalid, start with no favorites
            return initialFavorites
        }
    }

    // useReducer manages favorites using the reducer function
    const [favorites, dispatch] = useReducer(
        favoritesReducer,
        undefined,
        getInitialFavorites
    )

    // Save favorites to localStorage whenever the favorites array changes
    useEffect(() => {
        localStorage.setItem('celebrare-favorites', JSON.stringify(favorites))
    }, [favorites]) // Re-run this effect when favorites changes

    // Return the favorites list and dispatch function for components to use
    return { favorites, dispatch }
}


export default useFavorites