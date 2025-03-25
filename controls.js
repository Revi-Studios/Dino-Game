export function gameControls(player){
    //controls
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
}

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

    onKeyDown("i", () => {
        label.hidden = false
    })