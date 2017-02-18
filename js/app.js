function Arrow () {
  this.x = 0;
  this.y = 0;
  this.color = "#ffff00";
  this.rotation = 0;
}

Arrow.prototype.draw = function (context) {
  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.rotation);
  context.scale(0.5, 0.5);
  
  context.lineWidth = 2;
  context.fillStyle = this.color;
  context.beginPath();
  context.moveTo(-50/2, -25/2);
  context.lineTo(0, -25/2);
  context.lineTo(0, -50/2);
  context.lineTo(50/2, 0);
  context.lineTo(0, 50/2);
  context.lineTo(0, 25/2);
  context.lineTo(-50/2, 25/2);
  context.lineTo(-50/2, -25/2);
  context.closePath();
  context.fill();
  context.stroke();
  
  context.restore();
};

function Map(image) {
    this.image = image;
}

Map.prototype.draw = function (context) {
    var canvas = context.canvas;
    context.drawImage(this.image, canvas.width / 2 - this.image.width / 2, canvas.height / 2 - this.image.height / 2, this.image.width, this.image.height);
}

function Path(queue, color) {
    this.queue = queue;
    this.color = color;
}

Path.prototype.draw = function (context, mouse) {
    var len = this.queue.getLength();
    context.save();
    context.strokeStyle = context.fillStyle = this.color;
    for (var i = 0; i < this.queue.getLength() ; i++) {
        var pnt1 = this.queue.getAt(i);
        context.beginPath();
        context.arc(pnt1.x, pnt1.y, 2.5, 0, 2 * Math.PI, true);
        //context.arc(pnt2.x,pnt2.y, 2.5 , 0 , 2 * Math.PI, true);
        context.fill();
        context.closePath();

        if (i < this.queue.getLength() - 1) {
            var pnt2 = this.queue.getAt(i + 1);
            context.beginPath();
            context.moveTo(pnt1.x, pnt1.y);
            context.lineTo(pnt2.x, pnt2.y);
            context.stroke();
            context.closePath();
        }
    }
    if (len > 0)
        this.drawLine(context, this.queue.getAt(len - 1), mouse);


    context.restore();
}

Path.prototype.drawLine = function (context, from, to) {
    context.save();
    context.strokeStyle = context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    context.closePath();
    context.restore();
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

var APP = (function () {
		var pathAlwaysVisible = false,
				isMoving = false,
				distance = 0;

		return {
				togglePathVisibility: function () {
						pathAlwaysVisible = !pathAlwaysVisible;
				},
				run: function () {
						var img = new Image();
						img.onload = function () {
								var canvas = document.getElementById('canvas'),
									context = canvas.getContext('2d'),
									mouse = utils.captureMouse(canvas),
									arrow = new Arrow(),
									speed = 3,
									queue = new Queue(),
									path = new Path(queue, "black"),
									map = new Map(img),
									i = 0,
									flag = true,
									speed = 1; //px per second

								canvas.addEventListener("mousedown", function (e) {
										var len = queue.getLength();

										if (len > 5 && i > 0 && !pathAlwaysVisible) {
												queue.dequeue();
												i--;
										}
										queue.enqueue(new Point(mouse.x, mouse.y));
								}, false);

								window.addEventListener('keydown', function (e) {
										if (e.keyCode == keycode.ENTER) {
												isMoving = !isMoving;
										}
										if (e.keyCode == keycode.DELETE) {
												distance = 0;
										}
										e.preventDefault();
								}, false);

								function drawDistance(context) {
										context.save()
										context.fillStyle = 'white';
										context.font = 'Calibri 16px';
										context.textBaseline = 'bottom';
										context.fillText("Distance: " + Math.round(distance) + " km", 40, 450);
										context.restore();
								}

								(function drawFrame() {
										var len = queue.getLength();
										
										window.requestAnimationFrame(drawFrame, canvas);
										context.clearRect(0, 0, canvas.width, canvas.height);

										map.draw(context);
										path.draw(context, new Point(mouse.x, mouse.y));
										
										//if we have at least one point			
										if (len > 1 && (i + 1) < len) {
												var start = queue.getAt(i),
														end = queue.getAt(i + 1),
														dx = end.x - start.x,
														dy = end.y - start.y,
														angle = Math.atan2(dy, dx);

												if (flag) {
														arrow.x = start.x;
														arrow.y = start.y;
														flag = false;
												}
												arrow.rotation = angle;

												if (isMoving) {
														arrow.x += Math.cos(angle) * speed;
														arrow.y += Math.sin(angle) * speed;
														distance += 1316 / 849;
														if (Math.abs(arrow.x - end.x) < 0.5 && Math.abs(arrow.y - end.y) < 0.5) {
																arrow.x = end.x;
																arrow.y = end.y;
																i++;
																if (i > 0 && !pathAlwaysVisible) {
																		queue.dequeue();
																		i--;
																}
														}
												}
										}
										if (len == 1) {
												var pnt = queue.getAt(i),
														dx = mouse.x - pnt.x,
														dy = mouse.y - pnt.y,
														angle = Math.atan2(dy, dx);
												arrow.rotation = angle;
												arrow.x = queue.getAt(i).x;
												arrow.y = queue.getAt(i).y;
										}
										if (len != 0) {
												arrow.draw(context);
										}

										drawDistance(context);
								}());
						};
						img.src = "/img/ukraineMap_ua.png";
				}
		}
})();

APP.run();