var Explosion = function () {

    var self = this;
	var canvas;
	var context2D;
	
	var particles = [];
	
    var frameRate = 60.0;
    var frameDelay = 1000.0/frameRate;

    var interfaces = {
        init: init,
        explode: explode,
    };


	function init(settings)
	{
		self.config = settings;
		// canvas and 2D context initialization
        $( document ).ready(function() {
            canvas = document.getElementById(settings.canvasId);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            context2D = canvas.getContext("2d");
		    context2D.fillStyle = "rgba(0, 0, 0, 0.9)";
            
        })
        return interfaces; 
    }

    
    function explode() {
		$('#' + config.canvasId).show();
		$('#' + config.canvasId).css('z-index', 1000);
        var updateInterval = setInterval(function()
		{
			update(frameDelay);
			
		}, frameDelay);

        var explodeCounter = 0;
        var refreshIntervalId = setInterval(function() {
            if(++explodeCounter >= 50) {
                clearInterval(refreshIntervalId);
                setTimeout(function(){ clearInterval(updateInterval)}, 1000);
				$('#' + config.canvasId).css('z-index', 0);
				$('#' + config.canvasId).hide();
            }
            var x = randomFloat(100, canvas.width-100);
            var y = randomFloat(100, canvas.height-100);
            
            createExplosion(x, y, "#525252");
            createExplosion(x, y, "#FFA318");            
            createExplosion(x, y, "red");
        }, 50);      
    }

	function randomFloat (min, max)
	{
		return min + Math.random()*(max-min);
	}
	
	/*
	 * A single explosion particle
	 */
	function Particle ()
	{
		this.scale = 1.0;
		this.x = 0;
		this.y = 0;
		this.radius = 20;
		this.color = "#000";
		this.velocityX = 0;
		this.velocityY = 0;
		this.scaleSpeed = 0.5;
		
		this.update = function(ms)
		{
			// shrinking
			this.scale -= this.scaleSpeed * ms / 1000.0;
			
			if (this.scale <= 0)
			{
				this.scale = 0;
			}
			
			// moving away from explosion center
			this.x += this.velocityX * ms/1000.0;
			this.y += this.velocityY * ms/1000.0;
		};
		
		this.draw = function(context2D)
		{
			// translating the 2D context to the particle coordinates
			context2D.save();
			context2D.translate(this.x, this.y);
			context2D.scale(this.scale, this.scale);
			
			// drawing a filled circle in the particle's local space
			context2D.beginPath();
			context2D.arc(0, 0, this.radius, 0, Math.PI*2, true);
			context2D.closePath();
			
			context2D.fillStyle = this.color;
			context2D.fill();
			
			context2D.restore();
		};
	}
	
	/*
	 * Basic Explosion, all particles move and shrink at the same speed.
	 * 
	 * Parameter : explosion center
	 */
	function createBasicExplosion(x, y)
	{
		// creating 4 particles that scatter at 0, 90, 180 and 270 degrees
		for (var angle=0; angle<360; angle+=90)
		{
			var particle = new Particle();
			
			// particle will start at explosion center
			particle.x = x;
			particle.y = y;
			
			particle.color = "#FF0000";
			
			var speed = 50.0;
			
			// velocity is rotated by "angle"
			particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
			particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);
			
			// adding the newly created particle to the "particles" array
			particles.push(particle);
		}
	}
	
	/*
	 * Advanced Explosion effect
	 * Each particle has a different size, move speed and scale speed.
	 * 
	 * Parameters:
	 * 	x, y - explosion center
	 * 	color - particles' color
	 */
	function createExplosion(x, y, color)
	{
		var minSize = 15;
		var maxSize = 35;
		var count = 10;
		var minSpeed = 60.0;
		var maxSpeed = 200.0;
		var minScaleSpeed = 1.0;
		var maxScaleSpeed = 4.0;
		
		
		for (var angle=0; angle<360; angle += Math.round(360/count))
		{
			var particle = new Particle();
			
			particle.x = x;
			particle.y = y;
			
			particle.radius = randomFloat(minSize, maxSize);
			
			particle.color = color;
			
			particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);
			
			var speed = randomFloat(minSpeed, maxSpeed);
			
			particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
			particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);
			
			particles.push(particle);
		}
	}
	
	function update (frameDelay)
	{
		// draw a white background to clear canvas
		context2D.clearRect(0, 0, context2D.canvas.width, context2D.canvas.height);
		
		// update and draw particles
		for (var i=0; i<particles.length; i++)
		{
			var particle = particles[i];
			
			particle.update(frameDelay);
			particle.draw(context2D);
		}
	}
	

    return interfaces;

} ();
