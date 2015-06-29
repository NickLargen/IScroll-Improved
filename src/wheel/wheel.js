
	_initWheel: function () {
		utils.addEvent(this.wrapper, 'wheel', this);
		utils.addEvent(this.wrapper, 'mousewheel', this);
		utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

		this.on('destroy', function () {
			utils.removeEvent(this.wrapper, 'wheel', this);
			utils.removeEvent(this.wrapper, 'mousewheel', this);
			utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
		});
	},

	_wheel: function (e) {
		if ( !this.enabled ) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		var wheelDeltaX, wheelDeltaY,
			newX, newY,
			that = this;

		if ( this.wheelTimeout === undefined ) {
			that._execEvent('scrollStart');
		}

		// Execute the scrollEnd event after 400ms the wheel stopped scrolling
		clearTimeout(this.wheelTimeout);
		this.wheelTimeout = setTimeout(function () {
			that._execEvent('scrollEnd');
			that.wheelTimeout = undefined;
		}, 400);

		var mouseWheelSpeed = this.options.mouseWheelSpeed;

	    //Standardized WheelEvent interface can now vary scrolls based on Windows mouse preferences
	    //It represents downward scrolls as positive numbers
	    //Note: IE always gives pixels, where each line is 5% of the document scrollHeight and each page is 100%
		if ('deltaX' in e) {
		    if (e.deltaMode === 0) { //Pixels
		        //Webkit always reports 100, IE gives number based on document height
		        //FUTURE: Determine desired scrolling behavior, magic number is here
		        //to maintain current chrome scroll speed and keep it consistent with older versions
		        wheelDeltaX = -e.deltaX * 0.03 * mouseWheelSpeed;
		        wheelDeltaY = -e.deltaY * 0.03 * mouseWheelSpeed;
		    } else if (e.deltaMode === 1) { //Lines
		        wheelDeltaX = -e.deltaX * mouseWheelSpeed;
		        wheelDeltaY = -e.deltaY * mouseWheelSpeed;
		    } else if (e.deltaMode === 2) { //Pages
		        //TODO: Does currentTarget need a null check?
		        wheelDeltaX = -e.deltaX * e.currentTarget.offsetWidth;
		        wheelDeltaY = -e.deltaY * e.currentTarget.offsetHeight;
		    }
		} else if ('wheelDeltaX' in e) {
		    //Old versions of Chrome supported horizontal scrolling
		    wheelDeltaX = e.wheelDeltaX / 40 * mouseWheelSpeed;
		    wheelDeltaY = e.wheelDeltaY / 40 * mouseWheelSpeed;
		} else if ('wheelDelta' in e) {
		    //Old non-FF browsers reported -120 for a single downard scroll
		    //The default Windows scroll is 3 lines, so a factor of 40 is recommended by MDN
		    wheelDeltaX = wheelDeltaY = e.wheelDelta / 40 * mouseWheelSpeed;
		} else if ('detail' in e) {
		    //Old versions of Firefox reported number of lines scrolled down
		    wheelDeltaX = wheelDeltaY = -e.detail * mouseWheelSpeed;
		} else {
		    return;
		}

		wheelDeltaX *= this.options.invertWheelDirection;
		wheelDeltaY *= this.options.invertWheelDirection;

		if ( !this.hasVerticalScroll ) {
			wheelDeltaX = wheelDeltaY;
			wheelDeltaY = 0;
		}

		if ( this.options.snap ) {
			newX = this.currentPage.pageX;
			newY = this.currentPage.pageY;

			if ( wheelDeltaX > 0 ) {
				newX--;
			} else if ( wheelDeltaX < 0 ) {
				newX++;
			}

			if ( wheelDeltaY > 0 ) {
				newY--;
			} else if ( wheelDeltaY < 0 ) {
				newY++;
			}

			this.goToPage(newX, newY);

			return;
		}

		newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
		newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

		if ( newX > 0 ) {
			newX = 0;
		} else if ( newX < this.maxScrollX ) {
			newX = this.maxScrollX;
		}

		if ( newY > 0 ) {
			newY = 0;
		} else if ( newY < this.maxScrollY ) {
			newY = this.maxScrollY;
		}

		this.scrollTo(newX, newY, 0);

// INSERT POINT: _wheel
	},
