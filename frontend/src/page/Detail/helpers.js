export function calculateTimeDifference(targetDate) {
    // Convert the target date string to a Date object
    const targetTime = new Date(targetDate).getTime();
  
    // Get the current time
    const currentTime = new Date().getTime();
  
    // Calculate the difference in milliseconds
    const timeDifference = currentTime - targetTime;
  
    // Calculate the difference in seconds, minutes, hours, and days
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    // Return an object with the time difference values
    if (minutes < 60) {
      return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
    } else if (hours < 24) {
      return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
    } else {
      return days === 1 ? `${days} day ago` : `${hours} days ago`;
    }
  }
  