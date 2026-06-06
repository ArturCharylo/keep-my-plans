1. **Zaktualizuj `src/styles/global.css`**:
   - Podmień zawartość na nowy system zmiennych Glassmorphism, domyślnie używając motywu ciemnego, a jasnego dla `[data-theme="light"]`.
2. **Utwórz hook `src/hooks/useTheme.js`**:
   - Zarządza stanem `theme` ('dark' lub 'light') w `localStorage` (pod kluczem 'keep-my-plans-theme').
   - Ustawia atrybut `data-theme` na `document.documentElement` wewnątrz `useEffect`.
   - Zwraca `{ theme, toggleTheme }`.
3. **Zaktualizuj główny komponent UI (`src/components/common/ViewToggle.jsx` lub `src/components/group/GroupHeader.jsx`)**:
   - Dodaj przycisk do przełączania motywu za pomocą `toggleTheme` (z ikoną słońca/księżyca).
4. **Zaktualizuj wszystkie pliki CSS Modules**:
   - Znajdź użycia i całkowicie usuń stare `background-color`, `background` (jeśli dotyczy kolorów tła) i ewentualnie stare `border`/`box-shadow`.
   - Zastosuj `background: var(--glass-bg); backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); box-shadow: var(--shadow-card); border-radius: var(--radius-lg);` w kontenerach i kartach (np. EventCard, ItemCard, GroupGate, formy).
   - Zastosuj `background: var(--input-bg);` dla inputów, a po `:focus` dodaj `border-color: var(--color-primary); box-shadow: var(--glow-shadow);`.
   - W przyciskach (`Button.module.css`) w `:hover` dodaj `box-shadow: var(--glow-shadow); transform: translateY(-2px);` (pamiętaj o przyciskach usuwania i zmiennej `--color-danger`).
5. **Utwórz komponent `ConfirmModal` (`src/components/common/ConfirmModal.jsx` oraz `ConfirmModal.module.css`)**:
   - Będzie to reużywalny komponent dla potwierdzeń zastępujący `window.confirm`.
   - Z overlayem (`backdrop-filter: blur(4px)`) i modale korzystającym z glassmorphism.
6. **Podmień wszystkie użycia `window.confirm` na `ConfirmModal`**:
   - W `ItemCard.jsx`, `EventCard.jsx`, `GroupPage.jsx` dodaj lokalny stan, obsłuż wywoływanie `ConfirmModal` i wykonuj akcje dopiero po potwierdzeniu z modalu.
7. **Pre-commit checks**:
   - Wykonaj pre commit steps w celu zapewnienia prawidłowego działania kodu.
8. **Zatwierdzenie i submit**:
   - Po poprawkach commitujemy i submittujemy projekt.
