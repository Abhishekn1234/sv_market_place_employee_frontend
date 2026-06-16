import { CommonCard } from "@/components/common/CommonCard";

export function Card({
  title,
  value,
  icon: Icon,
  sub,
}: {
  title: string;
  value: string | number | React.ReactNode;
  icon: any;
  sub?: string;
}) {
  return (
    <CommonCard
      title={
        <div className="flex items-center justify-between w-full">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </div>
      }
      value={
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {value ?? "-"}
        </h2>
      }
      description={
        sub ? (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {sub}
          </p>
        ) : undefined
      }
      className="rounded-2xl shadow-sm border bg-white dark:bg-gray-900 dark:border-gray-800"
      contentClassName="pt-0"
    />
  );
}