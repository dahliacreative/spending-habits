import moment from "moment";

const usePeriod = () => {
  const today = moment();
  const thisYear = today.format("YYYY");
  const thisMonth = today.format("MM");
  const thisDay = today.format("DD");

  const startMonth =
    parseInt(thisDay, 10) > 24 ? thisMonth : parseInt(thisMonth, 10) - 1;

  const endMonth =
    parseInt(thisDay, 10) > 24 ? parseInt(thisMonth, 10) + 1 : thisMonth;

  const startOfPeriod = moment(`25/${startMonth}/${thisYear}`, "DD/MM/YYYY");
  const endOfPeriod = moment(`26/${endMonth}/${thisYear}`, "DD/MM/YYYY");

  const startOfCurrentWeek = moment().startOf("week").add(1, "day");
  const endOfCurrentWeek = moment().endOf("week").add(1, "day");

  const daysLeft = endOfPeriod.diff(today, "day");
  const weeksLeft = endOfPeriod.diff(startOfCurrentWeek, "week");

  return {
    startOfPeriod,
    endOfPeriod,
    weeksLeft,
    daysLeft,
    startOfCurrentWeek,
    endOfCurrentWeek,
  };
};

export default usePeriod;
