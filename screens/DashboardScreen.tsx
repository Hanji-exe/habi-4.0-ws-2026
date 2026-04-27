import { ScrollView, Text, View } from "react-native";

import { Card } from "../components/Card";

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <Card className="flex-1">
      <Text className="text-xs font-medium text-neutral-500">{label}</Text>
      <Text className="mt-2 text-2xl font-bold text-neutral-900">{value}</Text>
      <Text className="mt-1 text-xs text-neutral-500">{helper}</Text>
    </Card>
  );
}

function QuickAction({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Card className="flex-row items-center justify-between">
      <View className="gap-1">
        <Text className="text-base font-semibold text-neutral-900">
          {title}
        </Text>
        <Text className="text-xs text-neutral-500">{subtitle}</Text>
      </View>
      <View className="h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
        <Text className="text-neutral-900">{">"}</Text>
      </View>
    </Card>
  );
}

export function DashboardScreen() {
  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 pb-10 pt-6"
    >
      <View className="gap-1">
        <Text className="text-sm font-medium text-neutral-500">
          Welcome back
        </Text>
        <Text className="text-3xl font-bold text-neutral-900">Dashboard</Text>
      </View>

      <View className="mt-6 flex-row gap-3">
        <StatCard label="Today" value="3" helper="Tasks completed" />
        <StatCard label="Streak" value="7" helper="Days active" />
      </View>

      <View className="mt-3">
        <Card className="bg-black">
          <Text className="text-sm font-medium text-white/70">Focus</Text>
          <Text className="mt-2 text-2xl font-bold text-white">
            Plan your next 15 minutes
          </Text>
          <Text className="mt-2 text-xs text-white/70">
            Keep it small. Keep it consistent.
          </Text>
        </Card>
      </View>

      <View className="mt-8 gap-3">
        <Text className="text-sm font-semibold text-neutral-900">
          Quick actions
        </Text>
        <QuickAction
          title="Add a task"
          subtitle="Capture it before it disappears"
        />
        <QuickAction title="Review week" subtitle="See what you shipped" />
        <QuickAction title="Set a goal" subtitle="Pick one thing to improve" />
      </View>
    </ScrollView>
  );
}
