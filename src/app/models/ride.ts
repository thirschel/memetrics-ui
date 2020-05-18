export class RideMetrics {
   public totalRides: number;
   public averageSecondsWaiting: number;
   public totalSecondsWaiting: number;
   public averageSecondsDriving: number;
   public totalSecondsDriving: number;
   public shortestRide: number;
   public longestRide: number;
   public averageDistance: number;
   public totalDistance: number;
   public totalPrice: number;
   public averagePrice: number;
   public mostExpensivePrice: number;
   public farthestDistance: number;
   public ridesByDayOfWeek: RidesDayOfWeek[];
   public ridesByHour: RideHour[];
   public ridePerformance: RidePerformance[];
   public weekOverWeek: RideWeekOverWeek[];
   public currentPeriodLabel: string;
   public priorPeriodLabel?: string;
}

export class RidesDayOfWeek {
   public total: number;
   public dayOfWeek: string;
}

export class RideHour {
   public total: number;
   public hour: number;
   public day: number;
}

export class RidePerformance {
   public dayNumber: any;
   public milesSum: number;
   public isPreviousPeriod: boolean;

   public dayLabel: string;
}

export class RideWeekOverWeek {
   public weekOf: Date;
   public total: number;

   public weekOfText: string;
}
