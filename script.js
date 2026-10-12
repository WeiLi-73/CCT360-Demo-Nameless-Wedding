/* =========================
   游戏状态
========================= */

const savedState = JSON.parse(
  localStorage.getItem("namelessWeddingSave")
);

const gameState = savedState || {
  currentScene: "hall",

  clues: [],

  unlockedScenes: ["hall"],

  soundEnabled: true
};

if (!gameState.inventory) {
  gameState.inventory = [];
}

if (!gameState.solvedDolls) {
  gameState.solvedDolls = [];
}
if (!gameState.usedItems) {
  gameState.usedItems = [];
}
if (!gameState.bedroomProgress) {
  gameState.bedroomProgress = {
    scissorsCollected: false,
    diaryCollected: false,
    dressCut: false,
    keyCollected: false
  };
}
if (!gameState.collectedRewards) {
  gameState.collectedRewards = [];
}
let selectedItemId = null;


/* =========================
   场景一透明道具数据
========================= */

const hallProps = [
  {
    id: "radio",
    name: "旧收音机",
    image: "images/hall/radio.png",

    left: "2%",
    top: "36%",
    width: "25%",

    clueTitle: "失灵的收音机",

    description:
      "收音机没有接通电源，却不断传出断断续续的杂音。\n\n" +
      "一个模糊的声音重复说道：\n" +
      "“把婚礼完成……她就能离开……”"
  },
  

  {
    id: "photo",
    name: "残缺喜照",
    image: "images/hall/photo-front.png",

    left: "66%",
    top: "20%",
    width: "9%",

    clueTitle: "残缺喜照",

    description:
      "一张严重破损的旧式结婚照片。\n\n" +
      "新娘的面部被黑色划痕覆盖，新郎脸上贴着一张符纸。照片的一角已经缺失。"
  },

  {
    id: "invitation",
    name: "无名喜帖",
    image: "images/hall/invitation-front.png",

    left: "41%",
    top: "55%",
    width: "9%",

    clueTitle: "无名喜帖",

    description:
      "喜帖已经褪色，上面没有写新娘的姓名。\n\n" +
      "封面上的红线似乎被人重新缠绕过。"
  }
];
/* =========================
   场景二纸人数据
========================= */

const paperDolls = [
  {
    id: "paper-doll-1",
    name: "纸人一",
    image: "images/wedding/paper-doll-1.png",

  left: "28.5%",
    top: "39%",
    width: "9%",

    correctItem: "lantern",

    description:
      "纸人的双手空空，袖口画着一圈模糊的火焰纹样。"
  },

  {
    id: "paper-doll-2",
    name: "纸人二",
    image: "images/wedding/paper-doll-2.png",

     left: "39%",
    top: "39%",
    width: "9%",

    correctItem: "cup",

    description:
      "纸人胸前留着暗色水渍，像是曾经被酒水浸湿过。"
  },

  {
    id: "paper-doll-3",
    name: "纸人三",
    image: "images/wedding/paper-doll-3.png",

  left: "50%",
    top: "39%",
    width: "9%",

    correctItem: "comb",

    description:
      "纸人的衣领旁画着几缕细长黑线，看起来像散落的头发。"
  },

  {
    id: "paper-doll-4",
    name: "纸人四",
    image: "images/wedding/paper-doll-4.png",

     left: "60%",
    top: "39%",
    width: "9%",

    correctItem: "small-mirror",

    description:
      "纸人胸口画着一个残缺的圆形，表面泛着暗淡的银光。"
  }
];

/* =========================
   场景二供品数据
========================= */

const offeringItems = [
  {
    id: "lantern",
    name: "旧纸灯笼",
    image: "images/wedding/lantern.png",

    left: "23%",
    top: "57%",
    width: "6%",

    description:
      "一盏褪色的纸灯笼，内部仍然残留着微弱的光。"
  },

  {
    id: "cup",
    name: "旧酒杯",
    image: "images/wedding/cup.png",

    left: "39%",
    top: "59%",
    width: "4%",

    description:
      "一只旧酒杯，杯底残留着已经干涸的暗红色液体。"
  },

  {
    id: "comb",
    name: "断齿木梳",
    image: "images/wedding/comb.png",

    left: "54%",
    top: "60%",
    width: "6%",

    description:
      "木梳缺了几根梳齿，缝隙中缠着几根黑色长发。"
  },

  {
    id: "small-mirror",
    name: "浑浊小铜镜",
    image: "images/wedding/small-mirror.png",

    left: "70%",
    top: "56%",
    width: "5%",

    description:
      "镜面已经变得浑浊，里面隐约映出一个模糊的人影。"
  }
];

const candleItem = {
  id: "candle",
  name: "熄灭的喜烛",
  image: "images/wedding/candle.png",

  description:
    "一根从暗格中找到的旧喜烛。烛芯已经熄灭，却仍然带着一点余温。"
};


const allInventoryItems = [
  ...offeringItems,
  candleItem
];
/* =========================
   页面元素
========================= */

const startScreen = document.querySelector("#start-screen");
const startButton = document.querySelector("#start-button");
const game = document.querySelector("#game");

const propLayer = document.querySelector("#prop-layer");
const inventoryList =
  document.querySelector("#inventory-list");
const sceneBackground =
  document.querySelector("#scene-background");
  const sceneTitle = document.querySelector("#scene-title");
const messageText = document.querySelector("#message-text");

const mapButton = document.querySelector("#map-button");
const clueButton = document.querySelector("#clue-button");
const soundButton = document.querySelector("#sound-button");
const resetButton = document.querySelector("#reset-button");

const mapPanel = document.querySelector("#map-panel");
const cluePanel = document.querySelector("#clue-panel");

const locationList = document.querySelector("#location-list");
const clueList = document.querySelector("#clue-list");

const itemModal = document.querySelector("#item-modal");
const modalImage = document.querySelector("#modal-image");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalActions = document.querySelector("#modal-actions");


/* =========================
   保存进度
========================= */

function saveGame() {
  localStorage.setItem(
    "namelessWeddingSave",
    JSON.stringify(gameState)
  );
}


/* =========================
   进入游戏
========================= */

startButton.addEventListener("click", function () {
  startScreen.classList.add("hidden");
  game.classList.remove("hidden");

  renderHall();
  renderCluePanel();
  renderMap();
  updateSoundButton();
  renderInventory();
  checkWeddingRewards();
});


/* =========================
   显示场景一
========================= */

function renderHall() {
  gameState.currentScene = "hall";

  sceneBackground.src = "images/hall/screen1.jpg";
  sceneBackground.alt = "宅院门厅";

  sceneTitle.textContent = "宅院门厅";

  messageText.textContent =
    "院门在身后关上了。柜台上的收音机突然传来杂音。";

  propLayer.innerHTML = "";

  hallProps.forEach(function (propData) {
    createSceneProp(propData);
  });

  saveGame();
  renderMap();
}
function renderWeddingHall() {
  gameState.currentScene = "wedding";

  sceneBackground.src = "images/wedding/screen2.jpg";
  sceneBackground.alt = "无人喜堂";

  sceneTitle.textContent = "无人喜堂";

  messageText.textContent =
    "四个纸人双手空空，桌面散落着几件婚礼用品。";

  propLayer.innerHTML = "";

  paperDolls.forEach(function (dollData) {
  createPaperDoll(dollData);

  const isSolved =
    gameState.solvedDolls.includes(dollData.id);

  if (isSolved) {
    createPlacedOffering(dollData);
  }
});

  offeringItems.forEach(function (itemData) {
    const alreadyCollected =
  gameState.inventory.includes(itemData.id);

const alreadyUsed =
  gameState.usedItems.includes(itemData.id);

if (!alreadyCollected && !alreadyUsed) {
  createOfferingItem(itemData);
}
  });
  if (
  gameState.solvedDolls.length ===
  paperDolls.length
) {
  createWeddingRewards();
}

  renderInventory();
  saveGame();
  renderMap();
}
function renderBedroom() {
  gameState.currentScene = "bedroom";

  sceneBackground.src =
    "images/bedroom/screen3.jpg";

  sceneBackground.alt = "新娘绣房";
  sceneTitle.textContent = "新娘绣房";

  messageText.textContent =
    "绣房里没有人，架上的嫁衣却像刚刚被人穿过。";

  propLayer.innerHTML = "";

  renderInventory();
  saveGame();
  renderMap();
}
function createOfferingItem(itemData) {
  const item = document.createElement("img");

  item.src = itemData.image;
  item.alt = itemData.name;
  item.title = itemData.name;

  item.classList.add(
    "scene-prop",
    "offering-item"
  );

  item.style.left = itemData.left;
  item.style.top = itemData.top;
  item.style.width = itemData.width;

  item.dataset.itemId = itemData.id;

  item.addEventListener("click", function () {
    inspectOfferingItem(itemData);
  });

  propLayer.appendChild(item);
}


function inspectOfferingItem(itemData) {
  openModal({
    title: itemData.name,
    image: itemData.image,
    description: itemData.description,

    actions: [
      {
        label: "拾取",
        action: function () {
          collectInventoryItem(itemData);
        }
      },

      {
        label: "收起",
        action: closeItemModal
      }
    ]
  });
}


function collectInventoryItem(itemData) {
  const alreadyCollected =
    gameState.inventory.includes(itemData.id);

  if (!alreadyCollected) {
    gameState.inventory.push(itemData.id);
  }

  selectedItemId = itemData.id;

  messageText.textContent =
    "获得道具：" + itemData.name;

  saveGame();
  renderInventory();
  closeItemModal();
  renderWeddingHall();
}

function renderInventory() {
  inventoryList.innerHTML = "";

  if (gameState.inventory.length === 0) {
    return;
  }

  gameState.inventory.forEach(function (itemId) {
    const itemData = allInventoryItems.find(
      function (item) {
        return item.id === itemId;
      }
    );

    if (!itemData) {
      return;
    }

    const slot = document.createElement("button");

    slot.type = "button";
    slot.classList.add("inventory-slot");
    slot.title = itemData.name;

    if (selectedItemId === itemId) {
      slot.classList.add("selected");
    }

    const image = document.createElement("img");

    image.src = itemData.image;
    image.alt = itemData.name;

    slot.appendChild(image);

    slot.addEventListener("click", function () {
      selectInventoryItem(itemId);
    });

    inventoryList.appendChild(slot);
  });
}


function selectInventoryItem(itemId) {
  if (selectedItemId === itemId) {
    selectedItemId = null;

    messageText.textContent =
      "已取消选择道具。";
  } else {
    selectedItemId = itemId;

    const itemData = allInventoryItems.find(
      function (item) {
        return item.id === itemId;
      }
    );

    messageText.textContent =
      "已选择：" + itemData.name +
      "。现在可以点击一个纸人。";
  }

  renderInventory();
}

function createPaperDoll(dollData) {
  const doll = document.createElement("img");

  doll.src = dollData.image;
  doll.alt = dollData.name;
  doll.title = dollData.name;

  doll.classList.add(
    "scene-prop",
    "paper-doll"
  );

  doll.style.left = dollData.left;
  doll.style.top = dollData.top;
  doll.style.width = dollData.width;

  doll.dataset.dollId = dollData.id;
  if (
  gameState.solvedDolls.includes(dollData.id)
) {
  doll.classList.add("solved");
}

  doll.addEventListener("click", function () {
    inspectPaperDoll(dollData);
  });

  propLayer.appendChild(doll);
}


function inspectPaperDoll(dollData) {
  const isSolved =
    gameState.solvedDolls.includes(dollData.id);

  if (isSolved) {
    openModal({
      title: dollData.name,
      image: dollData.image,

      description:
        "纸人已经接过供品，僵硬地低下了头。",

      actions: [
        {
          label: "收起",
          action: closeItemModal
        }
      ]
    });

    return;
  }

  if (!selectedItemId) {
    openModal({
      title: dollData.name,
      image: dollData.image,

      description:
        dollData.description +
        "\n\n它的双手空空，似乎正在等待某件东西。\n\n" +
        "请先从底部道具栏选择一件供品。",

      actions: [
        {
          label: "收起",
          action: closeItemModal
        }
      ]
    });

    return;
  }

  giveItemToPaperDoll(dollData);
}

function giveItemToPaperDoll(dollData) {
  const selectedItem = offeringItems.find(
    function (item) {
      return item.id === selectedItemId;
    }
  );

  if (!selectedItem) {
    return;
  }

  if (selectedItemId !== dollData.correctItem) {
    openModal({
      title: "供品错误",
      image: selectedItem.image,

      description:
        "纸人的头突然转向你。\n\n" +
        "它没有接过这件东西，看来供品放错了。",

      actions: [
        {
          label: "取回道具",
          action: closeItemModal
        }
      ]
    });

    messageText.textContent =
      "纸人拒绝了这件供品。";

    return;
  }

  const solvedItemId = selectedItemId;

  gameState.solvedDolls.push(dollData.id);
  gameState.usedItems.push(solvedItemId);

  gameState.inventory =
    gameState.inventory.filter(
      function (itemId) {
        return itemId !== solvedItemId;
      }
    );

  selectedItemId = null;

  saveGame();
  renderInventory();
  renderWeddingHall();

  openModal({
    title: "供品归位",
    image: selectedItem.image,

    description:
      "纸人缓缓抬起双手，接过了" +
      selectedItem.name +
      "。\n\n喜堂中传来一声低沉的木头摩擦声。",

    actions: [
      {
        label: "继续调查",
        action: closeItemModal
      }
    ]
  });

  checkPaperDollPuzzle();
}
const placedOfferingPositions = {
  "paper-doll-1": {
    left: "31.5%",
    top: "53%",
    width: "4%"
  },

  "paper-doll-2": {
    left: "42%",
    top: "54%",
    width: "3%"
  },

  "paper-doll-3": {
    left: "53%",
    top: "54%",
    width: "4%"
  },

  "paper-doll-4": {
    left: "63%",
    top: "52%",
    width: "3.5%"
  }
};


function createPlacedOffering(dollData) {
  const itemData = allInventoryItems.find(
    function (item) {
      return item.id === dollData.correctItem;
    }
  );

  const position =
    placedOfferingPositions[dollData.id];

  if (!itemData || !position) {
    return;
  }

  const placedItem = document.createElement("img");

  placedItem.src = itemData.image;
  placedItem.alt = itemData.name;

  placedItem.classList.add("placed-offering");

  placedItem.style.left = position.left;
  placedItem.style.top = position.top;
  placedItem.style.width = position.width;

  propLayer.appendChild(placedItem);
  
}
function createWeddingRewards() {
  const contractCollected =
    gameState.collectedRewards.includes(
      "marriage-top"
    );

  const candleCollected =
    gameState.collectedRewards.includes(
      "candle"
    );

  if (!contractCollected) {
    createWeddingReward({
      id: "marriage-top",
      name: "婚契上半部分",

      image:
        "images/wedding/marriage-top.png",

      left: "43%",
      top: "64%",
      width: "12%",

      description:
        "一张从中间撕断的旧婚契，上面的人名和日期已经模糊。"
    });
  }

  if (!candleCollected) {
    createWeddingReward({
      id: "candle",
      name: "熄灭的喜烛",

      image: "images/wedding/candle.png",

      left: "57%",
      top: "66%",
      width: "5%",

      description:
        "一根已经熄灭的喜烛，烛芯却仍然带着余温。"
    });
  }
}


function createWeddingReward(rewardData) {
  const reward = document.createElement("img");

  reward.src = rewardData.image;
  reward.alt = rewardData.name;
  reward.title = rewardData.name;

  reward.classList.add(
    "scene-prop",
    "wedding-reward"
  );

  reward.style.left = rewardData.left;
  reward.style.top = rewardData.top;
  reward.style.width = rewardData.width;

  reward.addEventListener("click", function () {
    inspectWeddingReward(rewardData);
  });

  propLayer.appendChild(reward);
}


function inspectWeddingReward(rewardData) {
  openModal({
    title: rewardData.name,
    image: rewardData.image,
    description: rewardData.description,

    actions: [
      {
        label: "收下",
        action: function () {
          collectWeddingReward(rewardData);
        }
      },

      {
        label: "收起",
        action: closeItemModal
      }
    ]
  });
}


function collectWeddingReward(rewardData) {
  const alreadyCollected =
    gameState.collectedRewards.includes(
      rewardData.id
    );

  if (!alreadyCollected) {
    gameState.collectedRewards.push(
      rewardData.id
    );
  }

  if (
    rewardData.id === "candle" &&
    !gameState.inventory.includes("candle")
  ) {
    gameState.inventory.push("candle");
  }

  if (rewardData.id === "marriage-top") {
    const alreadyInClues =
      gameState.clues.some(function (clue) {
        return clue.id === "marriage-top";
      });

    if (!alreadyInClues) {
      gameState.clues.push({
        id: "marriage-top",
        name: "婚契上半部分",

        image:
          "images/wedding/marriage-top.png",

        description:
          "一张从中间撕断的婚契。只有找到下半部分，才能看清完整的仪式内容。"
      });
    }
  }

  saveGame();
  closeItemModal();

  renderInventory();
  renderCluePanel();
  renderWeddingHall();

  messageText.textContent =
    "获得：" + rewardData.name;

  checkWeddingRewards();
}


function checkWeddingRewards() {
  const hasContract =
    gameState.collectedRewards.includes(
      "marriage-top"
    );

  const hasCandle =
    gameState.collectedRewards.includes(
      "candle"
    );

  if (!hasContract || !hasCandle) {
    return;
  }

  if (
    !gameState.unlockedScenes.includes(
      "bedroom"
    )
  ) {
    gameState.unlockedScenes.push(
      "bedroom"
    );
  }

  messageText.textContent =
    "暗格已经空了。通往新娘绣房的门缓缓打开。";

  saveGame();
  renderMap();
}
function checkPaperDollPuzzle() {
  if (
    gameState.solvedDolls.length <
    paperDolls.length
  ) {
    return;
  }

  messageText.textContent =
    "四件供品全部归位。喜宴桌下传来机关打开的声音。";

  openModal({
    title: "桌下暗格",

    image:
      "images/wedding/marriage-top.png",

    description:
      "四个纸人同时低下头。\n\n" +
      "喜宴桌下的暗格缓缓打开，里面似乎藏着一张残缺婚契和一根熄灭的喜烛。",

    actions: [
      {
        label: "查看暗格",
        action: closeItemModal
      }
    ]
  });
}
/* =========================
   创建透明互动道具
========================= */

function createSceneProp(propData) {
  const prop = document.createElement("img");

  prop.src = propData.image;
  prop.alt = propData.name;
  prop.title = propData.name;

  prop.classList.add("scene-prop");

  prop.style.left = propData.left;
  prop.style.top = propData.top;
  prop.style.width = propData.width;

  prop.dataset.propId = propData.id;

  prop.addEventListener("click", function () {
    handlePropClick(propData);
  });

  propLayer.appendChild(prop);
}


/* =========================
   点击道具
========================= */

function handlePropClick(propData) {
  collectClue(propData);

  if (propData.id === "radio") {
    openRadioModal(propData);
  }

  if (propData.id === "photo") {
    openPhotoModal(propData);
  }

  if (propData.id === "invitation") {
    openInvitationModal(propData);
  }

  checkHallCompletion();
}


/* =========================
   收集线索
========================= */

function collectClue(propData) {
  const alreadyCollected = gameState.clues.some(
    function (clue) {
      return clue.id === propData.id;
    }
  );

  if (!alreadyCollected) {
    gameState.clues.push({
      id: propData.id,
      name: propData.clueTitle,
      image: propData.image,
      description: propData.description
    });

    messageText.textContent =
      "发现线索：" + propData.clueTitle;

    saveGame();
    renderCluePanel();
  }
}


/* =========================
   收音机弹窗
========================= */

function openRadioModal(propData) {
  openModal({
    title: propData.clueTitle,
    image: propData.image,
    description: propData.description,

    actions: [
      {
        label: "收起",
        action: closeItemModal
      }
    ]
  });
}


/* =========================
   喜照弹窗
========================= */

function openPhotoModal(propData) {
  openModal({
    title: "残缺喜照，正面",
    image: "images/hall/photo-front.png",
    description:
      "照片中的新郎和新娘并排坐在喜堂中。\n\n" +
      "新娘面部被划去，新郎脸上贴着符纸，照片右下角缺失了一块。",

    actions: [
      {
        label: "翻到背面",
        action: showPhotoBack
      },

      {
        label: "收起",
        action: closeItemModal
      }
    ]
  });
}


function showPhotoBack() {
  openModal({
    title: "残缺喜照，背面",
    image: "images/hall/photo-back.png",
    description:
      "照片背面留下了一句已经模糊的警告：\n\n" +
      "“别替我。把我的名字还给我。”",

    actions: [
      {
        label: "翻回正面",
        action: openPhotoFrontAgain
      },

      {
        label: "收起",
        action: closeItemModal
      }
    ]
  });
}


function openPhotoFrontAgain() {
  const photoData = hallProps.find(
    function (prop) {
      return prop.id === "photo";
    }
  );

  openPhotoModal(photoData);
}


/* =========================
   喜帖弹窗
========================= */

function openInvitationModal(propData) {
  openModal({
    title: "无名喜帖，封面",
    image: "images/hall/invitation-front.png",
    description:
      "喜帖封面已经严重褪色。\n\n" +
      "封口处缠绕着一根暗红色细线。",

    actions: [
      {
        label: "打开喜帖",
        action: showInvitationOpen
      },

      {
        label: "查看背面",
        action: showInvitationBack
      },

      {
        label: "收起",
        action: closeItemModal
      }
    ]
  });
}


function showInvitationOpen() {
  openModal({
    title: "无名喜帖，内页",
    image: "images/hall/invitation-open.png",
    description:
      "喜帖上的新娘姓名被墨迹完全覆盖。\n\n" +
      "旁边画着四个模糊图案：灯、杯、梳、镜。",

    actions: [
      {
        label: "查看背面",
        action: showInvitationBack
      },

      {
        label: "合上喜帖",
        action: openInvitationAgain
      },

      {
        label: "收起",
        action: closeItemModal
      }
    ]
  });
}


function showInvitationBack() {
  openModal({
    title: "无名喜帖，背面",
    image: "images/hall/invitation-back.png",
    description:
      "喜帖背面留下了一行褪色小字：\n\n" +
      "“迎亲客各有所持，四礼归位，喜堂方开。”",

    actions: [
      {
        label: "打开喜帖",
        action: showInvitationOpen
      },

      {
        label: "收起",
        action: closeItemModal
      }
    ]
  });
}


function openInvitationAgain() {
  const invitationData = hallProps.find(
    function (prop) {
      return prop.id === "invitation";
    }
  );

  openInvitationModal(invitationData);
}


/* =========================
   通用弹窗
========================= */

function openModal(modalData) {
  modalTitle.textContent = modalData.title;
  modalImage.src = modalData.image;
  modalImage.alt = modalData.title;
  modalDescription.textContent = modalData.description;

  modalActions.innerHTML = "";

  modalData.actions.forEach(function (actionData) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = actionData.label;

    button.addEventListener(
      "click",
      actionData.action
    );

    modalActions.appendChild(button);
  });

  itemModal.classList.remove("hidden");
  itemModal.setAttribute("aria-hidden", "false");
}


function closeItemModal() {
  itemModal.classList.add("hidden");
  itemModal.setAttribute("aria-hidden", "true");
}


/* =========================
   检查场景一是否完成
========================= */

function checkHallCompletion() {
  const requiredClues = [
    "radio",
    "photo",
    "invitation"
  ];

  const hallCompleted = requiredClues.every(
    function (clueId) {
      return gameState.clues.some(
        function (clue) {
          return clue.id === clueId;
        }
      );
    }
  );

  if (
    hallCompleted &&
    !gameState.unlockedScenes.includes("wedding")
  ) {
    gameState.unlockedScenes.push("wedding");

    messageText.textContent =
      "喜帖上的红线自行断开。通往无人喜堂的门已经解锁。";

    saveGame();
    renderMap();
  }
}


/* =========================
   线索面板
========================= */

function renderCluePanel() {
  clueList.innerHTML = "";

  if (gameState.clues.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.classList.add("empty-message");
    emptyMessage.textContent = "暂时没有发现线索。";

    clueList.appendChild(emptyMessage);
    return;
  }

  gameState.clues.forEach(function (clue) {
    const clueCard = document.createElement("button");

    clueCard.type = "button";
    clueCard.classList.add("clue-card");

    clueCard.textContent = clue.name;

    clueCard.addEventListener("click", function () {
      openSavedClue(clue);
    });

    clueList.appendChild(clueCard);
  });
}


function openSavedClue(clue) {
  const originalProp = hallProps.find(function (prop) {
    return prop.id === clue.id;
  });

  if (originalProp) {
    handlePropClick(originalProp);
    return;
  }

  openModal({
    title: clue.name,
    image: clue.image,
    description: clue.description,

    actions: [
      {
        label: "收起",
        action: closeItemModal
      }
    ]
  });
}


/* =========================
   地图面板
========================= */

const locations = [
  {
    id: "hall",
    name: "宅院门厅"
  },

  {
    id: "wedding",
    name: "无人喜堂"
  },

  {
    id: "bedroom",
    name: "新娘绣房"
  },

  {
    id: "workshop",
    name: "后院纸扎铺"
  },

  {
    id: "corridor",
    name: "回门长廊"
  }
];


function renderMap() {
  locationList.innerHTML = "";

  locations.forEach(function (location) {
    const locationButton =
      document.createElement("button");

    locationButton.type = "button";
    locationButton.classList.add("location-button");

    const isUnlocked =
      gameState.unlockedScenes.includes(location.id);

    if (isUnlocked) {
      locationButton.textContent = location.name;
    } else {
      locationButton.textContent = "？？？";
      locationButton.disabled = true;
    }

    if (location.id === gameState.currentScene) {
      locationButton.textContent += "，当前位置";
    }

    locationButton.addEventListener(
      "click",
      function () {
        handleLocationClick(location.id);
      }
    );

    locationList.appendChild(locationButton);
  });
}


function handleLocationClick(locationId) {
  if (
    !gameState.unlockedScenes.includes(locationId)
  ) {
    return;
  }

  closePanel(mapPanel);

  if (locationId === "hall") {
    renderHall();
    return;
  }

  if (locationId === "wedding") {
    renderWeddingHall();
    return;
  }

 if (locationId === "bedroom") {
  renderBedroom();
  return;
}
}


/* =========================
   打开与关闭面板
========================= */

mapButton.addEventListener("click", function () {
  renderMap();

  mapPanel.classList.remove("hidden");
  mapPanel.setAttribute("aria-hidden", "false");
});


clueButton.addEventListener("click", function () {
  renderCluePanel();

  cluePanel.classList.remove("hidden");
  cluePanel.setAttribute("aria-hidden", "false");
});


document
  .querySelectorAll(".close-button")
  .forEach(function (button) {
    button.addEventListener("click", function () {
      const panelId = button.dataset.close;
      const panel = document.querySelector(
        "#" + panelId
      );

      closePanel(panel);
    });
  });


function closePanel(panel) {
  panel.classList.add("hidden");
  panel.setAttribute("aria-hidden", "true");
}


/* 点击黑色背景关闭弹窗 */

document
  .querySelectorAll(".overlay-panel")
  .forEach(function (panel) {
    panel.addEventListener("click", function (event) {
      if (event.target === panel) {
        closePanel(panel);
      }
    });
  });


/* =========================
   音效按钮
========================= */

soundButton.addEventListener("click", function () {
  gameState.soundEnabled =
    !gameState.soundEnabled;

  updateSoundButton();
  renderInventory();
  saveGame();
});


function updateSoundButton() {
  if (gameState.soundEnabled) {
    soundButton.textContent = "音效：开";
  } else {
    soundButton.textContent = "音效：关";
  }
}


/* =========================
   重置游戏
========================= */

resetButton.addEventListener("click", function () {
  const shouldReset = window.confirm(
    "确定要清空所有调查进度并重新开始吗？"
  );

  if (!shouldReset) {
    return;
  }

  localStorage.removeItem("namelessWeddingSave");
  window.location.reload();
});


/* =========================
   键盘关闭弹窗
========================= */

document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") {
    return;
  }

  closeItemModal();
  closePanel(mapPanel);
  closePanel(cluePanel);
});