
import { useCallback, useMemo, useState } from 'react'

import useFetchPhotos from './hooks/useFetchPhotos'
import useFavorites from './hooks/useFavorites'
import PhotoCard from './components/PhotoCard'

function App() {
  // Get photos and request status from the custom fetching hook
  const { photos, loading, error } = useFetchPhotos()

  // Get the favorites array and reducer dispatch function
  const { favorites, dispatch } = useFavorites()

  // Track the current author search text
  const [searchTerm, setSearchTerm] = useState('')

  // Track whether the gallery is showing favorites only
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Memoize the search handler so it keeps the same function reference
  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value)
  }, [])

  // Send a toggle action to the favorites reducer
  const handleToggleFavorite = useCallback((photoId) => {
    dispatch({
      type: 'TOGGLE_FAVORITE',
      payload: photoId,
    })
  }, [dispatch])

  // Filter photos by author and favorite status
  // useMemo avoids recalculating unless one of these dependencies changes
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // Match the search text against the author's name
      const matchesSearch = photo.author
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      // If favorites-only is active, keep favorited photos
      const matchesFavorites = showFavoritesOnly
        ? favorites.includes(photo.id)
        : true

      // The photo must match both filters
      return matchesSearch && matchesFavorites
    })
  }, [photos, searchTerm, showFavoritesOnly, favorites])

  return (

    <main className="gallery-background min-h-screen px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header section */}
        <header className="mb-10 text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Your visual collection
          </div>

          {/* Main gallery heading */}
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Celebrare
            <span className="block bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Photo Gallery
            </span>
          </h1>


          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Discover beautiful moments, explore photographers, and keep the
            images you love close.
          </p>
        </header>

        {/* Search and filter control panel */}
        <section className="mb-8 rounded-2xl border border-white/80 bg-white/70 p-4 shadow-lg shadow-indigo-100/40 backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


            <div className="relative w-full sm:max-w-md">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">

                ⌕
              </span>

              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search photographers..."
                aria-label="Search photos by author"
                className="w-full rounded-xl border border-slate-200 bg-white/90 py-3.5 pl-11 pr-4 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {/* Favorites filter button */}
            <button
              type="button"
              onClick={() => setShowFavoritesOnly((current) => !current)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${showFavoritesOnly
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50'
                }`}
            >

              <span>{showFavoritesOnly ? '♥' : '♡'}</span>


              {showFavoritesOnly ? 'Show All Photos' : 'Show Favorites'}

              {/* Show the current number of saved favorites */}
              <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs">
                {favorites.length}
              </span>
            </button>
          </div>
        </section>

        {/* Results summary */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {showFavoritesOnly ? 'Your Favorites' : 'Explore Photos'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredPhotos.length} photos to discover
            </p>
          </div>


          <span className="hidden rounded-full border border-white bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm sm:inline-block">
            Curated for you
          </span>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white bg-white/60 py-24 shadow-sm">

            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

            <p className="mt-5 font-medium text-slate-600">
              Gathering beautiful photos...
            </p>
          </div>
        )}


        {error && !loading && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">
              We couldn’t load the photos.
            </p>

            <p className="mt-2 text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Gallery grid appears after successful loading */}
        {!loading && !error && (
          <>
            {filteredPhotos.length > 0 ? (
              // Responsive layout
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Render a card for every filtered photo */}
                {filteredPhotos.map((photo, index) => (
                  <div
                    key={photo.id}

                    style={{ animationDelay: `${index * 45}ms` }}
                  >
                    <PhotoCard
                      photo={photo}
                      // Check whether this photo ID is saved as a favorite
                      isFavorite={favorites.includes(photo.id)}
                      // Pass the favorite click handler to the card
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </div>
                ))}
              </div>
            ) : (
              // Empty state for searches or an empty favorites list
              <div className="rounded-2xl border border-white bg-white/70 px-6 py-20 text-center shadow-sm">
                <div className="mb-4 text-5xl text-indigo-300">♡</div>

                <h3 className="text-xl font-bold text-slate-800">
                  Nothing to see here yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-slate-500">
                  Try another search, or add some photos to your favorites.
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
