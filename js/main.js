let calendarYear = (new Date()).getFullYear();
document.querySelector(".yearInput").value = calendarYear;

function assumeDate(fileName, modTime)
{
	let dateFromName = fileName.match(/^(\d{4}|\d{2})[\.\-_](\d{1,2})[\.\-_](\d{1,2})[\s\-_]/);

	if (dateFromName)
	{
		if (dateFromName[1].length == 2)
			dateFromName[1] = Math.floor(calendarYear / 100) + dateFromName[1];
		
		return new Date(parseInt(dateFromName[1]), parseInt(dateFromName[2]) - 1, parseInt(dateFromName[3]));
	}

	else return new Date(parseInt(modTime));
}


let calendar = new Calendar(calendarYear);
document.querySelector(".calendarContainer").append(calendar.calendarEl);

function setYear(newYear)
{
	calendarYear = newYear;

	for (let image of calendar.calendarEl.querySelectorAll("canvas"))
	{
		image.parentElement.removeChild(image);
		dropDiv.el.append(image);
	}

	calendar = new Calendar(calendarYear);
	document.querySelector(".calendarContainer").innerHTML = "";
	document.querySelector(".calendarContainer").append(calendar.calendarEl);
}


// Unassiged images bin
let dropDiv = new DropElement();
dropDiv.el.classList.add("imageBin");

let assignBtnEl = document.createElement("button");
assignBtnEl.append("Assign to days");

assignBtnEl.addEventListener("click", () =>
{
	let elementsToAppend = [];
	for (let el of dropDiv.el.childNodes)
	{
		let date = assumeDate(el.dataset.fileName, el.dataset.modTime);

		elementsToAppend.push({ el, date });
	}

	for (let toAppend of elementsToAppend)
	{
		calendar.appendEl(toAppend.el, toAppend.date);
	}
});

document.querySelector(".fileBinContainer").append(dropDiv.el, assignBtnEl);


// Convering to downloadable image
function calendarToImg()
{
	var node = document.querySelector('.calendar');

	domtoimage.toPng(node)
	.then(dataUrl =>
	{
		// var img = new Image();
		// img.src = dataUrl;
		// document.body.appendChild(img);

		let a = document.createElement("a");
		a.href = dataUrl;
		// a.target = "_blank";
		a.download = `Calendar ${ calendarYear }.png`;
		a.click();
	})
	.catch(function (error)
	{
		console.error('oops, something went wrong!', error);
	});
}