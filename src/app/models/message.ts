export class MessageMetrics {
   public totalMessages: number;
   public uniqueContacts: number;
   public totalMessagesIncoming: number;
   public totalMessagesOutgoing: number;
   public totalMessagesFemale: number;
   public totalMessagesMale: number;
   public averageOutgoingTextLengthFemale: number;
   public averageOutgoingTextLengthMale: number;
   public messagesByDayOfWeek: MessagesDayOfWeek[];
   public messagesByHour: MessageHour[];
   public messagePerformance: MessagePerformance[];
   public weekOverWeek: MessageWeekOverWeek[];
   public currentPeriodLabel: string;
   public priorPeriodLabel?: string;

}

export class MessagesDayOfWeek {
   public total: number;
   public incoming: number;
   public outgoing: number;
   public dayOfWeek: string;
}

export class MessageHour {
   public total: number;
   public incoming: number;
   public outgoing: number;
   public hour: number;
   public day: number;
}

export class MessagePerformance {
   public dayNumber: any;
   public count: number;
   public isPreviousPeriod: boolean;

   public dayLabel: string;
}

export class MessageWeekOverWeek {
   public weekOf: Date;
   public total: number;

   public weekOfText: string;
}
