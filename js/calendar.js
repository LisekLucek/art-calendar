// const MONTHS =
// [
// 	"Styczeń",     "Luty",     "Marzec",
// 	"Kwiecień",    "Maj",      "Czerwiec",
// 	"Lipiec",      "Sierpień", "Wrzesień",
// 	"Październik", "Listopad", "Grudzień"
// ];
const MONTHS =
[
	"January", "February", "March",
	"April",   "May",      "June",
	"July",    "August",   "September",
	"October", "November", "December"
];

class Calendar
{
	constructor(year)
	{
		this.year = year;

		this.calendarEl = document.createElement("div");
		this.calendarEl.classList.add("calendar");

		let calendarHeaderEl = document.createElement("h1");
		calendarHeaderEl.append(year);
		this.calendarEl.append(calendarHeaderEl);

		this.months = [];

		for (let i = 1; i <= 12; i++)
		{
			let month = this._addMonth(i);
			this.months.push(month);
			this.calendarEl.append(month.monthEl);
		}
	}

	// Day and month builders
	_addDay(dayDate)
	{
		let dayContentsEl = document.createElement("div");
		dayContentsEl.classList.add("dayContents");

		let dayDrop = new DropElement(dayContentsEl);
		dayDrop.el.classList.add("day");
		dayDrop.el.classList.add(`day-${ dayDate.getDay() }`);

		// Offset for the first day
		if (dayDate.getDate() == 1)
			dayDrop.el.style.gridColumn = `1 / ${ (dayDate.getDay() + 6) % 7 + 2 }`;
		
		let dayLabelEl = document.createElement("div");
		dayLabelEl.classList.add("dayLabel");
		dayLabelEl.append(dayDate.getDate());



		dayDrop.el.append(dayLabelEl, dayContentsEl);

		let day =
		{
			dropEl: dayDrop,
			dayEl: dayDrop.el,
			dayContentsEl
		};

		return day;
	}

	_addMonth(monthNo)
	{
		let dayDate = new Date(`${ this.year }-${ monthNo }-01`);
		let monthEl = document.createElement("div");
		monthEl.classList.add("month");

		let header = document.createElement("div");
		header.classList.add("monthHeder");
		header.append(MONTHS[monthNo - 1]);

		let daysContainerEl = document.createElement("div");
		daysContainerEl.classList.add("daysContainer");

		monthEl.append(header, daysContainerEl);

		let month =
		{
			monthEl,
			days: []
		};

		while(dayDate.getMonth() + 1 == monthNo)
		{
			let day = this._addDay(dayDate);

			month.days.push(day);
			daysContainerEl.append(day.dayEl);

			dayDate.setDate(dayDate.getDate() + 1);
		}

		return month;
	}

	appendEl(element, date)
	{
		if (this.year == date.getFullYear() && this.months[date.getMonth()]?.days[date.getDate() - 1])
		{
			element.parentElement.removeChild(element);
			this.months[date.getMonth()]?.days[date.getDate() - 1].dayContentsEl.append(element);
		}
	}
}