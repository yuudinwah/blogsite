interface DashboardCounterComponentProps {
    title: string;
    value: string | number;
}

export default function DashboardCounterComponent({
    title,
    value,
}: DashboardCounterComponentProps) {

    return (
        <div className={`
            p-6 
            rounded-lg 
            shadow-lg
            bg-white 
            transform 
            transition-all 
            duration-300 
            hover:scale-105
            hover:shadow-xl
        `}>
            <div className="flex items-center justify-between">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {typeof value === "number" ? formatNumber(value) : value}
                    </p>
                </div>
            </div>
        </div>
    );
}

const formatNumber = (number: number): string => {
    return new Intl.NumberFormat('id-ID').format(number);
};