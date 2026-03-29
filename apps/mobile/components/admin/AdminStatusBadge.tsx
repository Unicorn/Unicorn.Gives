import { Badge } from '@/components/ui/Badge';

interface AdminStatusBadgeProps {
  status: string;
}

const STATUS_LABELS: Record<string, string> = {
  published: 'Published',
  approved: 'Approved',
  draft: 'Draft',
  pending: 'Pending',
  archived: 'Archived',
};

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const label = STATUS_LABELS[status] ?? status;
  const mappedStatus = (STATUS_LABELS[status] ? status : 'archived') as
    | 'published'
    | 'approved'
    | 'draft'
    | 'pending'
    | 'archived';

  return <Badge label={label} variant="status" status={mappedStatus} />;
}
