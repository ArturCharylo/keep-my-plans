import { useMemo } from 'react';
import styles from './ReactionSummary.module.css';
import { USER_ID_PREFIX_LENGTH } from '../../constants';

export const ReactionSummary = ({ reactions, totalMembers }) => {
  const summary = useMemo(() => {
    if (!reactions) return { watchedCount: 0, averageRating: 0, opinions: [] };

    let watchedCount = 0;
    let totalRating = 0;
    let ratingCount = 0;
    const opinions = [];

    Object.entries(reactions).forEach(([userId, reaction]) => {
      if (reaction.watched) {
        watchedCount += 1;
      }

      if (reaction.rating) {
        totalRating += reaction.rating;
        ratingCount += 1;
      }

      if (reaction.opinion && reaction.opinion.trim()) {
        opinions.push({
          userId: userId.substring(0, USER_ID_PREFIX_LENGTH),
          opinion: reaction.opinion,
          rating: reaction.rating
        });
      }
    });

    const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;

    return { watchedCount, averageRating, opinions };
  }, [reactions]);

  if (!reactions || Object.keys(reactions).length === 0) {
    return (
      <div className={styles.emptyContainer}>
        Brak reakcji
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Obejrzano:</span>
          <span className={styles.statValue}>
            {summary.watchedCount}{totalMembers ? `/${totalMembers}` : ''}
          </span>
        </div>
        {summary.averageRating > 0 && (
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Średnia:</span>
            <span className={styles.statValue}>
              ★ {summary.averageRating}
            </span>
          </div>
        )}
      </div>

      {summary.opinions.length > 0 && (
        <div className={styles.opinionsList}>
          <h4 className={styles.opinionsHeading}>Komentarze:</h4>
          {summary.opinions.map((op, idx) => (
            <div key={`${op.userId}-${idx}`} className={styles.opinionItem}>
              <div className={styles.opinionHeader}>
                <span className={styles.userId}>User {op.userId}</span>
                {op.rating && <span className={styles.userRating}>★ {op.rating}</span>}
              </div>
              <p className={styles.opinionText}>{op.opinion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
