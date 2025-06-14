import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Search.module.css';
import { searchSW } from '../../api/searchApi';

interface SearchResult {
  name: string;
  uid: string;
}

const Search: React.FC = () => {
  const [searchType, setSearchType] = useState<'people' | 'films'>('people');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (searchQuery.length === 0) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        setError(null);
        setHasSearched(true);

        try {
          const data = await searchSW(searchType, searchQuery);
          setResults(data);
        } catch (err) {
          setError('Failed to fetch results. Please try again.');
        } finally {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, searchType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchForm}>
        <h2 className={styles.searchTitle}>What are you searching for?</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                className={styles.radioInput}
                name="searchType"
                value="people"
                checked={searchType === 'people'}
                onChange={(e) => setSearchType(e.target.value as 'people')}
              />
              People
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                className={styles.radioInput}
                name="searchType"
                value="films"
                checked={searchType === 'films'}
                onChange={(e) => setSearchType(e.target.value as 'films')}
              />
              Movies
            </label>
          </div>

          <input
            type="text"
            className={styles.searchBox}
            placeholder={searchType === 'people' ? 'e.g. Chewbacca, Yoda, Boba Fett' : 'e.g. A New Hope, Empire Strikes Back'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            minLength={2}
          />

          <button 
            type="submit" 
            className={`${styles.searchButton} ${isSearching ? styles.searching : ''} ${searchQuery.length >= 2 ? styles.active : ''}`}
          >
            {isSearching ? 'SEARCHING...' : 'SEARCH'}
          </button>
        </form>
      </div>

      <div className={styles.resultsContainer}>
        <h2 className={styles.resultsTitle}>Results</h2>
        {isSearching ? (
          <div className={styles.loading}>Searching...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : !hasSearched ? (
          <div className={styles.noResults}>
            There are zero matches.<br />
            Use the form to search for People or Movies.
          </div>
        ) : results.length === 0 ? (
          <div className={styles.noResults}>No results found</div>
        ) : (
          <div className={styles.results}>
            {results.map((result) => (
              <div key={result.uid} className={styles.resultItem}>
                <span className={styles.resultName}>{result.name}</span>
                <Link
                  to={`/details/${searchType}/${result.uid}`}
                  className={styles.detailsButton}
                >
                  See Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search; 