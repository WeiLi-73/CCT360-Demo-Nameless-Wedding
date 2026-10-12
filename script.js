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
   页面元素
========================= */

const startScreen = document.querySelector("#start-screen");
const startButton = document.querySelector("#start-button");
const game = document.querySelector("#game");

const propLayer = document.querySelector("#prop-layer");

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
});


/* =========================
   显示场景一
========================= */

function renderHall() {
  gameState.currentScene = "hall";

  sceneTitle.textContent = "宅院门厅";

  messageText.textContent =
    "院门在身后关上了。柜台上的收音机突然传来杂音。";

  propLayer.innerHTML = "";

  hallProps.forEach(function (propData) {
    createSceneProp(propData);
  });

  saveGame();
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
  const originalProp = hallProps.find(
    function (prop) {
      return prop.id === clue.id;
    }
  );

  if (!originalProp) {
    return;
  }

  handlePropClick(originalProp);
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
  if (locationId === "hall") {
    closePanel(mapPanel);
    renderHall();
    return;
  }

  if (locationId === "wedding") {
    closePanel(mapPanel);

    messageText.textContent =
      "无人喜堂已经解锁。下一步将制作这个场景。";
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