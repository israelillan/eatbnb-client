export const roundToHour= (date) => {
    const roundedValue = new Date(date);
    roundedValue.setHours(roundedValue.getHours() + Math.floor(roundedValue.getMinutes()/60));
    roundedValue.setMinutes(0, 0, 0);
    return roundedValue;
}