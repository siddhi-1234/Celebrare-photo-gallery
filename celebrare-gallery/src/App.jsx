import { useCallback, useMemo, useState } from 'react'

// Import our custom hooks
import useFetchPhotos from './hooks/useFetchPhotos'
import useFavorites from './hooks/useFavorites'

import PhotoCard from './components/PhotoCard'

function App() {
  // Get photos, loading status, and error from our fetching hook
  const { photos, loading, error } = useFetchPhotos()

  // Get favorite IDs and the dispatch function from our favorites hook
  const { favorites, dispatch } = useFavorites()

  // Store the text typed into the search box
  const [searchTerm, setSearchTerm] = useState('')

  // Store whether the user wants to see all photos or only favorites
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // useCallback keeps the search handler from being recreated unnecessarily
  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value)
  }, [])

  // Dispatch an action to add or remove a photo from favorites
  const handleToggleFavorite = useCallback((photoId) => {
    dispatch({
      type: 'TOGGLE_FAVORITE',
      payload: photoId,
    })
  }, [dispatch])

  // useMemo recalculates the filtered photos only when dependencies change
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // Check whether the author's name matches the search text
      const matchesSearch = photo.author
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      // Check whether this photo is in the favorites list
      const matchesFavorites = showFavoritesOnly
        ? favorites.includes(photo.id)
        : true

      // Keep the photo only if it matches both conditions
      return matchesSearch && matchesFavorites
    })
  }, [photos, searchTerm, showFavoritesOnly, favorites])

  return (

    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Page heading and description */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Celebrare Photo Gallery
          </h1>

          <p className="mt-2 text-slate-600">
            Explore photos and save your favorites.
          </p>
        </header>

        {/* Search input and favorites filter */}
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by author..."
            aria-label="Search photos by author"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:max-w-md"
          />

          {/* Toggle between all photos and favorites */}
          <button
            type="button"
            onClick={() => setShowFavoritesOnly((current) => !current)}
            className={`rounded-lg px-5 py-3 font-semibold transition ${showFavoritesOnly
                ? 'bg-indigo-700 text-white'
                : 'bg-white text-slate-700 shadow-sm hover:bg-slate-100'
              }`}
          >
            {showFavoritesOnly ? 'Show All Photos' : 'Show Favorites'}
          </button>
        </section>

        {/* Show a loading message while photos are being fetched */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">

            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

            <p className="mt-4 text-slate-600">
              Loading photos...
            </p>
          </div>
        )}

        {/* Show an error message if fetching fails */}
        {error && !loading && (
          <div className="rounded-lg bg-red-50 p-5 text-center text-red-700">
            <p className="font-semibold">Unable to load photos.</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {/* Display photos after successful loading */}
        {!loading && !error && (
          <>
            {/* Show the number of photos currently visible */}
            <p className="mb-4 text-sm text-slate-500">
              {filteredPhotos.length} photo
              {filteredPhotos.length !== 1 ? 's' : ''} found
            </p>

            {/* Responsive photo grid: */}
            {filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Render one PhotoCard for each filtered photo */}
                {filteredPhotos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    isFavorite={favorites.includes(photo.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              // Show this message when search or favorites has no results
              <div className="rounded-lg bg-white py-16 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-700">
                  No photos found
                </p>

                <p className="mt-2 text-slate-500">
                  Try a different search or check your favorites.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}


export default App