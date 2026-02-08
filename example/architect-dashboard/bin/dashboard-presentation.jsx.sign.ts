export default function DashboardPresentation(props: {
    initialTimeframe?: string;
    onTimeframeChange?: (timeframe: string, startDate?: Date, endDate?: Date) => void;
    onViewAllOrders?: () => void;
    onViewAllProducts?: () => void;
}): React.Element;