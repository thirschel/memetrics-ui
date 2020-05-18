export class CallMetrics {
   public totalCalls: number;
   public totalCallsIncoming: number;
   public totalCallsOutgoing: number;
   public totalDurationSeconds: number;
   public totalKnownDurationSeconds: number;
   public totalKnownMaleDurationSeconds: number;
   public totalKnownFemaleDurationSeconds: number;
   public callsByDayOfWeek: CallsDayOfWeek[];
   public callsByHour: CallHour[];
   public callPerformance: CallPerformance[];
   public weekOverWeek: CallWeekOverWeek[];
   public currentPeriodLabel: string;
   public priorPeriodLabel?: string;

}

export class CallsDayOfWeek {
   public total: number;
   public incoming: number;
   public outgoing: number;
   public dayOfWeek: string;
}

export class CallHour {
   public total: number;
   public incoming: number;
   public outgoing: number;
   public hour: number;
   public day: number;
}

export class CallPerformance {
   public dayNumber: any;
   public count: number;
   public isPreviousPeriod: boolean;

   public dayLabel: string;
}

export class CallWeekOverWeek {
   public weekOf: Date;
   public total: number;

   public weekOfText: string;
}

