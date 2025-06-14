import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './MovieDetails.module.css';
import BackButton from '../common/BackButton';
import { getMovieById } from '../../api/movieApi';

interface Movie {
  result: {
    properties: {
      title: string;
      opening_crawl: string;
      characters: Array<{
        uid: string;
        name: string;
      }>;
    };
  };
}

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieById(id!);
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!movie) {
    return <div className={styles.error}>Movie not found</div>;
  }

  const { properties } = movie.result;

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>{properties.title}</h1>
      
      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Opening Crawl</h2>
          <div className={styles.openingCrawl}>
            {properties.opening_crawl.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Characters</h2>
          <div className={styles.charactersList}>
            {properties.characters?.map((character, index) => (
              <React.Fragment key={character.uid}>
                <Link
                  to={`/details/people/${character.uid}`}
                  className={styles.characterLink}
                >
                  {character.name}
                </Link>
                {index < properties.characters.length - 1 && (
                  <span className={styles.characterSeparator}>,</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <BackButton />
      </div>
    </div>
  );
};

export default MovieDetails; 