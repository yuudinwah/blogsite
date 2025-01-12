export const dateFormat = (date: Date | string, format: string = 'MMMM dd, yyyy'): string => {
    const d = new Date(date);
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    const shortMonths = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    const day = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();
  
    const padZero = (num: number): string => {
      return num.toString().padStart(2, '0');
    };
  
    return format.replace(/(MMM+|MM|dd|yyyy|yy)/g, (match) => {
      switch (match) {
        case 'MMMM':
          return months[month];
        case 'MMM':
          return shortMonths[month];
        case 'MM':
          return padZero(month + 1);
        case 'dd':
          return padZero(day);
        case 'yyyy':
          return year.toString();
        case 'yy':
          return year.toString().slice(-2);
        default:
          return match;
      }
    });
  };
  