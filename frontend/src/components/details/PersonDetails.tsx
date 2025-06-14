import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './PersonDetails.module.css';
import BackButton from '../common/BackButton';
import { getPersonById } from '../../api/personApi';

interface Person {
  result: {
    properties: {
      name: string;
      birth_year: string;
      gender: string;
      eye_color: string;
      hair_color: string;
      height: string;
      mass: string;
      films: Array<{
        uid: string;
        title: string;
      }>;
    };
  };
}

const PersonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const data = await getPersonById(id!);
        setPerson(data);
      } catch (error) {
        console.error('Error fetching person:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerson();
  }, [id]);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!person) {
    return <div className={styles.error}>Person not found</div>;
  }

  const { properties } = person.result;

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>{properties.name}</h1>
      
      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Details</h2>
          <div className={styles.detailsList}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Birth Year:</span>
              <span className={styles.value}>{properties.birth_year}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Gender:</span>
              <span className={styles.value}>{properties.gender}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Eye Color:</span>
              <span className={styles.value}>{properties.eye_color}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Hair Color:</span>
              <span className={styles.value}>{properties.hair_color}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Height:</span>
              <span className={styles.value}>{properties.height}cm</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Mass:</span>
              <span className={styles.value}>{properties.mass}kg</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Movies</h2>
          <div className={styles.moviesList}>
            {properties.films?.map((film, index) => (
              <React.Fragment key={film.uid}>
                <Link
                  to={`/details/films/${film.uid}`}
                  className={styles.movieLink}
                >
                  {film.title}
                </Link>
                {index < properties.films.length - 1 && (
                  <span className={styles.movieSeparator}>,</span>
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

export default PersonDetails; 