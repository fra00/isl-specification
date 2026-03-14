export function ProgressBar(props: { value?: number; color?: string }): React.Element;
export function ProgressSlider(props: { value?: number; onChange: (newValue: number) => void; isDisabled?: boolean }): React.Element;
export function StatusBadge(props: { status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' }): React.Element;
export function PriorityBadge(props: { priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }): React.Element;
export function RiskBadge(props: { risk: 'LOW' | 'MEDIUM' | 'HIGH' }): React.Element;
export function ConfirmationDialog(props: { isOpen: boolean; message: string; onConfirm: () => void; onCancel?: () => void }): React.Element;
export default function NotificationService(props: { children?: React.ReactNode }): React.Element;
export function useNotification(): { showSuccess: (message: string) => void; showError: (message: string) => void; showInfo: (message: string) => void; showWarning: (message: string) => void; };