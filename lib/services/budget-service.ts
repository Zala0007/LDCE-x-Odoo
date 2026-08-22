import { differenceInCalendarDays, eachDayOfInterval, format, isSameDay, startOfDay } from "date-fns";

type BudgetActivity = { date: Date; cost: number | null; activity: { estimatedCost: number } };
type BudgetStop = { startDate: Date; endDate: Date; transportCost: number; stayCost: number; city: { name: string; estimatedMealCost: number; estimatedStayCost: number }; itineraryActivities: BudgetActivity[] };
export type BudgetTrip = { startDate: Date; endDate: Date; budget: number | null; stops: BudgetStop[] };

export type BudgetSummary = ReturnType<typeof calculateTripBudget>;

export function calculateTripBudget(trip: BudgetTrip) {
  const transport = trip.stops.reduce((sum, stop) => sum + stop.transportCost, 0);
  const stay = trip.stops.reduce((sum, stop) => {
    if (stop.stayCost > 0) return sum + stop.stayCost;
    const nights = Math.max(1, differenceInCalendarDays(stop.endDate, stop.startDate));
    return sum + nights * stop.city.estimatedStayCost;
  }, 0);
  const meals = trip.stops.reduce((sum, stop) => {
    const days = differenceInCalendarDays(stop.endDate, stop.startDate) + 1;
    return sum + days * stop.city.estimatedMealCost;
  }, 0);
  const activities = trip.stops.flatMap((stop) => stop.itineraryActivities).reduce((sum, item) => sum + (item.cost ?? item.activity.estimatedCost), 0);
  const total = transport + stay + meals + activities;
  const totalBudget = trip.budget ?? 0;
  const remaining = totalBudget - total;
  const tripDays = Math.max(1, differenceInCalendarDays(trip.endDate, trip.startDate) + 1);
  const days = eachDayOfInterval({ start: trip.startDate, end: trip.endDate }).map((date) => {
    const activeStops = trip.stops.filter((stop) => date >= startOfDay(stop.startDate) && date <= startOfDay(stop.endDate));
    const mealCost = activeStops.reduce((sum, stop) => sum + stop.city.estimatedMealCost, 0);
    const stayCost = activeStops.reduce((sum, stop) => {
      const nights = Math.max(1, differenceInCalendarDays(stop.endDate, stop.startDate));
      const resolved = stop.stayCost > 0 ? stop.stayCost : nights * stop.city.estimatedStayCost;
      const chargeStay = date < startOfDay(stop.endDate) || isSameDay(stop.startDate, stop.endDate);
      return sum + (chargeStay ? resolved / nights : 0);
    }, 0);
    const activityCost = activeStops.flatMap((stop) => stop.itineraryActivities).filter((item) => isSameDay(item.date, date)).reduce((sum, item) => sum + (item.cost ?? item.activity.estimatedCost), 0);
    const transportCost = trip.stops.filter((stop) => isSameDay(stop.startDate, date)).reduce((sum, stop) => sum + stop.transportCost, 0);
    return { date: format(date, "MMM d"), fullDate: date, transport: transportCost, stay: stayCost, meals: mealCost, activities: activityCost, total: transportCost + stayCost + mealCost + activityCost };
  });
  return {
    totalBudget,
    transport,
    stay,
    meals,
    activities,
    total,
    remaining,
    percentageUsed: totalBudget > 0 ? (total / totalBudget) * 100 : 0,
    averagePerDay: total / tripDays,
    tripDays,
    overBudget: totalBudget > 0 && total > totalBudget,
    categories: [
      { name: "Transport", value: Math.round(transport), color: "#e6775c" },
      { name: "Stay", value: Math.round(stay), color: "#1e5948" },
      { name: "Activities", value: Math.round(activities), color: "#f1b24a" },
      { name: "Meals", value: Math.round(meals), color: "#789b88" },
    ],
    days,
  };
}
