function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function healthPercent(health) {
    return health + '%';
}

const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            winner: null,
            logMessages: [],
        }
    },
    computed: {
        monsterBarStyles() {
            if (this.monsterHealth <= 0) {
                return { width: healthPercent(0) }
            }
            return { width: healthPercent(this.monsterHealth) }
        },
        playerBarStyles() {
            if (this.playerHealth <= 0) {
                return { width: healthPercent(0) }
            }
            return { width: healthPercent(this.playerHealth) }
        },
        mayUseSpecialAttack() {
            return this.currentRound % 3 !== 0
        },

    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                this.winner = 'monster';
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                this.winner = 'player';
            }
        }
    },
    methods: {
        attackMonster() {
            this.currentRound++;
            const attackValue = getRandomValue(5, 12);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer();
        },
        attackPlayer() {
            const attackValue = getRandomValue(8, 15);
            this.playerHealth -= attackValue;
            this.addLogMessage('monster', 'attack', attackValue);
        },
        specialAttackMonster() {
            this.currentRound++;
            const attackValue = getRandomValue(10, 25);
            this.monsterHealth -= attackValue;
            this.attackPlayer();
            this.addLogMessage('player', 'special attack', attackValue);
        },
        healPlayer() {
            this.currentRound++;
            const healthValue = getRandomValue(8, 20);
            if (this.playerHealth + healthValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healthValue;
            }
            this.addLogMessage('player', 'heal', healthValue);
            this.attackPlayer();
        },
        surrender() {
            this.winner = 'monster';
        },
        startGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.currentRound = 0;
            this.winner = null;
            this.logMessages = [];
        },
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            });
        }
    }
});

app.mount('#game');