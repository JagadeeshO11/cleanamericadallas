import ProtectedRoute from '../components/ProtectedRoute';
import WorkerLayout from '../pages/worker/WorkerLayout';

export default function WorkerRoutes() {
  return (
    <ProtectedRoute roles={['worker']}>
      <div className="app-worker-theme">
        <WorkerLayout />
      </div>
    </ProtectedRoute>
  );
}
