
import React from 'react';
import { FileStatus } from '../types';

interface StatusBadgeProps {
  status: FileStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';

  const statusClasses = {
    [FileStatus.InProgress]: 'bg-yellow-100 text-yellow-800',
    [FileStatus.Resolved]: 'bg-green-100 text-green-800',
  };

  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

export default StatusBadge;
