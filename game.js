// import kaboom.js
import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";
//import {mainMap} from "./map.js";

let fov = 1
const dayTime = [141, 183, 255];
const nightTime = [33, 32, 31];
let timeOfDay = dayTime

// Start a kaboom game
kaboom({
	scale: fov,
    background: timeOfDay,
	font: "font",
	loadingScreen: false,
})


onLoading((progress) => {

	// Black background
	drawRect({
		width: width(),
		height: height(),
		color: rgb(0, 0, 0),
	})

	// A pie representing current load progress
	drawCircle({
		pos: center(),
		radius: 32,
		end: map(progress, 0, 1, 0, 360),
	})

	drawText({
		text: "loading" + ".".repeat(wave(1, 4, time() * 12)),
		font: "monospace",
		size: 24,
		anchor: "center",
		pos: center().add(0, 70),
	})

})

//for the debug options
debug.inspect = false
let uiSize = 50
let textSize = 10

scene ("game", () => {
// Timer
const game = add([
	timer(),
])

// Global variables
let score = 0
const jumpForce = 480
let speed = 240
const spriteSize = 4
let timeOfDay = dayTime

setGravity(995)


// Load assets
loadSprite("dino", "/src/dino.png", {
	sliceX: 9,
	anims: {
		"idle": {
			// Starts from frame 0, ends at frame 3
			from: 0,
			to: 3,
			// Frame per second
			speed: 5,
			loop: true,
		},
		"run": {
			from: 4,
			to: 7,
			speed: 10,
			loop: true,
		},
		// This animation only has 1 frame
		"jump": 8,
	},
})
loadSprite("lama", "/src/lama.png", {
	sliceX: 9,
	anims: {
		"idle": {
			from: 0,
			to: 3,
			speed: 3,
			loop: true,
		},
		"run": {
			from: 4,
			to: 7,
			speed: 10,
			loop: true,
		},
		"jump": 8,
	},
})
loadSprite("jumpCloude", "/src/jumpEffect.png", {
	sliceX: 3,
	anims: {
		"jump": {
			from: 0,
			to: 2,
			speed: 10,
			loop: false,
		},
	},
})
loadSound("swoosh", "/src/sounds/swoosh.mp3")
loadSound("swooshLight", "/src/sounds/swooshLight.mp3")
loadFont("font", "/src/fonts/04b03.ttf")


//Characters and Enteties
const player = game.add([
	sprite("dino"),
	pos(center()),
	anchor("center"),
	area(),
	body({ jumpForce: jumpForce }),
    doubleJump(),
	scale(spriteSize),
])
const lama = game.add([
	sprite("lama"),
	pos(50, height() - 24),
	anchor("bot"),
	area(),
	body(),
	scale(spriteSize),
])


//idle animations
player.play("idle")
lama.play("idle")


//animation player function
function animationPlay(obj, animName){
if (obj.curAnim() !==animName){
	obj.play(animName)
}
}

//dialog function
function messageSay(obj, textcontent, tag){
	if (obj.get(tag) >= 1){
		obj.add([
			text(textcontent, {size: textSize}),
			anchor("bot"),
			pos(0, 0),
			tag,
		])
	}
}


//makes the lama follow the player
lama.onUpdate(() => {
	const moveLama = player.pos.x - lama.pos.x

	//makes the lama move
	if (Math.abs(moveLama) > 100) {
		lama.move(moveLama, 0)
		animationPlay(lama, "run")
	} else {
		animationPlay(lama, "idle");
		messageSay(lama, "hello");
	}

	//turn lama around
	if (player.pos.x > lama.pos.x) {
		lama.flipX = false
	} else {
		lama.flipX = true
	}
})


//platform
const platform = game.add([
	rect(width(), 42),
	area(),
	outline(4),
	pos(0, height() - 24),
	body({ isStatic: true }),
	console.log("platfrom loaded"),
])


//jumping
const jumpEffect = player.add([
	sprite("jumpCloude"),
	pos(0, 18),
	anchor("bot"),
])
jumpEffect.hidden = true



//pause menu
const pauseMenu = add([
	rect(width() - 100, height() - 100),
	color(48, 48, 48),
	outline(4),
	anchor("center"),
	pos(center()),
])
pauseMenu.add([
	text("PAUSED", textSize),
	anchor("center"),
	pos(0, -120)
])
pauseMenu.setting = add([
	//rect(uiSize*2, ui),
	color(79, 78, 78),
	outline(4),
	anchor("center"),
	pos(-100, 0),
	text("Settings", textSize),
])

pauseMenu.hidden = true


if (player.exists()) {

const dir = player.pos.sub(lama.pos).unit()

add([
	pos(lama.pos),
	move(dir, 50),
	rect(12, 12),
	area(),
	offscreen({ destroy: true }),
	anchor("center"),
	color(BLUE),
	"bullet",
])

}


//animation switch
player.onGround(() => {
	if (!isKeyDown("left") && !isKeyDown("right")) {
		player.play("idle")
	} else {
		player.play("run")
	}
})

player.onUpdate(()=>{
	//camPos(player.pos)
})

//jumping
player.onDoubleJump(() => {
	player.play("jump")
	play("swooshLight")
	jumpEffect.play("jump")
	jumpEffect.hidden = false
})
jumpEffect.onAnimEnd(() => {
	jumpEffect.hidden = true
})

//controls
onKeyPress("escape", () => {
	pauseMenu.hidden = !pauseMenu.hidden
	game.paused = !game.paused
})
onKeyPress("f", () => {
	debug.inspect = !debug.inspect
})
onKeyPress("i", () => {
	go("settings")
})
onKeyPress("r", () => {
	go("game")
})
onKeyPress("t", () => {
	timeOfDay = nightTime
})
onKeyPress("l", () => {
	label.hidden = !label.hidden
})
onKeyPress("up", () => {
speed += 100
})
onKeyPress("down", () => {
	speed -= 100
	})
onKeyPress("space", () => {
    player.doubleJump()
	player.play("jump")
	play("swoosh")
})
onKeyDown("a", () => {
	player.move(-speed, 0)
	player.flipX = true
	// .play() will reset to the first frame of the anim, so we want to make sure it only runs when the current animation is not "run"
	if (player.isGrounded() && player.curAnim() !== "run") {
		player.play("run")
	}
})
onKeyDown("i", () => {
	label.hidden = false

})
onKeyDown("d", () => {
	player.move(speed, 0)
	player.flipX = false
	if (player.isGrounded() && player.curAnim() !== "run") {
		player.play("run")
	}
})
;["a", "d"].forEach((key) => {
	onKeyRelease(key, () => {
	// Only reset to "idle" if player is not holding any of these keys
		if (player.isGrounded() && !isKeyDown("left") && !isKeyDown("right")) {
			player.play("idle")
		}
	})
})


//info label
const getInfo = () => `
Anim: ${player.curAnim()}
Lama Anim: ${lama.curAnim()}
Frame: ${player.frame}
Lama Frame: ${lama.frame}
Score: ${score}
Time: ${timeOfDay}
Speed: ${speed}
Gravity: ${getGravity()}
Paused: ${game.paused}
Cords: X:${Math.floor(player.pos.x)} Y:${Math.floor(player.pos.y)}
Lama cords: X:${Math.floor(lama.pos.x)} Y:${Math.floor(lama.pos.y)}
DevMode; ${debug.inspect}
`.trim()
const label = add([
	color(48, 48, 48),
    text(getInfo(), { size: textSize*2}),
    pos(4),
])
label.onUpdate(() => {
	label.text = getInfo()
})

})

scene("settings", () => {

	kaboom({
		background: [48, 48, 48]
	})
	//control info
	const ctrlInfo = () => `
	Pause Menu: esc
	Walk Right: d
	Walk Left: a
	Jump: space
	Hide/show label: l
	dev mode: f
	`.trim()
	
	let controls = add([
		text(ctrlInfo(), ),
		anchor("center"),
	])
})
go("game")