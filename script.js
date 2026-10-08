// 获取页面元素
const sceneImage = document.querySelector("#scene-image");
const sceneTitle = document.querySelector("#scene-title");
const sceneDescription = document.querySelector("#scene-description");
const hotspotLayer = document.querySelector("#hotspot-layer");
const gameMessage = document.querySelector("#game-message");

const inventoryList = document.querySelector("#inventory-list");
const inventoryEmpty = document.querySelector("#inventory-empty");
const evidenceCount = document.querySelector("#evidence-count");

const dialog = document.querySelector("#interaction-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogContent = document.querySelector("#dialog-content");
const dialogActions = document.querySelector("#dialog-actions");

const roomButtons = document.querySelectorAll("[data-room]");
const resetButton = document.querySelector("#reset-button");
const closeDialogButton = document.querySelector("#close-dialog");

// 当前调查状态
let currentRoom = "hall";
let ending = null;

const collected = new Set();

// 证据内容
const evidence = {
  portrait: {
    name: "残损喜照",
    text: "照片中的新娘面容被刮去，背面写着：请把我的名字还给我。"
  },

  invitation: {
    name: "无名喜帖",
    text: "新娘姓名的位置一片空白。摸过纸面后，隐约出现了你的名字。"
  },

  radio: {
    name: "收音机口信",
    text: "收音机反复播放：新娘到了，照着规矩做，就能离开。"
  },

  contractHalf: {
    name: "婚契上半页",
    text: "以新名覆旧名……后面的文字被撕去了。"
  },

  candle: {
    name: "红烛",
    text: "从喜堂暗格找到的红烛，可以照亮纸扎铺的旧账册。"
  },

  diary: {
    name: "新娘日记",
    text: "他们说有人替我，我就能离开。但我不愿另一个人被困在这里。"
  },

  scissors: {
    name: "旧剪刀",
    text: "刀刃仍然锋利，可以剪开嫁衣内衬，以及喜帖上的红线。"
  },

  key: {
    name: "铜钥匙",
    text: "从嫁衣内衬中找到的钥匙，能够打开后院纸扎铺。"
  },

  contractRest: {
    name: "婚契下半页",
    text: "……前人出，后人留。原来所谓离开，需要另一个人作为替身。"
  },

  fullContract: {
    name: "完整婚契",
    text: "以新名覆旧名，前人出，后人留。\n收音机引导你完成的，其实是替身仪式。"
  },

  restoredPhoto: {
    name: "修复的喜照",
    text: "新娘名叫沈照月。\n照片显出一行小字：别替我，把我的名字还给我。"
  }
};

// 五个场景及交互标记
const rooms = {
  hall: {
    title: "宅院门厅",
    image: "images/screen1.jpg",
    alt: "挂着红灯笼的旧宅门厅，柜台上放着收音机",
    description: "调查柜台上的物件，再选择前往其他房间。",

    hotspots: [
      {
        label: "残损喜照",
        x: 25,
        y: 58,
        item: "portrait",
        action: () => inspect("portrait")
      },
      {
        label: "无名喜帖",
        x: 34,
        y: 64,
        item: "invitation",
        action: () => inspect("invitation")
      },
      {
        label: "收音机",
        x: 15,
        y: 46,
        item: "radio",
        action: () => inspect("radio")
      }
    ]
  },

  wedding: {
    title: "无人喜堂",
    image: "images/screen2.jpg",
    alt: "四个纸人站在喜宴桌后，红绸悬挂在房间内",
    description: "测试阶段，用按钮模拟纸人物品排列谜题。",

    hotspots: [
      {
        label: "纸人排列",
        x: 49,
        y: 53,
        item: "contractHalf",
        action: weddingPuzzle
      }
    ]
  },

  bedroom: {
    title: "新娘绣房",
    image: "images/screen3.jpg",
    alt: "有铜镜、梳妆台、绣盒与红色嫁衣的新娘绣房",
    description: "调查绣盒和嫁衣，寻找前往后院的线索。",

    hotspots: [
      {
        label: "查看绣盒",
        x: 12,
        y: 57,
        item: "scissors",
        action: sewingBox
      },
      {
        label: "检查嫁衣",
        x: 68,
        y: 48,
        item: "key",
        action: inspectDress
      }
    ]
  },

  workshop: {
    title: "后院纸扎铺",
    image: "images/screen4.jpg",
    alt: "放有花轿、未完成纸人、工作台和旧柜子的纸扎铺",
    description: "调查旧账册，拼合婚契，再修复新娘的照片。",

    hotspots: [
      {
        label: "旧账册",
        x: 84,
        y: 55,
        item: "contractRest",
        action: inspectLedger
      },
      {
        label: "拼合婚契",
        x: 26,
        y: 64,
        item: "fullContract",
        action: combineContract
      },
      {
        label: "修复喜照",
        x: 15,
        y: 72,
        item: "restoredPhoto",
        action: restorePhoto
      }
    ]
  },

  corridor: {
    title: "回门长廊",
    image: "images/screen5.jpg",
    alt: "挂着白灯的长廊，尽头是一扇红色木门",
    description: "你可以尝试仪式，也可以返回其他房间继续搜证。",

    hotspots: [
      {
        label: "查看铜镜",
        x: 13,
        y: 48,
        action: inspectMirror
      },
      {
        label: "红色木门",
        x: 50,
        y: 45,
        action: finalChoice
      }
    ]
  }
};

// 显示底部提示
function message(text) {
  gameMessage.textContent = text;
}

// 显示调查弹窗
function showDialog(title, text, actions = []) {
  dialogTitle.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  dialogContent.replaceChildren(paragraph);
  dialogActions.replaceChildren();

  actions.forEach((action) => {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", action.run);

    dialogActions.append(button);
  });

  if (!dialog.open) {
    dialog.showModal();
  }
}

// 关闭弹窗
closeDialogButton.addEventListener("click", () => {
  dialog.close();
});

// 收集证据
function collect(...items) {
  const newNames = [];

  items.forEach((id) => {
    if (!collected.has(id)) {
      collected.add(id);
      newNames.push(evidence[id].name);
    }
  });

  renderInventory();
  renderRoom();

  if (newNames.length > 0) {
    message(`已获得：${newNames.join("、")}。`);
  }
}

// 调查普通物件
function inspect(id) {
  const item = evidence[id];

  if (collected.has(id)) {
    showDialog(item.name, item.text);
    return;
  }

  showDialog(item.name, item.text, [
    {
      label: "记录线索",
      run: () => {
        collect(id);
        dialog.close();
      }
    }
  ]);
}

// 更新证据面板
function renderInventory() {
  evidenceCount.textContent = collected.size;
  inventoryEmpty.hidden = collected.size > 0;

  inventoryList.replaceChildren();

  collected.forEach((id) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "evidence-item";
    button.textContent = evidence[id].name;

    button.addEventListener("click", () => {
      showDialog(evidence[id].name, evidence[id].text);
    });

    inventoryList.append(button);
  });
}

// 更新当前场景
function renderRoom() {
  const room = rooms[currentRoom];

  sceneTitle.textContent = room.title;
  sceneDescription.textContent = room.description;
  sceneImage.alt = room.alt;

  // 同一个场景内收集线索时，不重复加载图片
  if (sceneImage.getAttribute("src") !== room.image) {
    sceneImage.setAttribute("src", room.image);
  }

  hotspotLayer.replaceChildren();

  if (!ending) {
    room.hotspots.forEach((spot) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "hotspot";
      button.textContent = spot.label;

      // 百分比位置让标记随场景图片缩放
      button.style.left = `${spot.x}%`;
      button.style.top = `${spot.y}%`;

      if (spot.item && collected.has(spot.item)) {
        button.classList.add("collected");
        button.textContent = `✓ ${spot.label}`;
      }

      button.addEventListener("click", spot.action);
      hotspotLayer.append(button);
    });
  }

  roomButtons.forEach((button) => {
    const roomId = button.dataset.room;

    const isActive = roomId === currentRoom;
    const isLocked =
      roomId === "workshop" && !collected.has("key");

    button.classList.toggle("active", isActive);
    button.classList.toggle("locked", isLocked);
    button.disabled = Boolean(ending);

    if (isActive) {
      button.setAttribute("aria-current", "true");
    } else {
      button.removeAttribute("aria-current");
    }

    if (roomId === "workshop") {
      button.textContent = isLocked
        ? "后院纸扎铺 🔒"
        : "后院纸扎铺";
    }
  });
}

// 房间切换
roomButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (ending) {
      return;
    }

    const target = button.dataset.room;

    if (target === "workshop" && !collected.has("key")) {
      showDialog(
        "后院门上了锁",
        "你需要先在新娘绣房找到铜钥匙。"
      );
      return;
    }

    currentRoom = target;

    renderRoom();
    message(`已进入${rooms[target].title}。`);
  });
});

// 喜堂：模拟纸人排列成功
function weddingPuzzle() {
  if (collected.has("contractHalf")) {
    showDialog(
      "喜堂暗格",
      "暗格已经打开，里面的婚契上半页和红烛已被取走。"
    );
    return;
  }

  showDialog(
    "纸人排列测试",
    "正式版本需要给四个纸人分配正确的物品。\n现在点击下方按钮，模拟排列成功并打开桌下暗格。",
    [
      {
        label: "模拟排列成功",
        run: () => {
          collect("contractHalf", "candle");
          dialog.close();
        }
      }
    ]
  );
}

// 绣房：收集日记与剪刀
function sewingBox() {
  if (collected.has("scissors")) {
    showDialog(
      "绣盒",
      "绣盒中的日记和剪刀已经收集。"
    );
    return;
  }

  showDialog(
    "打开的绣盒",
    "绣盒中放着一把旧剪刀和新娘日记。\n日记写着：他们说有人替我，我就能离开。但我不愿另一个人被困在这里。",
    [
      {
        label: "收集日记和剪刀",
        run: () => {
          collect("diary", "scissors");
          dialog.close();
        }
      }
    ]
  );
}

// 绣房：使用剪刀取出钥匙
function inspectDress() {
  if (collected.has("key")) {
    showDialog(
      "嫁衣内衬",
      "内衬已经剪开，铜钥匙已经取走。"
    );
    return;
  }

  if (!collected.has("scissors")) {
    showDialog(
      "嫁衣内衬",
      "内衬缝着一个硬物。你需要一把剪刀才能取出它。"
    );
    return;
  }

  showDialog(
    "嫁衣内衬",
    "使用旧剪刀剪开内衬吗？",
    [
      {
        label: "剪开内衬",
        run: () => {
          collect("key");
          dialog.close();
        }
      }
    ]
  );
}

// 纸扎铺：使用红烛查看账册
function inspectLedger() {
  if (collected.has("contractRest")) {
    inspect("contractRest");
    return;
  }

  if (!collected.has("candle")) {
    showDialog(
      "看不清的账册",
      "柜子深处太暗，无法辨认文字。\n喜堂里或许有可以照明的物品。"
    );
    return;
  }

  showDialog(
    "旧账册",
    "烛光照出了夹在账册里的婚契下半页：前人出，后人留。",
    [
      {
        label: "收集婚契下半页",
        run: () => {
          collect("contractRest");
          dialog.close();
        }
      }
    ]
  );
}

// 纸扎铺：拼合两半婚契
function combineContract() {
  if (collected.has("fullContract")) {
    inspect("fullContract");
    return;
  }

  const hasBothHalves =
    collected.has("contractHalf") &&
    collected.has("contractRest");

  if (!hasBothHalves) {
    showDialog(
      "婚契尚不完整",
      "需要收集婚契的上下两半，才能读出完整规则。"
    );
    return;
  }

  showDialog(
    "拼合婚契",
    evidence.fullContract.text,
    [
      {
        label: "记录完整婚契",
        run: () => {
          collect("fullContract");
          dialog.close();
        }
      }
    ]
  );
}

// 纸扎铺：模拟修复照片
function restorePhoto() {
  if (collected.has("restoredPhoto")) {
    inspect("restoredPhoto");
    return;
  }

  if (!collected.has("portrait")) {
    showDialog(
      "修复工作台",
      "你还没有收集残损喜照。\n请返回宅院门厅调查。"
    );
    return;
  }

  showDialog(
    "修复喜照测试",
    "工作台上备有修复材料。\n测试阶段，点击按钮即可模拟照片修复。",
    [
      {
        label: "修复照片",
        run: () => {
          collect("restoredPhoto");
          dialog.close();
        }
      }
    ]
  );
}

// 长廊：铜镜提示随调查状态变化
function inspectMirror() {
  const text = collected.has("restoredPhoto")
    ? "镜中出现沈照月的身影。\n她指着喜帖上的红线，轻声说：把我的名字还给我。"
    : "镜中有人穿着嫁衣，但那张脸越来越像你。";

  showDialog("长廊铜镜", text);
}

// 长廊：选择结局
function finalChoice() {
  if (!collected.has("invitation")) {
    showDialog(
      "红色木门",
      "门缝传来声音：来客需持喜帖。\n请先返回门厅收集喜帖。"
    );
    return;
  }

  const truthReady =
    collected.has("fullContract") &&
    collected.has("restoredPhoto") &&
    collected.has("diary") &&
    collected.has("scissors");

  const actions = [
    {
      label: "相信收音机，完成仪式",
      run: () => finishGame("bad")
    }
  ];

  if (truthReady) {
    actions.push({
      label: "写回沈照月的名字，剪断红线",
      run: () => finishGame("good")
    });
  }

  showDialog(
    "最后的选择",
    truthReady
      ? "你已经知道替身仪式的真相，也找到了新娘的名字。\n现在由你决定如何离开。"
      : "收音机催促你完成仪式。\n你也可以关闭弹窗，返回其他房间继续寻找证据。",
    actions
  );
}

// 结束调查
function finishGame(type) {
  ending = type;

  renderRoom();

  const title = type === "good"
    ? "结局 A：归还姓名"
    : "结局 B：下一位新娘";

  const text = type === "good"
    ? "你在喜帖上写下沈照月的名字，剪断了红线。\n白灯熄灭，红门缓缓打开。\n镜中的新娘终于露出自己的面容。\n你带着修复好的喜照走出旧宅。"
    : "你听从收音机，完成了仪式。\n红门没有打开，喜帖上却浮现出你的名字。\n镜中的你穿上了嫁衣。\n另一封匿名修复委托，正被寄往下一位来客。";

  sceneTitle.textContent = title;
  sceneDescription.textContent =
    "本次调查结束，可以重新开始测试另一条路径。";

  message(title);

  showDialog(title, text, [
    {
      label: "重新开始",
      run: resetGame
    }
  ]);
}

// 重置本次调查
function resetGame() {
  collected.clear();
  currentRoom = "hall";
  ending = null;

  if (dialog.open) {
    dialog.close();
  }

  renderInventory();
  renderRoom();

  message("调查已重置。点击门厅中的标记开始搜证。");
}

resetButton.addEventListener("click", resetGame);

// 图片加载失败时显示实际路径，方便排查
sceneImage.addEventListener("error", () => {
  const path = sceneImage.getAttribute("src");

  message(
    `图片加载失败：${path}。请检查 images 文件夹中的文件名和后缀。`
  );
});

// 初始化页面
renderInventory();
renderRoom();

message("点击残损喜照、无名喜帖或收音机，开始调查。");