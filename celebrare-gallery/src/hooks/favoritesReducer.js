// Initial state: an empty array means no photos are favorited yet
export const initialFavorites = []

// Reducer function: decides how the favorites state changes
function favoritesReducer(state, action) {
    // Check which action was sent to the reducer
    switch (action.type) {
        case 'TOGGLE_FAVORITE': {

            const photoId = action.payload  // Get the ID of the photo the user clicked

            // Check whether this photo is already in the favorites list
            const isFavorite = state.includes(photoId)

            // If it's already a favorite, remove it; otherwise, add it
            return isFavorite
                ? state.filter((id) => id !== photoId)
                : [...state, photoId]
        }

        // Return the current state if the action type is unknown
        default:
            return state
    }
}


export default favoritesReducer