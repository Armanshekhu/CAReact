import React, { useState } from 'react'
import './index.css'

const App = () => {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchUserData = async (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('Please enter a GitHub username')
      return
    }

    setLoading(true)
    setError('')
    setUser(null)
    setRepos([])

    try {
      const userResponse = await fetch(`https://api.github.com/users/${username}`)
      
      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          setError(`User "${username}" not found on GitHub. Please check the username and try again.`)
        } else {
          setError('Failed to fetch user data. Please try again later.')
        }
        setLoading(false)
        return
      }

      const userData = await userResponse.json()
      setUser(userData)
      
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?sort=created&per_page=5`
      )

      if (reposResponse.ok) {
        const reposData = await reposResponse.json()
        setRepos(reposData)
      } else {
        setError('Failed to fetch repositories. Please try again later.')
      }
    } catch (err) {
      setError('An error occurred while fetching data. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>GitHub User Search</h1>
      
      <form onSubmit={fetchUserData} className="search-form">
        <input
          type="text"
          placeholder="Enter GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {user && (
        <div className="user-profile">
          <div className="profile-header">
            <img src={user.avatar_url} alt={user.login} className="avatar" />
            <div className="profile-info">
              <h2>{user.name || user.login}</h2>
              <p className="username">@{user.login}</p>
              {user.bio && <p className="bio">{user.bio}</p>}
              <div className="stats">
                <div className="stat">
                  <span className="stat-label">Followers</span>
                  <span className="stat-value">{user.followers}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Following</span>
                  <span className="stat-value">{user.following}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Public Repos</span>
                  <span className="stat-value">{user.public_repos}</span>
                </div>
              </div>
              {user.location && <p className="location">📍 {user.location}</p>}
              {user.company && <p className="company">🏢 {user.company}</p>}
            </div>
          </div>

          {repos.length > 0 && (
            <div className="repositories">
              <h3>Latest Repositories</h3>
              <ul className="repos-list">
                {repos.map((repo) => (
                  <li key={repo.id} className="repo-item">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      {repo.name}
                    </a>
                    {repo.description && <p className="repo-description">{repo.description}</p>}
                    <div className="repo-meta">
                      {repo.language && <span className="language">💻 {repo.language}</span>}
                      <span className="stars">⭐ {repo.stargazers_count}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
