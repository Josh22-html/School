const characters = [
  {
    lastName: ["B", "I", "N", "U", "E", "Z", "A"],
    name: "Joshwa Ulymel <br> M. Binueza",
    mainchar: "Media/Levi.webp",
    pfp: "Media/Binuezapfp.png",
    bg: "Media/BinuezaBG.svg",
  },
  {
    lastName: ["A", "L", "V", "A", "R", "E", "Z"],
    name: "Full Name Here <br> Second Line Here",
    mainchar: "Media/Luffy.png",
    pfp: "Media/Alvarezpfp.png",
    bg: "Media/AlvarezBG.svg",
  },

  {
    lastName: ["A", "N", "G", "E", "L", "E", "S"],
    name: "Full Name Here <br> Second Line Here",
    mainchar: "Media/Gengar.png",
    pfp: "Media/Angeles.png",
    bg: "Media/AngelesBG.svg",
  },
  {
    lastName: ["B", "O", "R", "N", "A", "S", "A", "L"],
    name: "Full Name Here <br> Second Line Here",
    mainchar: "Media/Walter-.png",
    pfp: "Media/Bornasalpfp.png",
    bg: "Media/Bornasal.svg",
  },
  {
    lastName: ["A", "L", "A", "N", "O"],
    name: "Full Name Here <br> Second Line Here",
    mainchar: "Media/MAINCHAR_5.webp",
    pfp: "Media/PFP_5.png",
    bg: "Media/BG_5.svg",
  },
];

let currentIndex = 0;
let isAnimating = false;

const mainchar = document.querySelector(".mainchar");
const pfp = document.querySelector(".pfp");
const lastn = document.querySelector(".Lastn");
const nameEl = document.querySelector(".name");
const mainbox = document.querySelector(".mainbox");
const container = document.querySelector(".container");
const arrowl = document.querySelector(".arrowl");
const arrowr = document.querySelector(".arrowr");

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fadeOut(el) {
  return new Promise((resolve) => {
    el.style.transition = "opacity 1s ease";
    el.style.opacity = "0";
    setTimeout(resolve, 1000);
  });
}

function fadeIn(el, targetOpacity = "1") {
  return new Promise((resolve) => {
    el.style.transition = "opacity 1s ease";
    el.style.opacity = targetOpacity;
    setTimeout(resolve, 1000);
  });
}

async function typeName(letters) {
  lastn.innerHTML = "";
  lastn.style.opacity = "0";
  lastn.style.transition = "none";

  for (let letter of letters) {
    const span = document.createElement("span");
    span.style.opacity = "0";
    span.style.transition = "opacity 0.3s ease";
    span.textContent = letter;
    lastn.appendChild(span);

    // force reflow so transition triggers
    span.getBoundingClientRect();
    span.style.opacity = "1";
    await wait(200);
  }

  lastn.style.opacity = "0.5";
}

async function switchCharacter(newIndex) {
  if (isAnimating) return;
  isAnimating = true;
  arrowl.style.pointerEvents = "none";
  arrowr.style.pointerEvents = "none";

  async function typeName(letters) {
    lastn.innerHTML = "";
    lastn.style.transition = "none";
    lastn.style.opacity = "0.5";

    for (let letter of letters) {
      const span = document.createElement("span");
      span.style.opacity = "0";
      span.style.transition = "none"; // no transition yet
      span.textContent = letter;
      lastn.appendChild(span);

      await wait(20); // let browser register opacity: 0 first
      span.style.transition = "opacity 0.3s ease";
      span.style.opacity = "1";
      await wait(200);
    }
  }
  // 1. Fade out all
  await Promise.all([
    fadeOut(mainchar),
    fadeOut(pfp),
    fadeOut(mainbox),
    fadeOut(lastn),
  ]);

  // 2. Swap bg with fade
  const char = characters[newIndex];
  container.style.transition = "background-image 1s ease";
  container.style.backgroundImage = `url('${char.bg}')`;
  await wait(1000);

  // 3. Swap other data
  mainchar.src = char.mainchar;
  pfp.src = char.pfp;
  nameEl.innerHTML = char.name;

  // 4. Type last name
  await typeName(char.lastName);
  await wait(300);

  // 5. Fade in mainbox
  await fadeIn(mainbox);

  // 6. Fade in pfp
  await fadeIn(pfp);

  // 7. Fade in mainchar
  await fadeIn(mainchar);

  currentIndex = newIndex;
  isAnimating = false;
  arrowl.style.pointerEvents = "auto";
  arrowr.style.pointerEvents = "auto";
}

arrowr.addEventListener("click", () => {
  const next = (currentIndex + 1) % characters.length;
  switchCharacter(next);
});

arrowl.addEventListener("click", () => {
  const prev = (currentIndex - 1 + characters.length) % characters.length;
  switchCharacter(prev);
});
