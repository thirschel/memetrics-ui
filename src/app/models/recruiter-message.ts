export class RecruiterMetrics {
   public totalMessages: number;
   public totalIncomingMessages: number;
   public totalOutgoingMessages: number;
   public uniqueContacts: number;
   public messagesByDayOfWeek: RecruiterDayOfWeek[];
   public messagePerformance: RecruiterPerformance[];
   public weekOverWeek: RecruiterWeekOverWeek[];
   public currentPeriodLabel: string;
   public priorPeriodLabel?: string;

}

export class RecruiterDayOfWeek {
   public total: number;
   public dayOfWeek: string;
}

export class RecruiterPerformance {
   public dayNumber: any;
   public count: number;
   public isPreviousPeriod: boolean;

   public dayLabel: string;
}

export class RecruiterWeekOverWeek {
   public weekOf: Date;
   public total: number;

   public weekOfText: string;
}
