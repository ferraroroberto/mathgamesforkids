/**
 * Lives-Reward Helper
 *
 * The two platformer-style games (mountain_dung_dodger, elemental_warrior)
 * reward the player with lives based on how a math session went, using an
 * identical rule:
 *
 *   3 correct → +1 life (capped at 5)
 *   2 correct → no change
 *   1 or 0 correct → -1 life (floored at 1)
 *
 * This was previously hand-rolled, byte-for-byte identical, inside each game's
 * `onFinish` callback. Extracting it here keeps each game's `onFinish` purely
 * about *what to do after* lives are computed (updateHUD, state transition).
 *
 * @param {{lives:number}} player        - the game's player object (mutated in place)
 * @param {{correctAnswers:number}} sessionSummary - the MathTests session summary
 * @returns {number} the player's new lives count (also written to player.lives)
 */
function livesRewardFromSession(player, sessionSummary) {
    if (sessionSummary.correctAnswers === 3) {
        player.lives = Math.min(player.lives + 1, 5); // Max 5 lives
    } else if (sessionSummary.correctAnswers === 2) {
        /* no-op: 2 correct holds lives steady */
    } else {
        // 1 or 0 correct → lose a life, floored at 1
        player.lives = Math.max(player.lives - 1, 1);
    }
    return player.lives;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = livesRewardFromSession;
} else if (typeof window !== 'undefined') {
    window.livesRewardFromSession = livesRewardFromSession;
}
