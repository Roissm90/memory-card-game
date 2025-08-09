$(document).ready(function () {
  let selectedCards = [];
  let matchedCards = [];
  let failures = 0;
  let currentSize = 6;

  const flipDuration = 600;

  // Referencias a los sonidos
  const failSound = document.getElementById("failSound");
  const matchSound = document.getElementById("matchSound");

  function generateBoard(size) {
    currentSize = size;
    const $board = $("#boardGame");
    $board.empty().removeClass().addClass(`board-game size-${size}`);
    $("#failures").text("Fails: 0");
    failures = 0;
    selectedCards = [];
    matchedCards = [];

    createRestartButton();

    let cardValues = [];
    for (let i = 1; i <= size / 2; i++) {
      cardValues.push(i, i);
    }

    cardValues = cardValues.sort(() => 0.5 - Math.random());

    cardValues.forEach((val) => {
      const $card = $(`
      <div class="card" data-value="${val}">
        <div class="card-inner">
          <div class="card-front">?</div>
          <div class="card-back">${val}</div>
        </div>
      </div>
    `);
      $board.append($card);
    });

    // --- Mostrar todas las cartas por 1 segundo ---
    const $allCards = $board.find(".card");
    setTimeout(() => {
      $allCards.addClass("flipped");

      setTimeout(() => {
        $allCards.removeClass("flipped");
      }, 1000); // Tiempo que se muestran descubiertas (1 segundo)
    }, 100); // Pequeño retardo para que la animación de flip funcione
  }

  async function flipBackSelectedCards() {
    for (let i = 0; i < selectedCards.length; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          selectedCards[i].removeClass("flipped");
          resolve();
        }, flipDuration / 1.5); // Retardo entre cartas para animar una a una
      });
    }
    selectedCards = [];
  }

  function createRestartButton() {
    $("#restartButton").remove();

    const $btn = $(`
      <button id="restartButton" class="restart-button">Restart</button>
    `);

    $btn.insertAfter("#failures");

    $btn.on("click", function () {
      generateBoard(currentSize);
    });
  }

  $("#difficulty").on("change", function () {
    const size = parseInt($(this).val());
    if (!isNaN(size)) {
      generateBoard(size);
    }
  });

  function playTwice(sound) {
    sound.currentTime = 0;
    sound.play();
    setTimeout(() => {
      sound.currentTime = 0;
      sound.play();
    }, sound.duration * 1000 + 100);
  }

  $("#boardGame").on("click", ".card", async function () {
    const $card = $(this);

    if (
      $card.hasClass("flipped") ||
      $card.hasClass("matched") ||
      selectedCards.length >= 2
    ) {
      return;
    }

    $card.addClass("flipped");
    selectedCards.push($card);

    if (selectedCards.length === 2) {
      const val1 = selectedCards[0].data("value");
      const val2 = selectedCards[1].data("value");

      if (val1 === val2) {
        // Match
        selectedCards.forEach(($c) => $c.addClass("matched"));
        matchedCards.push(val1);

        // Sonido de acierto
        playTwice(matchSound);

        selectedCards = [];
      } else {
        // Fail
        failures++;
        $("#failures").text(`Fails: ${failures}`);

        // Sonido de fallo
        failSound.currentTime = 0;
        failSound.play();

        $("#boardGame").addClass("disabled");

        await flipBackSelectedCards();

        $("#boardGame").removeClass("disabled");
      }
    }
  });

  const initialSize = parseInt($("#difficulty").val()) || 8;
  generateBoard(initialSize);
});
