const toBase64 = file => new Promise((resolve, reject) =>
{
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = () => resolve(reader.result);
	reader.onerror = error => reject(error);
});

let filesCount = 0;

async function fileToImg(file, maxSize = 336)
{
	if (![ "image/png", "image/jpeg" ].includes(file.type))
		return;
	
	// Create image

	let imgEl = document.createElement("img");
	imgEl.alt = file.name;

	let canvasEl = document.createElement("canvas");

	canvasEl.id = `file-${ ++filesCount }`;

	canvasEl.title = `${ file.name }\n\nLast modified:\n  ${ (new Date(file.lastModified)).toLocaleString() }`;

	canvasEl.dataset.fileName = file.name;
	canvasEl.dataset.modTime  = file.lastModified;

	canvasEl.draggable = true;
	canvasEl.addEventListener("dragstart", e =>
	{
		e.dataTransfer.setData("text", e.target.id);
	});

	imgEl.src = await toBase64(file);

	return new Promise((ret, err) =>
	{
		imgEl.onload = e =>
		{
			canvasEl.width  = imgEl.width > imgEl.height ? maxSize : Math.round(imgEl.width  * maxSize / imgEl.height);
			canvasEl.height = imgEl.width < imgEl.height ? maxSize : Math.round(imgEl.height * maxSize / imgEl.width );
			let ctx = canvasEl.getContext("2d");
			ctx.drawImage(imgEl, 0, 0, canvasEl.width, canvasEl.height);
			ret(canvasEl);
		};
	});
}

class DropElement
{
	constructor(dropContainer, type = "div")
	{
		this.el = document.createElement(type);
		this._dropListeners = [];

		if (dropContainer)
			this._dropContainer = dropContainer;
		else
			this._dropContainer = this.el;


		this.el.addEventListener("drop",      e => this._evDrop(e) );
		this.el.addEventListener("dragover",  e => this._evDragOver(e) );
		this.el.addEventListener("dragleave", e => this._evDragLeave(e) );

		// Create an observer instance linked to the callback function
		this._mObserver = new MutationObserver(() => this._observeChilds());
		this._mObserver.observe(this._dropContainer, { childList: true });
		this._observeChilds();
	}

	addDropListener(fn)
	{
		this._dropListeners.push(fn);
	}

	// Observe changes
	_observeChilds()
	{
		this.el.classList.remove(`itemsCount-${ this.el.dataset.itemsCount }`);
		this.el.dataset.itemsCount = this._dropContainer.childNodes.length;
		this.el.classList.add(`itemsCount-${ this.el.dataset.itemsCount }`);
	}

	// Drag & drop events
	async _evDrop(e)
	{
		this.el.classList.remove("dragOver");
		e.preventDefault();

		// if files
		for (let file of e.dataTransfer.files)
		{
			let imgEl = await fileToImg(file);
			if (imgEl)
			{
				this._dropContainer.append(imgEl);
			
				for (let dropFn of this._dropListeners)
				{
					dropFn(imgEl);
				}
			}
		}

		// if img element
		let elementId = e.dataTransfer.getData("text");
		if (elementId)
		{
			let imgEl = document.getElementById(elementId);
			imgEl.parentElement.removeChild(imgEl);
			this._dropContainer.append(imgEl);
			
			for (let dropFn of this._dropListeners)
			{
				dropFn(imgEl);
			}
		}

	}

	_evDragOver(e)
	{
		this.el.classList.add("dragOver");
		e.preventDefault();
	}

	_evDragLeave(e)
	{
		this.el.classList.remove("dragOver");
	}
}