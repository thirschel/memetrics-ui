export class TooltipHelper {

   public static dayFormatter(day: number) {
      switch (day) {
         case 1:
            return 'Monday';
         case 2:
            return 'Tuesday';
         case 3:
            return 'Wednesday';
         case 4:
            return 'Thursday';
         case 5:
            return 'Friday';
         case 6:
            return 'Saturday';
         case 7:
            return 'Sunday';
      }
   }

   public static hourFormatter(hour: number) {
      const suffix = hour >= 12 && hour !== 24 ? 'pm' : 'am';
      hour = hour > 12 ? hour - 12 : hour;
      return `${hour}:00${suffix} - ${hour}:59${suffix}`;
   }

   public static generateStackedBarChartTooltip(labels: Array<any>) {
      return (d, z, activeSeries: number) => {
         let html = `<div class='x-value'>${d.data[ labels[ 0 ].xProperty ]}</div>`;
         labels.forEach((label, i) => {
            const yClass = i === activeSeries ? `active` : ``;
            html += `<div class='${yClass} y-value'>
         <span class="color-block" style="background:${z(label.yProperty)}"></span>
         <span class="label">${label.value} </span><span class="value">${d.data[ label.yProperty ]}</span></div>`;
         });
         return html;
      };
   }

}
