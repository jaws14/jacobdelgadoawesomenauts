game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this.setSuper();
        this.setPlayerTimers();
        this.setAttributes();
           this.type = "PlayerEntity";
           this.setFlags();
           
           this.addAnimation();
           
           
        this.renderable.setCurrentAnimation("idle");
        
         },
         
         setSuper: function(x, y){
             this._super(me.Entity, 'init', [x, y, {
                image: "player",
                //the height and the width tells the screen what size to preserve//
                width: 64,
                height: 64,
                //this tells us what the size of the image it is using//
                spritewidth: "64",
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);
         },
         
            setPlayerTimers: function(){
                this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastAttack = new Date().getTime();
            },
         
         setAttributes: function(){
             this.health = game.data.playerHealth;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
         this.attack = game.data.playerAttack;
         },
         
         setFlgas: function(){
            //keeps track of where character is going//
        this.facing = "right";
        this.dead = false;
        this.attacking = false;
         },
         
         addAnimation: function(){
           //this tells the game what specific image you want and the eighty just means the speed itss going in//
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
  
         },
         
    update: function(delta) {
        this.now = new Date().getTime();
        
        this.dead = this.checkIfDead();
        
       this.checkKeyPressesAndMove();
        
    

        if (this.attacking) {

           this.setAnimation();
           
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    checkIfDead: function(){
       if (this.health <= 0){
            return true;
             }  
             return false;
    },
    
    checkKeyPressesAndMove: function(){
            if (me.input.isKeyPressed("right")) {
         this.moveRight();
        } else if (me.input.isKeyPressed("left")) {
          this.moveLeft();
        } else {
            this.body.vel.x = 0;
        }

        if (me.input.isKeyPressed("jump") && !this.jumping && !this.falling) {
         this.jump();
        }
        
        this.attacking = me.input.isKeyPressed("attack");
    },
    
    moveRight: function(){
         //adds to the position of my x by the velocity defined above
            //setvelocity() and multiplying it by me.timer.tick.
            //me.timer.tick makes the movement look smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);
    },
    
    moveLeft: function(){
         this.facing = "left";
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.flipX(false); 
    },
    
    jump: function(){
         this.jumping = true;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;  
    },
    
    setAnimation: function(){
       if (!this.renderable.isCurrentAnimation("attack")) {
                console.log(!this.renderable.isCurrentAnimation("attack"));
                //this makes the animation attack the other players base//
                this.renderable.setCurrentAnimation("attack", "idle");
                this.renderable.setAnimationFrame();
            }
        }
        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk")
            }
        } else if (!this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }
  
    },
    
    loseHealth: function(damage){
        this.health = this.health - damage;
        console.log(this.health);
    },
    
    
    collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity') {
           this.CollideWidthEnemyBase(response);
            if (this.renderable.setCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
                console.log("towerHit")
                this.lastHit = this.now;
                response.b.loseHealth(game.data.playerAttack);
            }
        }else if(response.b.type==='EnemyCreep'){
            this.collideWithEnemyCreep(response);
        }
    },
    
    collideWithEnemyBase: function(response){
         var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;


            if (ydif < -40 && xdif < 70 && xdif > -35) {
                this.body.falling = false;
                this.body.vel.y = -1;
            }
           this.stopMovement(xdif)){
               
           };
    }
    
    collideWithEnemyCreep: function(){
         var xdif = this.pos.x - response.b.pos.x;
         var ydif = this.pos.y - response.b.y;
         
         this.stopMovement(xdif);
         
         this.checkAttack(xdif, ydif); 
            this.hitCreep(response);
            if (xdif>0){
                this.pos.x = this.pos.x + 1;
                if(this.facing==="left"){
                    this.body.vel.x = 0;
                }
            }else{
                this.pos.x = this.pos.x - 1;
            }
            
            
    },
    
    stop.Movement: function(xdif){
         else if (xdif > -35 && this.facing === 'right' && (xdif < 0)) {
                this.body.vel.x = 0;
                this.pos.x = this.pos.x = 0;
            } else if (xdif < 70 && this.facing === 'left' && xdif > 0) {
                this.bod.vel.x = 0;
                this.pos.x = this.pos.x = 0;
            }

    },
    
    checkAttack: function(xdif, ydif){
        if(this.renderable.isCurrentAnimation("attack") &&this.now - this.lastHit >= game.data.playerAttackTimer
              &&  (math.abs(ydif)) <=40 && 
                  (((xdif>0) && this.facing===("left") || (xdif<0) && this.facing==="right"))
                  ){
                this.lastHit = this.now;
               return true;
            }
            return false;
    },
    
    hitCreep: function(response){
         if(response.b.health <= game.data.playerAttack){
                    game.data.gold += 1;
                    console.log("Current gold:" + game.data.gold);
                }
                reponse.b.loseHealth(game.data.playerAttack);
                
    }
);



