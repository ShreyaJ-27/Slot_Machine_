const symbols = ["🍒", "🌸", "🍓", "🍉", "🍋", "🔔", "⭐"];
let balance = 100;

const balanceDiv = document.getElementById("balance");
const slotRowDiv = document.getElementById("slot-row");
const betForm = document.getElementById("bet-form");
const betInput = document.getElementById("bet");
const resultDiv = document.getElementById("result");
const playAgainBtn = document.getElementById("play-again");
const gameOverDiv = document.getElementById("game-over");
const spinButton = document.getElementById("spin-button");

function spinRowAnimation(finalRow) {
    const reels = slotRowDiv.querySelectorAll('.reel');
    for (let i = 0; i < reels.length; i++) {
        reels[i].classList.add('spin-anim');
        reels[i].textContent = symbols[Math.floor(Math.random() * symbols.length)];
    }
    setTimeout(() => {
        for (let i = 0; i < reels.length; i++) {
            reels[i].textContent = finalRow[i];
            reels[i].classList.remove('spin-anim');
        }
    }, 600);
}

function spinRow() {
    return [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];
}

function getPayout(row, bet) {
    if (row[0] === row[1] && row[1] === row[2]) {
        switch (row[0]) {
            case "🍒": return bet * 3;
            case "🌸": return bet * 4;
            case "🍓": return bet * 5;
            case "🍉": return bet * 6;
            case "🍋": return bet * 7;
            case "🔔": return bet * 10;
            case "⭐": return bet * 20;
            default: return 0;
        }
    } else if (row[0] === row[1] || row[1] === row[2]) {
        let matched = row[1];
        switch (matched) {
            case "🍒": return bet * 2;
            case "🌸": return bet * 3;
            case "🍓": return bet * 4;
            case "🍉": return bet * 5;
            case "🍋": return bet * 6;
            case "🔔": return bet * 7;
            case "⭐": return bet * 10;
            default: return 0;
        }
    }
    return 0;
}

function updateBalance() {
    balanceDiv.textContent = `Current balance: $${balance}`;
}

function handleGameEnd() {
    gameOverDiv.style.display = "block";
    betForm.style.display = "none";
    playAgainBtn.style.display = "none";
}

betForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const bet = parseInt(betInput.value, 10);

    if (bet > balance) {
        resultDiv.textContent = "INSUFFICIENT FUNDS!";
        return;
    }
    if (bet <= 0) {
        resultDiv.textContent = "Bet must be greater than 0";
        return;
    }

    balance -= bet;
    updateBalance();
    resultDiv.textContent = "Spinning...";
    spinButton.disabled = true;

    // Animate reels
    const finalRow = spinRow();
    spinRowAnimation(finalRow);

    setTimeout(() => {
        const payout = getPayout(finalRow, bet);

        if (payout > 0) {
            resultDiv.textContent = `🎉 You won $${payout}!`;
            balance += payout;
            updateBalance();
        } else {
            resultDiv.textContent = "Sorry, you lost this round!";
        }

        spinButton.disabled = false;

        if (balance <= 0) {
            handleGameEnd();
        } else {
            playAgainBtn.style.display = "inline-block";
            betForm.style.display = "none";
        }
    }, 700);
});

playAgainBtn.addEventListener("click", () => {
    resultDiv.textContent = "";
    playAgainBtn.style.display = "none";
    betForm.style.display = "block";
    betInput.value = "10";
    // Reset slot row to starting symbols
    const reels = slotRowDiv.querySelectorAll('.reel');
    for (let i = 0; i < reels.length; i++) {
        reels[i].textContent = symbols[0];
    }
});

updateBalance();
