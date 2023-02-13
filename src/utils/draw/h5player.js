import drawPolygon from "./polygon";

function h5Player() {
  this.CANVAS_H = 260;
  this.CANVAS_W = 460;
  // 设置可以绘制多少个多边形
  this.MAX_POLYGON_NUM = 1;
  // 设置一个多边形最多 多少边
  this.MAX_SIDES_OF_POLYGON = 8;

  this.canvasobj = null;

  this.isLiveView = 0;

  this.isFullScreen = 0;

  // TODO 缩放
  this.zoomLeft = 0;
  this.zoomTop = 0;

  this.dragging = false;

  /* 矩形rectangle */
  this.lprRoiEditIndex = -1;

  /* 多边形polygon */
  this.m_drawPolygon = 0;
  this.m_polygonAreaX = new Array(this.MAX_POLYGON_NUM);
  this.m_polygonAreaY = new Array(this.MAX_POLYGON_NUM);
  for (let i = 0; i < this.MAX_POLYGON_NUM; i++) {
    this.m_polygonAreaX[i] = [-1, -1, -1, -1, -1, -1, -1, -1];
    this.m_polygonAreaY[i] = [-1, -1, -1, -1, -1, -1, -1, -1];
  }
  this.m_ploygonIndex = 0;
  this.m_editPolygon = 0;
  // 当前编辑的多边形是第几个
  this.m_polygonNum = -1;

  this.m_polygonStrX = "";
  this.m_polygonStrY = "";

  this.GetPolygonMap = () => drawPolygon.getPolygonMap(this);
  this.GetPolygonByIndex = index => drawPolygon.getPolygonByIndex(this, index);
  // this.SetReadPolygon = (pointX, pointY) =>
  //   drawPolygon.setReadPolygon(this, pointX, pointY);
  // this.SetRegionAlarm = str => drawPolygon.setRegionAlarm(this, str);
  // this.SetPersonRectRegion = (enable, region) =>
  //   drawPolygon.setPersonRectRegion(this, enable, region);
  // this.SetPersonRectWithTime = (enable, region) =>
  //   drawPolygon.setPersonRectWithTime(this, enable, region);
  this.SetPolygonMap = (enable, polygonNum, pointX, pointY) =>
    drawPolygon.setPolygonMap(this, enable, polygonNum, pointX, pointY);
  // this.ClearPolygonMap = () => drawPolygon.clearPolygonMap(this);
  this.init();
}
h5Player.prototype.init = function (div_id) {
  const that = this;
  if (!div_id) {
    div_id = "selCanvas";
  }
  that.canvasobj = document.getElementById("selCanvas");
  that.CANVAS_W = that.canvasobj.width;
  that.CANVAS_H = that.canvasobj.height;
  // that.touchobj = document.getElementById("imgId");
  that.bindEvent();
};
/**
 *
 * @param {string} sKey
 * @param {string} sValue
 * @returns
 */
h5Player.prototype.SetParam = function (sKey, sValue) {
  const that = this;
  const r = /^\d+$/;
  if (r.test(sValue) == true) {
    sValue = parseInt(sValue);
  }
  switch (sKey) {
    case "curLineIndex":
      that.curLineIndex = sValue;
      break;

    case "canvasData":
      that.canvasData = sValue;
      break;
    case "clearpolygon":
      if (sValue < that.MAX_POLYGON_NUM)
        for (let i = 0; i < that.maxSidesOfPolygon; i++) {
          that.m_polygonAreaX[sValue][i] = -1;
          that.m_polygonAreaY[sValue][i] = -1;
        }
      that.m_ploygonIndex = 0;
      that.RedrawCanvas();
      break;
    case "setMaxSidesOfPolygon":
      that.maxSidesOfPolygon = sValue;
      break;
    default:
      break;
  }
  return;
};
function get_first_element(obj) {
  if (obj.length) {
    return obj[0];
  }
  return obj;
}

h5Player.prototype.bindEvent = function () {
  const that = this;
  const el = document.getElementById("selCanvas");
  that.docMouseDown = function (event) {
    const obj = document.getElementById("selCanvas");
    that.mouseDown(obj, event);
  };
  that.docMouseUp = function (event) {
    that.mouseUp(event);
  };
  that.docMouseMoveForDown = function (event) {
    that.mouseMove(get_first_element(that.mouseMoveObj).parentNode, event);
  };
  el.addEventListener("mousedown", that.docMouseDown);
  el.addEventListener("mouseup", that.docMouseUp);
  // el.addEventListener("mousemove", that.docMouseMove);

  // TODO 移动端兼容触摸事件
  // that.docTouchStart = function (event) {
  //   that.touchStart(event);
  // };
  // that.docTouchMove = function (event) {
  //   that.touchMove(event);
  // };
  // that.docTouchEnd = function (event) {
  //   that.touchEnd(event);
  // };

  // const imgEl = document.getElementById("imgId");
  // // 移动端393px * 214px
  // imgEl.addEventListener("touchstart", that.docTouchStart);
  // imgEl.addEventListener("touchmove", that.docTouchMove);
  // imgEl.addEventListener("touchend", that.docTouchEnd);
};
h5Player.prototype.mouseDown = function (obj, e) {
  const that = this;
  console.log(e.target);
  console.log("h5player mouseDown");
  if (!that.m_drawPolygon || that.isLiveView) return false;
  const x = e.clientX;
  const y = e.clientY;
  e.preventDefault();
  // if (document.getElementsByClassName("rubberband-div").length > 0)
  //   document
  //     .getElementsByClassName("rubberband-div")[0]
  //     .parentNode.removeChild(
  //       document.getElementsByClassName("rubberband-div")[0]
  //     );
  // if (get_first_element(e).parentNode) {
  //   get_first_element(e).parentNode.insertAdjacentHTML(
  //     "beforeend",
  //     '<div class="rubberband-div" style="top: 466px; left: 267px; width: 0px; height: 0px; display: none;"></div>'
  //   );
  // }

  try {
    const box = get_first_element(obj).parentNode.getBoundingClientRect();
    if (that.zoomLeft != box.left || that.zoomTop != box.top) {
      that.zoomLeft = box.left + window.scrollX;
      that.zoomTop = box.top + window.scrollY;
    }
  } catch (e) {}
  if (that.m_drawPolygon) {
    const tx = x - that.zoomLeft + window.scrollX,
      ty = y - that.zoomTop + window.scrollY;
    // f = false;
    drawPolygon.mouseDown(that, tx, ty);
  }
  that.mouseMoveObj = obj;
  document.addEventListener("mousemove", that.docMouseMoveForDown);
  // rubberbandStart(x, y);
  that.dragging = true;
};

h5Player.prototype.mouseUp = function (e) {
  const that = this;
  if (!that.dragging) return false;
  e.preventDefault();
  if (that.m_drawPolygon) {
    that.m_editPolygon = 0;
  }
  that.dragging = false;
};
h5Player.prototype.mouseMove = function (obj, e) {
  const that = this;
  if (!that.m_drawPolygon) return false;

  let x = e.clientX;
  let y = e.clientY;

  // mouseDown拖拽状态
  if (that.dragging) {
    const bbox = document.getElementById("selCanvas").getBoundingClientRect();
    x = x > bbox.right ? bbox.right : x;
    x = x < bbox.left ? bbox.left : x;
    y = y > bbox.bottom ? bbox.bottom : y;
    y = y < bbox.top ? bbox.top : y;
    //  rubberbandStretch(x, y);
    if (that.m_drawPolygon) {
      const tx = x - that.zoomLeft + window.scrollX;
      const ty = y - that.zoomTop + window.scrollY;
      drawPolygon.mouseMoveDrag(that, tx, ty, x, y, mousedown);
    }
  } else {
    // Only mouseMove 非拖拽状态
    if (document.getElementById("selCanvas")) {
      document.getElementById("selCanvas").style.cursor = "inherit";
    }

    let selX = x;
    let selY = y;
    if (!that.isFullScreen) {
      selX = selX - that.zoomLeft + window.scrollX;
      selY = y - that.zoomTop + window.scrollY;
    }
    if (that.m_drawPolygon) {
      const box = obj.parentNode.getBoundingClientRect();
      if (that.zoomLeft != box.left || that.zoomTop != box.top) {
        that.zoomLeft = box.left + window.scrollX;
        that.zoomTop = box.top + window.scrollY;
      }
      const tx = x - that.zoomLeft + window.scrollX;
      const ty = y - that.zoomTop + window.scrollY;
      drawPolygon.mouseMoveNoDrag(that, tx, ty);
    }
  }
};
const mousedown = {};
const rubberbandRectangle = {};
// function rubberbandStart(x, y) {
//   mousedown.x = x;
//   mousedown.y = y;
//   rubberbandRectangle.left = mousedown.x;
//   rubberbandRectangle.top = mousedown.y;
//   moveRubberbandDiv();
// }

//translate zoomDiv
// function moveRubberbandDiv() {
//   const h5players = typeof player == "undefined" ? xPlayer : player.m_xPlayer;
//   if (!h5players.isFullScreen) {
//     rubberbandRectangle.left =
//       rubberbandRectangle.left - h5players.zoomLeft + window.scrollX;
//     rubberbandRectangle.top =
//       rubberbandRectangle.top - h5players.zoomTop + window.scrollY;
//   }
//   document.getElementsByClassName(
//     "rubberband-div"
//   )[0].style.top = `${rubberbandRectangle.top}px`;
//   document.getElementsByClassName(
//     "rubberband-div"
//   )[0].style.left = `${rubberbandRectangle.left}px`;
// }

h5Player.prototype.RedrawCanvas = function (obj) {
  const that = this;
  let c = document.getElementById("selCanvas");
  if (obj) {
    c = document.getElementById(obj);
  }
  if (c == null) return;
  if (c.width == 0) {
    document.getElementById("#VideoAxRoom").style.display = "";
  }
  const ctx = c.getContext("2d");
  const nowWidth = Math.round(
    parseInt(c.parentNode.getElementsByClassName("h5canvas")[0].clientWidth)
  );
  const nowHeight = Math.round(
    c.parentNode.getElementsByClassName("h5canvas")[0].clientHeight
  );
  if (ctx.canvas.width != nowWidth || ctx.canvas.height != nowHeight) {
    that.canvasWidth = nowWidth;
    ctx.canvas.width = nowWidth;
    ctx.canvas.height = nowHeight;
  }
  if (that.m_drawPolygon) {
    drawPolygon.redrawCanvas(that, ctx, c);
    return;
  }
};

export default h5Player;
