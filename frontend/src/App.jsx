import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [jokes, setJokes] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [amazonProducts, setAmazonProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get('/api/jokes')
      .then((response) => {
        setJokes(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchKeyword.trim()) {
      setError('Please enter a search keyword')
      return
    }

    setIsLoading(true)
    setError('')
    setAmazonProducts([])

    try {
      const response = await axios.get(`/api/amazon-search/${encodeURIComponent(searchKeyword)}`)
      setAmazonProducts(response.data.products)
    } catch (error) {
      console.error('Search error:', error)
      setError(error.response?.data?.error || 'Failed to search Amazon products')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      <h1>Welcome to OurProject1</h1>
      
      {/* Jokes Section */}
      <section className="jokes-section">
        <h2>Jokes</h2>
        <p>JOKES: {jokes.length}</p>
        {jokes.map((joke) => (
          <div key={joke.id} className="joke-item">
            <h3>{joke.title}</h3>
            <p>{joke.content}</p>
          </div>
        ))}
      </section>

      {/* Amazon Search Section */}
      <section className="amazon-search-section">
        <h2>Amazon Product Search</h2>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Enter product keyword (e.g., laptop, headphones)"
              className="search-input"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="search-button"
              disabled={isLoading || !searchKeyword.trim()}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="loading-message">
            <p>🔍 Searching Amazon products...</p>
          </div>
        )}

        {/* Products Output Pane */}
        {amazonProducts.length > 0 && (
          <div className="products-output">
            <h3>Search Results for "{searchKeyword}"</h3>
            <div className="products-grid">
              {amazonProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.image !== 'N/A' ? (
                      <img src={product.image} alt={product.title} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="product-details">
                    <h4 className="product-title">{product.title}</h4>
                    <p className="product-price">
                      <strong>Price: {product.price}</strong>
                    </p>
                    <p className="product-rating">
                      Rating: {product.rating}
                    </p>
                    {product.link !== 'N/A' && (
                      <a 
                        href={product.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="product-link"
                      >
                        View on Amazon
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default App