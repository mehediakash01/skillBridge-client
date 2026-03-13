const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "short",
  day: "numeric",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export const parseBookingDate = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid booking date");
  }
  return date;
};

export const formatBookingDateUTC = (value: string | Date) => {
  return DATE_FORMATTER.format(parseBookingDate(value));
};

export const formatBookingTimeUTC = (value: string | Date) => {
  return TIME_FORMATTER.format(parseBookingDate(value));
};

export const formatBookingRangeUTC = (start: string | Date, end: string | Date) => {
  return `${formatBookingTimeUTC(start)} - ${formatBookingTimeUTC(end)}`;
};
