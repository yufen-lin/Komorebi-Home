import type { ExpirationStatus } from '@/type';

export function getDateDiffInfo(expirationDate?: string | null): {
  daysLeft: number | null;
  label: string;
  status: ExpirationStatus;
  statusColor: string;
} {
  if (!expirationDate)
    return {
      daysLeft: null,
      label: '未設定期限',
      status: 'normal',
      statusColor: 'transparent',
    };

  const today = new Date();
  const target = new Date(expirationDate);

  const diffTime = target.getTime() - today.getTime();
  const daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let status: ExpirationStatus = 'normal';
  let statusColor: string = 'transparent';

  const absDays = Math.abs(daysLeft);
  const sign = daysLeft < 0 ? '+' : '-';
  const label = `${expirationDate} ( D${sign}${absDays} )`;

  if (daysLeft < 0) {
    status = 'expired';
    statusColor = '#737373';
  } else if (daysLeft <= 3) {
    status = 'danger';
    statusColor = '#d0494d';
  } else if (daysLeft <= 7) {
    status = 'warning';
    statusColor = '#edc03a';
  } else if (daysLeft <= 14) {
    status = 'safe';
    statusColor = '#76b550';
  }

  return { daysLeft, label, status, statusColor };
}
