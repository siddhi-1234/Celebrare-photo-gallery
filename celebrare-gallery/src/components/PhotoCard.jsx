// PhotoCard receives one photo, favorite status, and a click handler from App.jsx
function PhotoCard({ photo, isFavorite, onToggleFavorite }) {
    return (

        <article className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg">
            {/* Display the photo using its Picsum image URL */}
            <img
                src={photo.download_url}
                alt={`Photo by ${photo.author}`}
                className="h-56 w-full object-cover"
                loading="lazy" // Load images as they approach the visible screen area
            />

            {/* Card footer contains the author and favorite button */}
            <div className="flex items-center justify-between gap-3 p-4">
                <p className="truncate font-medium text-gray-800">
                    {photo.author}
                </p>

                {/* Button adds or removes this photo from favorites */}
                <button
                    type="button"
                    onClick={() => onToggleFavorite(photo.id)} // Send this photo ID to App.jsx
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold transition ${isFavorite
                        ? 'bg-red-100 text-red-600' // Styling when photo is favorited
                        : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                        }`}
                >
                    {/* Show a filled heart for favorites, otherwise an empty heart */}
                    {isFavorite ? '♥' : '♡'}
                </button>
            </div>
        </article>
    )
}


export default PhotoCard