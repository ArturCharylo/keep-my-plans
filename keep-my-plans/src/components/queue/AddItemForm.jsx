import { useState } from 'react';
import styles from './AddItemForm.module.css';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ITEM_TYPES } from '../../constants';
import { addItem } from '../../services/queueService';
import { useAuth } from '../../hooks/useAuth';

export const AddItemForm = ({ groupId }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    type: ITEM_TYPES.FILM,
    url: '',
    coverUrl: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters long.';
    }

    if (formData.url && !/^https?:\/\/.+/.test(formData.url)) {
      newErrors.url = 'URL must start with http:// or https://';
    }

    if (formData.coverUrl && !/^https?:\/\/.+/.test(formData.coverUrl)) {
      newErrors.coverUrl = 'Cover URL must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear specific error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate() || !user || !groupId) return;

    setLoading(true);

    try {
      await addItem(groupId, {
        title: formData.title.trim(),
        type: formData.type,
        url: formData.url.trim(),
        coverUrl: formData.coverUrl.trim(),
        notes: formData.notes.trim(),
      }, user.uid);

      // Reset form on success
      setFormData({
        title: '',
        type: ITEM_TYPES.FILM,
        url: '',
        coverUrl: '',
        notes: ''
      });
    } catch (err) {
      console.error('Error adding item to queue:', err);
      setSubmitError('An error occurred while adding the item to the queue. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Dodaj do kolejki</h2>

      {submitError && (
        <div className={styles.globalError} aria-live="assertive">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Szczegóły pozycji</legend>
          <Input
            id="item-title"
            label="Tytuł"
            value={formData.title}
            onChange={(e) => handleChange({ target: { name: 'title', value: e.target.value } })}
            placeholder="Wpisz tytuł..."
            error={errors.title}
            required
          />

          <div className={styles.fieldGroup}>
            <label htmlFor="item-type" className={styles.label}>
              Rodzaj <span className={styles.required}>*</span>
            </label>
            <select
              id="item-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value={ITEM_TYPES.FILM}>Film</option>
              <option value={ITEM_TYPES.SERIES}>Serial</option>
              <option value={ITEM_TYPES.MUSIC}>Muzyka</option>
              <option value={ITEM_TYPES.VIDEO}>Wideo</option>
              <option value={ITEM_TYPES.OTHER}>Inne</option>
            </select>
          </div>

          <Input
            id="item-url"
            label="Link URL (opcjonalnie)"
            value={formData.url}
            onChange={(e) => handleChange({ target: { name: 'url', value: e.target.value } })}
            placeholder="https://..."
            error={errors.url}
            type="url"
          />
        </fieldset>

        <Input
          id="item-coverUrl"
          label="URL okładki (opcjonalnie)"
          value={formData.coverUrl}
          onChange={(e) => handleChange({ target: { name: 'coverUrl', value: e.target.value } })}
          placeholder="https://..."
          error={errors.coverUrl}
          type="url"
        />

        <div className={styles.fieldGroup}>
          <label htmlFor="item-notes" className={styles.label}>
            Notatki (opcjonalnie)
          </label>
          <textarea
            id="item-notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Dodatkowe informacje..."
            className={styles.textarea}
            rows={3}
          />
        </div>

        <div className={styles.actions}>
          <Button type="submit" loading={loading} disabled={loading}>
            Dodaj pozycję
          </Button>
        </div>
      </form>
    </div>
  );
};
