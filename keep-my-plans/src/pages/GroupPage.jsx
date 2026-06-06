import { useEffect, Suspense, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './GroupPage.module.css';
import { useAuth } from '../hooks/useAuth';
import { useGroup } from '../hooks/useGroup';
import { useViewMode } from '../hooks/useViewMode';
import { addMemberToGroup } from '../services/groupService';
import { GroupHeader } from '../components/group/GroupHeader';
import { ViewToggle } from '../components/common/ViewToggle';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { QueueView } from '../components/queue/QueueView';
import { EventsView } from '../components/events/EventsView';
import { VIEW_MODES, ROUTES } from '../constants';

const GroupPageContent = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { group, loading: groupLoading, error: groupError } = useGroup(groupId);
  const { viewMode, setViewMode } = useViewMode();

  useEffect(() => {
    const ensureMembership = async () => {
      if (!user || !group) return;

      const isMember = group.members?.includes(user.uid);
      if (!isMember) {
        try {
          await addMemberToGroup(groupId, user.uid);
        } catch (error) {
          console.error('Failed to add user to group:', error);
        }
      }
    };

    ensureMembership();
  }, [user, group, groupId]);

  const handleLeaveGroup = useCallback(() => {
    if (window.confirm('Czy na pewno chcesz opuścić tę grupę?')) {
      localStorage.removeItem('watchqueue_group');
      navigate(ROUTES.HOME);
    }
  }, [navigate]);

  if (authLoading || groupLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (groupError || !group) {
    return (
      <div className={styles.errorWrapper}>
        <ErrorMessage
          message="Nie udało się załadować grupy. Prawdopodobnie nie istnieje lub nie masz do niej dostępu."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const membersCount = group.members ? group.members.length : 0;

  return (
    <div className={styles.container}>
      <GroupHeader
        groupName={group.name}
        inviteCode={group.inviteCode}
        membersCount={membersCount}
        onLeave={handleLeaveGroup}
      />

      <main className={styles.main}>
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />

        {viewMode === VIEW_MODES.QUEUE ? (
          <QueueView groupId={groupId} groupMembersCount={membersCount} />
        ) : (
          <EventsView groupId={groupId} />
        )}
      </main>
    </div>
  );
};

export const GroupPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <GroupPageContent />
    </Suspense>
  );
};
