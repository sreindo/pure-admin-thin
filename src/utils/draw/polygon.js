/**
 * 多边形绘制方法
 */

import {
  pnpoly,
  intersection,
  mod_oper,
  get_cross_by_ray_x,
  get_cross_by_ray_y,
  get_start_point,
  get_first_element
} from "./utils";
// import i18n from "../../i18n";
// import { tipsBox } from "@/utils/utils";
const bindEvent = function (that) {
  if (!document.getElementById("selCanvas").getAttribute("isEvent")) {
    document
      .getElementById("selCanvas")
      .addEventListener("mousedown", function (event) {
        that.mouseDown(this, event);
      });
    document
      .getElementById("selCanvas")
      .addEventListener("contextmenu", function () {
        contextMenu(that);
      });
    document.getElementById("selCanvas").setAttribute("isEvent", true);
  }
};
const removeEvent = function (that) {
  document
    .getElementById("selCanvas")
    .removeEventListener("mousedown", that.mouseDown);
  document
    .getElementById("selCanvas")
    .removeEventListener("contextmenu", that.contextMenu);
  document.getElementById("selCanvas").removeAttribute("isEvent");
};
const mousedown = {};
const mouseDown = function (that, tx, ty) {
  console.log("polygon mouseDown");
  let f = false;
  mousedown.x = tx;
  mousedown.y = ty;
  if (that.m_ploygonIndex == 0) {
    for (let j = 0; j < that.MAX_POLYGON_NUM; j++) {
      if (that.m_polygonAreaX[j][0] != -1) {
        let i = 0;
        for (i = 0; i < that.MAX_SIDES_OF_POLYGON; i++) {
          if (that.m_polygonAreaX[j][i] == -1) break;
          if (
            Math.abs(tx - that.m_polygonAreaX[j][i]) < 10 &&
            Math.abs(ty - that.m_polygonAreaY[j][i]) < 10
          ) {
            that.m_editPolygon = i + 1;
            that.m_polygonNum = j;
            break;
          }
        }
        if (
          that.m_editPolygon == 0 &&
          pnpoly(i, that.m_polygonAreaX[j], that.m_polygonAreaY[j], tx, ty)
        ) {
          that.m_editPolygon = that.MAX_SIDES_OF_POLYGON + 1;
          that.m_polygonNum = j;
        }
      }
    }
  }
  if (that.m_editPolygon == 0) {
    if (that.m_ploygonIndex == 0) {
      that.m_polygonNum = 0;
      while (
        that.m_polygonNum < that.MAX_POLYGON_NUM &&
        that.m_polygonAreaX[that.m_polygonNum][0] != -1
      )
        that.m_polygonNum++;
    }
    if (that.m_polygonNum < that.MAX_POLYGON_NUM) {
      if (
        that.m_ploygonIndex > 2 &&
        Math.abs(tx - that.m_polygonAreaX[that.m_polygonNum][0]) < 10 &&
        Math.abs(ty - that.m_polygonAreaY[that.m_polygonNum][0]) < 10
      ) {
        // LPR 不规则四边形 不支持三角形
        // if (that.drawLPRpolygon) return;

        tx = that.m_polygonAreaX[that.m_polygonNum][0];
        ty = that.m_polygonAreaY[that.m_polygonNum][0];
        for (let i = 1; i < that.m_ploygonIndex - 2; i++) {
          if (
            intersection(
              that.m_polygonAreaX[that.m_polygonNum][that.m_ploygonIndex - 1],
              that.m_polygonAreaY[that.m_polygonNum][that.m_ploygonIndex - 1],
              tx,
              ty,
              that.m_polygonAreaX[that.m_polygonNum][i],
              that.m_polygonAreaY[that.m_polygonNum][i],
              that.m_polygonAreaX[that.m_polygonNum][i + 1],
              that.m_polygonAreaY[that.m_polygonNum][i + 1]
            )
          ) {
            f = true;
            break;
          }
        }
      } else {
        for (let i = 0; i < that.m_ploygonIndex - 2; i++) {
          if (
            intersection(
              that.m_polygonAreaX[that.m_polygonNum][that.m_ploygonIndex - 1],
              that.m_polygonAreaY[that.m_polygonNum][that.m_ploygonIndex - 1],
              tx,
              ty,
              that.m_polygonAreaX[that.m_polygonNum][i],
              that.m_polygonAreaY[that.m_polygonNum][i],
              that.m_polygonAreaX[that.m_polygonNum][i + 1],
              that.m_polygonAreaY[that.m_polygonNum][i + 1]
            )
          ) {
            f = true;
            break;
          }
        }
        if (
          tx ==
            that.m_polygonAreaX[that.m_polygonNum][that.m_ploygonIndex - 1] &&
          ty == that.m_polygonAreaY[that.m_polygonNum][that.m_ploygonIndex - 1]
        )
          f = true;
      }
      if (!f) {
        if (
          that.m_ploygonIndex === that.MAX_SIDES_OF_POLYGON - 1 &&
          (Math.abs(tx - that.m_polygonAreaX[that.m_polygonNum][0]) >= 10 ||
            Math.abs(ty - that.m_polygonAreaY[that.m_polygonNum][0]) >= 10)
        ) {
          for (let i = 1; i < that.m_ploygonIndex - 1; i++) {
            if (
              intersection(
                tx,
                ty,
                that.m_polygonAreaX[that.m_polygonNum][0],
                that.m_polygonAreaY[that.m_polygonNum][0],
                that.m_polygonAreaX[that.m_polygonNum][i],
                that.m_polygonAreaY[that.m_polygonNum][i],
                that.m_polygonAreaX[that.m_polygonNum][i + 1],
                that.m_polygonAreaY[that.m_polygonNum][i + 1]
              )
            ) {
              f = 1;
              break;
            }
          }
          if (f) {
            // tipsBox(i18n.t("cannotIntersectTips"), "warning");
            that.m_polygonAreaX[that.m_polygonNum] = [
              -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            ];
            that.m_polygonAreaY[that.m_polygonNum] = [
              -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            ];
            that.m_ploygonIndex = 0;
            that.RedrawCanvas();
          } else {
            that.m_polygonAreaX[that.m_polygonNum][that.m_ploygonIndex] = tx;
            that.m_polygonAreaY[that.m_polygonNum][that.m_ploygonIndex] = ty;
            that.m_ploygonIndex = 0;
            that.RedrawCanvas();
            that.m_polygonNum++;
            document.getElementById("selCanvas").style.cursor = "auto";
          }
        } else if (
          that.m_ploygonIndex > 2 &&
          Math.abs(tx - that.m_polygonAreaX[that.m_polygonNum][0]) < 10 &&
          Math.abs(ty - that.m_polygonAreaY[that.m_polygonNum][0]) < 10
        ) {
          that.m_polygonAreaX[that.m_polygonNum][that.m_ploygonIndex] = -1;
          that.m_polygonAreaY[that.m_polygonNum][that.m_ploygonIndex] = -1;
          that.m_ploygonIndex = 0;
          that.RedrawCanvas();
          that.m_polygonNum++;
          document.getElementById("selCanvas").style.cursor = "auto";
        } else {
          if (
            that.lprRoiEditIndex == -1 ||
            that.m_ploygonIndex != 0 ||
            that.m_polygonAreaX[that.lprRoiEditIndex][0] == -1
          ) {
            that.m_polygonAreaX[that.m_polygonNum][that.m_ploygonIndex] = tx;
            that.m_polygonAreaY[that.m_polygonNum][that.m_ploygonIndex] = ty;
            that.m_ploygonIndex++;
          }
        }
      }
    }
  }
};

const mouseMoveDrag = function (that, tx, ty, x, y) {
  console.log("polygon mouseMoveDrag");
  // let tx = x - that.zoomLeft + window.scrollX, ty = y - that.zoomTop + window.scrollY
  if (that.m_ploygonIndex) {
    that.m_polygonAreaX[that.m_polygonNum][that.m_ploygonIndex] = tx;
    that.m_polygonAreaY[that.m_polygonNum][that.m_ploygonIndex] = ty;
    that.RedrawCanvas();
  } else if (that.m_editPolygon == that.MAX_SIDES_OF_POLYGON + 1) {
    let maxX = 0,
      minX = that.canvasobj.width,
      maxY = 0,
      minY = that.canvasobj.height;
    for (let i = 0; i < that.MAX_SIDES_OF_POLYGON; i++) {
      if (that.m_polygonAreaX[that.m_polygonNum][i] == -1) break;
      maxX = Math.max(maxX, that.m_polygonAreaX[that.m_polygonNum][i]);
      minX = Math.min(minX, that.m_polygonAreaX[that.m_polygonNum][i]);
      maxY = Math.max(maxY, that.m_polygonAreaY[that.m_polygonNum][i]);
      minY = Math.min(minY, that.m_polygonAreaY[that.m_polygonNum][i]);
    }
    if (
      maxX + x - mousedown.x <= that.canvasobj.width &&
      minX + x - mousedown.x >= 0 &&
      maxY + y - mousedown.y <= that.canvasobj.height &&
      minY + y - mousedown.y >= 0
    ) {
      for (let i = 0; i < that.MAX_SIDES_OF_POLYGON; i++) {
        if (that.m_polygonAreaX[that.m_polygonNum][i] == -1) break;
        that.m_polygonAreaX[that.m_polygonNum][i] += x - mousedown.x;
        that.m_polygonAreaY[that.m_polygonNum][i] += y - mousedown.y;
      }
      that.RedrawCanvas();
    }
    mousedown.y = y;
    mousedown.x = x;
  } else if (that.m_editPolygon > 0) {
    document.getElementById("selCanvas").style.cursor = "grab";
    let f = 0,
      sides = 0;
    while (
      sides < that.MAX_SIDES_OF_POLYGON &&
      that.m_polygonAreaX[that.m_polygonNum][sides] != -1
    )
      sides++;
    for (let i = 0; i < sides; i++) {
      if (
        i != mod_oper(that.m_editPolygon - 3, sides) &&
        i != mod_oper(that.m_editPolygon - 2, sides) &&
        i != mod_oper(that.m_editPolygon - 1, sides)
      ) {
        if (
          intersection(
            tx,
            ty,
            that.m_polygonAreaX[that.m_polygonNum][
              mod_oper(that.m_editPolygon - 2, sides)
            ],
            that.m_polygonAreaY[that.m_polygonNum][
              mod_oper(that.m_editPolygon - 2, sides)
            ],
            that.m_polygonAreaX[that.m_polygonNum][i],
            that.m_polygonAreaY[that.m_polygonNum][i],
            that.m_polygonAreaX[that.m_polygonNum][mod_oper(i + 1, sides)],
            that.m_polygonAreaY[that.m_polygonNum][mod_oper(i + 1, sides)]
          )
        ) {
          f = 1;
          break;
        }
      }
      if (
        i != mod_oper(that.m_editPolygon - 2, sides) &&
        i != mod_oper(that.m_editPolygon - 1, sides) &&
        i != mod_oper(that.m_editPolygon, sides)
      ) {
        if (
          intersection(
            tx,
            ty,
            that.m_polygonAreaX[that.m_polygonNum][
              mod_oper(that.m_editPolygon, sides)
            ],
            that.m_polygonAreaY[that.m_polygonNum][
              mod_oper(that.m_editPolygon, sides)
            ],
            that.m_polygonAreaX[that.m_polygonNum][i],
            that.m_polygonAreaY[that.m_polygonNum][i],
            that.m_polygonAreaX[that.m_polygonNum][mod_oper(i + 1, sides)],
            that.m_polygonAreaY[that.m_polygonNum][mod_oper(i + 1, sides)]
          )
        ) {
          f = 1;
          break;
        }
      }
    }
    if (!f) {
      that.m_polygonAreaX[that.m_polygonNum][that.m_editPolygon - 1] = tx;
      that.m_polygonAreaY[that.m_polygonNum][that.m_editPolygon - 1] = ty;
      that.RedrawCanvas();
    }
  }
};

const mouseMoveNoDrag = function (that, tx, ty) {
  console.log("call polygon mouseMoveNoDrag");
  if (that.m_ploygonIndex) {
    that.m_polygonAreaX[that.m_polygonNum][that.m_ploygonIndex] = tx;
    that.m_polygonAreaY[that.m_polygonNum][that.m_ploygonIndex] = ty;
    that.RedrawCanvas();
    if (
      that.m_ploygonIndex >= 3 &&
      Math.abs(tx - that.m_polygonAreaX[that.m_polygonNum][0]) < 10 &&
      Math.abs(ty - that.m_polygonAreaY[that.m_polygonNum][0]) < 10
    )
      document.getElementById("selCanvas").style.cursor =
        "url(/image/pen_point.png),auto";
    else
      document.getElementById("selCanvas").style.cursor =
        "url(/image/pen.png),auto";
  } else {
    let f = 0,
      j = 0;
    for (let i = 0; i < that.MAX_POLYGON_NUM; i++) {
      for (j = 0; j < that.MAX_SIDES_OF_POLYGON; j++) {
        if (that.m_polygonAreaX[i][j] == -1) break;
        if (
          Math.abs(tx - that.m_polygonAreaX[i][j]) < 10 &&
          Math.abs(ty - that.m_polygonAreaY[i][j]) < 10
        ) {
          document.getElementById("selCanvas").style.cursor = "grab";
          f = 1;
          break;
        }
      }
      if (f == 1) break;
      if (pnpoly(j, that.m_polygonAreaX[i], that.m_polygonAreaY[i], tx, ty))
        document.getElementById("selCanvas").style.cursor = "move";
    }
    if (
      (j > 0 ||
        (that.lprRoiEditIndex > -1 &&
          that.m_polygonAreaX[that.lprRoiEditIndex][0] != -1)) &&
      document.getElementById("selCanvas").style.cursor != "move" &&
      document.getElementById("selCanvas").style.cursor != "grab"
    )
      document.getElementById("selCanvas").style.cursor = "auto";
    else if (
      j == 0 &&
      (document.getElementById("selCanvas").style.cursor == "auto" ||
        document.getElementById("selCanvas").style.cursor == "inherit")
    ) {
      // document.getElementById("selCanvas").style.cursor =
      //   "url(/image/pen.png),auto";
    }
  }
};
/**
 * 绘制多边形过程中点击右键直接连接首尾
 */
const contextMenu = function (that) {
  if (!that.m_drawPolygon) return false;
  if (that.m_ploygonIndex == 2) {
    if (
      that.m_polygonAreaX[that.m_polygonNum][0] !=
        that.m_polygonAreaX[that.m_polygonNum][1] &&
      that.m_polygonAreaY[that.m_polygonNum][0] !=
        that.m_polygonAreaY[that.m_polygonNum][1]
    ) {
      that.m_polygonAreaX[that.m_polygonNum][2] =
        that.m_polygonAreaX[that.m_polygonNum][1];
      that.m_polygonAreaY[that.m_polygonNum][2] =
        that.m_polygonAreaY[that.m_polygonNum][1];
      that.m_polygonAreaX[that.m_polygonNum][3] =
        that.m_polygonAreaX[that.m_polygonNum][0];
      that.m_polygonAreaY[that.m_polygonNum][3] =
        that.m_polygonAreaY[that.m_polygonNum][2];
      that.m_polygonAreaY[that.m_polygonNum][1] =
        that.m_polygonAreaY[that.m_polygonNum][0];
      that.m_ploygonIndex = 0;
      that.RedrawCanvas();
      document.getElementById("selCanvas").style.cursor = "auto";
    }
  } else if (that.m_ploygonIndex > 2) {
    // LPR 不规则四边形 不支持三角形
    // if (that.drawLPRpolygon) return;

    let f = 0;
    for (let i = 1; i < that.m_ploygonIndex - 2; i++) {
      if (
        intersection(
          that.m_polygonAreaX[that.m_polygonNum][that.m_ploygonIndex - 1],
          that.m_polygonAreaY[that.m_polygonNum][that.m_ploygonIndex - 1],
          that.m_polygonAreaX[that.m_polygonNum][0],
          that.m_polygonAreaY[that.m_polygonNum][0],
          that.m_polygonAreaX[that.m_polygonNum][i],
          that.m_polygonAreaY[that.m_polygonNum][i],
          that.m_polygonAreaX[that.m_polygonNum][i + 1],
          that.m_polygonAreaY[that.m_polygonNum][i + 1]
        )
      ) {
        f = 1;
        break;
      }
    }
    if (f) {
      //   tipsBox(i18n.t("cannotIntersectTips"), "warning");
      that.m_polygonAreaX[that.m_polygonNum] = [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
      ];
      that.m_polygonAreaY[that.m_polygonNum] = [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
      ];
      that.m_ploygonIndex = 0;
      that.RedrawCanvas();
    } else {
      that.m_polygonAreaX[that.m_polygonNum][that.m_ploygonIndex] = -1;
      that.m_polygonAreaY[that.m_polygonNum][that.m_ploygonIndex] = -1;
      that.m_ploygonIndex = 0;
      that.RedrawCanvas();
      document.getElementById("selCanvas").style.cursor = "auto";
    }
  }
};

/**
 * 重绘多边形
 * @param {*} that
 * @param {*} ctx
 * @param {*} c
 * @returns
 */
const redrawCanvas = function (that, ctx, c) {
  ctx.clearRect(0, 0, c.width, c.height);
  if (that.m_bEnableZoom) return;
  ctx.lineWidth = 2;
  let fontSize = 12 + parseInt((that.canvasobj.clientWidth - 456) / 120);
  fontSize = Math.min(fontSize, 24);
  if (fontSize == 12) ctx.font = "bold " + fontSize + "px Arial";
  else ctx.font = fontSize + "px Arial";
  for (let j = 0; j < that.MAX_POLYGON_NUM; j++) {
    ctx.strokeStyle = "#0000FE";
    if (that.m_polygonalarm & (1 << j)) ctx.strokeStyle = "#f00";
    if (that.m_polygonColor == 1) ctx.strokeStyle = "yellow";
    if (that.m_polygonColor == 2) ctx.strokeStyle = "#f00";
    if (
      that.m_regionIndex != that.m_polygonTextNumber &&
      that.m_regionAlarm & (1 << that.m_regionIndex)
    )
      ctx.strokeStyle = "#f00";
    if (
      that.m_regionIndex == that.m_polygonTextNumber &&
      that.m_regionAlarm & (1 << j)
    )
      ctx.strokeStyle = "#f00";

    ctx.beginPath();
    ctx.moveTo(that.m_polygonAreaX[j][0], that.m_polygonAreaY[j][0]);
    for (let i = 1; i <= that.MAX_SIDES_OF_POLYGON; i++) {
      if (that.m_polygonAreaX[j][i] == -1) break;
      ctx.lineTo(that.m_polygonAreaX[j][i], that.m_polygonAreaY[j][i]);
    }
    if (that.m_ploygonIndex == 0 || j != that.m_polygonNum)
      ctx.lineTo(that.m_polygonAreaX[j][0], that.m_polygonAreaY[j][0]);
    ctx.stroke();

    if (
      that.m_polygonAreaX[j][0] != -1 &&
      that.m_ploygonIndex == 0 &&
      (that.m_showRegionText || that.m_regionIndex > -1)
    ) {
      let t1 = 0,
        t2 = 1,
        maxSide = 0,
        i = 0;
      for (i = 0; i < that.MAX_SIDES_OF_POLYGON; i++) {
        if (that.m_polygonAreaX[j][i] == -1) break;
        let curSide = 0;
        if (
          i == that.MAX_SIDES_OF_POLYGON - 1 ||
          that.m_polygonAreaX[j][i + 1] == -1
        ) {
          curSide =
            Math.pow(that.m_polygonAreaX[j][i] - that.m_polygonAreaX[j][0], 2) +
            Math.pow(that.m_polygonAreaY[j][i] - that.m_polygonAreaY[j][0], 2);
        } else {
          curSide =
            Math.pow(
              that.m_polygonAreaX[j][i] - that.m_polygonAreaX[j][i + 1],
              2
            ) +
            Math.pow(
              that.m_polygonAreaY[j][i] - that.m_polygonAreaY[j][i + 1],
              2
            );
        }
        if (curSide > maxSide) {
          maxSide = curSide;
          t1 = i;
        }
      }
      t2 =
        t1 == that.MAX_SIDES_OF_POLYGON - 1 ||
        that.m_polygonAreaX[j][t1 + 1] == -1
          ? 0
          : t1 + 1;
      if (
        that.m_polygonAreaX[j][t1] > that.m_polygonAreaX[j][t2] ||
        (that.m_polygonAreaX[j][t1] == that.m_polygonAreaX[j][t2] &&
          that.m_polygonAreaY[j][t1] > that.m_polygonAreaY[j][t2])
      ) {
        const t = t1;
        t1 = t2;
        t2 = t;
      }

      ctx.save();
      ctx.translate(that.m_polygonAreaX[j][t1], that.m_polygonAreaY[j][t1]);
      const proportion =
        Math.abs(that.m_polygonAreaY[j][t2] - that.m_polygonAreaY[j][t1]) /
        (that.m_polygonAreaX[j][t2] - that.m_polygonAreaX[j][t1]);
      let angle = Math.atan(proportion); // / Math.PI * 180;

      const dx = that.m_polygonAreaX[j][t2] - that.m_polygonAreaX[j][t1];
      const dy = that.m_polygonAreaY[j][t2] - that.m_polygonAreaY[j][t1];

      if (dy < 0 && dx > 0) angle = 0 - angle;
      else if (dy < 0 && dx < 0) angle += 180;
      else if (dy > 0 && dx < 0) angle = 180 - angle;

      ctx.rotate(angle);
      ctx.fillStyle = ctx.strokeStyle;

      if (
        that.m_regionIndex == that.m_polygonTextNumber ||
        that.m_showRegionText
      ) {
        if (dy == 0) {
          const np = get_cross_by_ray_y(
            i,
            that.m_polygonAreaX[j],
            that.m_polygonAreaY[j],
            (that.m_polygonAreaX[j][t1] + that.m_polygonAreaX[j][t2]) / 2,
            (that.m_polygonAreaY[j][t1] + that.m_polygonAreaY[j][t2]) / 2,
            get_start_point(t1, t2)
          );
          if ((np % 2 && dx > 0) || (np % 2 == 0 && dx < 0)) {
            ctx.fillText("Region" + (j + 1), 5, -15);
            if (that.m_stayAlarm & (1 << j)) ctx.fillStyle = "#f00";
            else ctx.fillStyle = "#0000FE";
            if (that.stayNum[j] > -1)
              ctx.fillText(" stay: " + that.stayNum[j], 4 * fontSize + 7, -15);
          } else {
            ctx.fillText("Region" + (j + 1), 5, fontSize + 3);
            if (that.m_stayAlarm & (1 << j)) ctx.fillStyle = "#f00";
            else ctx.fillStyle = "#0000FE";
            if (that.stayNum[j] > -1)
              ctx.fillText(
                " stay: " + that.stayNum[j],
                4 * fontSize + 7,
                fontSize + 3
              );
          }
        } else {
          const np = get_cross_by_ray_x(
            i,
            that.m_polygonAreaX[j],
            that.m_polygonAreaY[j],
            (that.m_polygonAreaX[j][t1] + that.m_polygonAreaX[j][t2]) / 2,
            (that.m_polygonAreaY[j][t1] + that.m_polygonAreaY[j][t2]) / 2,
            get_start_point(t1, t2),
            that.canvasobj.clientWidth
          );
          if ((np % 2 && dy > 0) || (np % 2 == 0 && dy < 0)) {
            ctx.fillText("Region" + (j + 1), 5, -12);
            if (that.m_stayAlarm & (1 << j)) ctx.fillStyle = "#f00";
            else ctx.fillStyle = "#0000FE";
            if (that.stayNum[j] > -1)
              ctx.fillText(" stay: " + that.stayNum[j], 4 * fontSize + 7, -12);
          } else {
            ctx.fillText("Region" + (j + 1), 5, fontSize + 3);
            if (that.m_stayAlarm & (1 << j)) ctx.fillStyle = "#f00";
            else ctx.fillStyle = "#0000FE";
            if (that.stayNum[j] > -1)
              ctx.fillText(
                " stay: " + that.stayNum[j],
                4 * fontSize + 7,
                fontSize + 3
              );
          }
        }
      } else {
        if (dy == 0) {
          const np = get_cross_by_ray_y(
            i,
            that.m_polygonAreaX[j],
            that.m_polygonAreaY[j],
            (that.m_polygonAreaX[j][t1] + that.m_polygonAreaX[j][t2]) / 2,
            (that.m_polygonAreaY[j][t1] + that.m_polygonAreaY[j][t2]) / 2,
            get_start_point(t1, t2)
          );
          if ((np % 2 && dx > 0) || (np % 2 == 0 && dx < 0)) {
            ctx.fillText("Region" + (that.m_regionIndex + 1), 5, -15);
            if (that.m_stayAlarm & (1 << that.m_regionIndex))
              ctx.fillStyle = "#f00";
            else ctx.fillStyle = "#0000FE";
            if (that.stayNum[that.m_regionIndex] > -1)
              ctx.fillText(
                " stay: " + that.stayNum[that.m_regionIndex],
                55,
                -15
              );
          } else {
            ctx.fillText("Region" + (that.m_regionIndex + 1), 5, 15);
            if (that.m_stayAlarm & (1 << that.m_regionIndex))
              ctx.fillStyle = "#f00";
            else ctx.fillStyle = "#0000FE";
            if (that.stayNum[that.m_regionIndex] > -1)
              ctx.fillText(
                " stay: " + that.stayNum[that.m_regionIndex],
                55,
                15
              );
          }
        } else {
          const np = get_cross_by_ray_x(
            i,
            that.m_polygonAreaX[j],
            that.m_polygonAreaY[j],
            (that.m_polygonAreaX[j][t1] + that.m_polygonAreaX[j][t2]) / 2,
            (that.m_polygonAreaY[j][t1] + that.m_polygonAreaY[j][t2]) / 2,
            get_start_point(t1, t2),
            that.canvasobj.clientWidth
          );
          if ((np % 2 && dy > 0) || (np % 2 == 0 && dy < 0)) {
            ctx.fillText("Region" + (that.m_regionIndex + 1), 5, -8);
            if (that.m_stayAlarm & (1 << that.m_regionIndex))
              ctx.fillStyle = "#f00";
            else ctx.fillStyle = "#0000FE";
            if (that.stayNum[that.m_regionIndex] > -1)
              ctx.fillText(
                " stay: " + that.stayNum[that.m_regionIndex],
                55,
                -8
              );
          } else {
            ctx.fillText("Region" + (that.m_regionIndex + 1), 5, 15);
            if (that.m_stayAlarm & (1 << that.m_regionIndex))
              ctx.fillStyle = "#f00";
            else ctx.fillStyle = "#0000FE";
            if (that.stayNum[that.m_regionIndex] > -1)
              ctx.fillText(
                " stay: " + that.stayNum[that.m_regionIndex],
                55,
                15
              );
          }
        }
      }

      ctx.restore();
    }
  }

  // for (let j = 0; j < that.m_readPolygonAreaX.length; j++) {
  //   ctx.strokeStyle = "#0000FE";
  //   ctx.beginPath();
  //   ctx.moveTo(that.m_readPolygonAreaX[j][0], that.m_readPolygonAreaY[j][0]);
  //   for (let i = 1; i <= that.MAX_SIDES_OF_POLYGON; i++) {
  //     if (that.m_readPolygonAreaX[j][i] == -1) break;
  //     ctx.lineTo(that.m_readPolygonAreaX[j][i], that.m_readPolygonAreaY[j][i]);
  //   }
  //   ctx.lineTo(that.m_readPolygonAreaX[j][0], that.m_readPolygonAreaY[j][0]);
  //   ctx.stroke();
  // }
};
const getPolygonMap = that => {
  let px = "",
    py = "",
    regions = "";
  const xparam = 1024 / that.canvasobj.clientWidth;
  const yparam = 1024 / that.canvasobj.clientHeight;
  for (let i = 0; i < that.MAX_POLYGON_NUM; i++) {
    for (let j = 0; j < that.MAX_SIDES_OF_POLYGON; j++) {
      if (that.m_polygonAreaX[i][j] == -1) {
        px += "-1:";
        py += "-1:";
      } else {
        px += Math.round(that.m_polygonAreaX[i][j] * xparam) + ":";
        py += Math.round(that.m_polygonAreaY[i][j] * yparam) + ":";
      }
    }
    px += ";";
    py += ";";
  }
  regions += px + "," + py;
  return regions;
};
const getPolygonByIndex = that => {
  let px = "",
    py = "",
    regions = "";
  const xparam = 1024 / that.canvasobj.clientWidth;
  const yparam = 1024 / that.canvasobj.clientHeight;
  if (index >= that.MAX_POLYGON_NUM) return "-1";
  for (let j = 0; j < that.MAX_SIDES_OF_POLYGON; j++) {
    if (that.m_polygonAreaX[index][j] == -1) {
      px += "-1:";
      py += "-1:";
    } else {
      px += Math.round(that.m_polygonAreaX[index][j] * xparam) + ":";
      py += Math.round(that.m_polygonAreaY[index][j] * yparam) + ":";
    }
  }
  regions += px + "," + py;
  return regions;
};
const setReadPolygon = (that, pointX, pointY) => {
  // that.m_polygonStrX = pointX;
  // that.m_polygonStrY = pointY;
  // const tx = pointX.split(";");
  // const ty = pointY.split(";");
  // let i = 0;
  // while (i < 1) {
  //   that.m_readPolygonAreaX.push([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
  //   that.m_readPolygonAreaY.push([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
  //   i++;
  // }
  // for (i = 0; i < that.m_readPolygonAreaX.length; i++) {
  //   const px = tx[i].split(":");
  //   const py = ty[i].split(":");
  //   for (let j = 0; j < that.MAX_SIDES_OF_POLYGON; j++) {
  //     if (px[j] == -1) that.m_readPolygonAreaX[i][j] = -1;
  //     else
  //       that.m_readPolygonAreaX[i][j] =
  //         (parseInt(px[j]) * that.canvasobj.clientWidth) / 1024;
  //     if (py[j] == -1) that.m_readPolygonAreaY[i][j] = -1;
  //     else
  //       that.m_readPolygonAreaY[i][j] =
  //         (parseInt(py[j]) * that.canvasobj.clientHeight) / 1024;
  //   }
  // }
};
const setRegionAlarm = (that, str) => {
  const region = str.split(":");
  that.m_regionAlarm = parseInt(region[0]);
  that.m_stayAlarm = parseInt(region[1]);
  for (let i = 0; i < that.m_polygonTextNumber; i++) {
    that.stayNum[i] = parseInt(region[2 + i]);
  }
  if (that.isLiveView == 1) {
    that.m_drawPolygon = 1;
    that.RedrawCanvas();
    that.m_drawPolygon = 0;
  } else that.RedrawCanvas();
};
const setPersonRectRegion = (that, enable, region) => {
  that.m_bPersonRegionShow = enable;
  const pPersonRegion = region.split(":");
  if (
    pPersonRegion.length < 2 ||
    (((pPersonRegion[2] == pPersonRegion[3]) == pPersonRegion[4]) ==
      pPersonRegion[5] &&
      pPersonRegion.length < 7)
  ) {
    that.m_Tails = {};
    that.m_PersonRegions = pPersonRegion;
    const c = document.getElementById("manCanvas");
    c.height = c.height;
    return;
  } else {
    if (document.getElementById("manCanvas") == null) {
      if (document.getElementsByClassName("li0").length) {
        document
          .getElementsByClassName("li0")[0]
          .insertAdjacentHTML(
            "beforeend",
            '<canvas id="manCanvas" class="selCanvas"></canvas>'
          );
      } else if (document.getElementsByClassName("li1").length) {
        document
          .getElementsByClassName("li1")[0]
          .insertAdjacentHTML(
            "beforeend",
            '<canvas id="manCanvas" class="selCanvas"></canvas>'
          );
      }
    }
    if (document.getElementById("selCanvas") && !that.isLiveView) {
      document.getElementById("selCanvas").style.zIndex = 100;
    }
    that.m_PersonRegions = pPersonRegion;
    that.RedrawCanvas("manCanvas");
  }
};
const setPersonRectWithTime = (that, enable, region) => {
  that.m_bPersonRegionShow = enable;
  const pPersonRegion = region.split(";");
  if (pPersonRegion.length == 0) {
    that.m_Tails = {};
    that.m_PersonRegions = pPersonRegion;
    c = document.getElementById("manCanvas");
    c.height = c.height;
    return;
  } else {
    if (document.getElementById("manCanvas") == null) {
      document
        .getElementsByClassName("li0")[0]
        .insertAdjacentHTML(
          "beforeend",
          '<canvas id="manCanvas" class="selCanvas"></canvas>'
        );
    }
    if (document.getElementById("selCanvas") && !that.isLiveView) {
      document.getElementById("selCanvas").style.zIndex = 100;
    }
    that.m_PersonRegions = pPersonRegion;
    that.RedrawCanvas("manCanvas");
    // that.RedrawCanvas(); // 原来开发是因为图层原因需要调用两次，当前版本去掉之后貌似也正常运行，继续留意
  }
};
const setPolygonMap = (that, enable, polygonNum, pointX, pointY) => {
  setPolygonNumber(that, polygonNum);
  setPolygonRegion(that, pointX, pointY);
  setPolygonEditable(that, enable);
  if (!that.isLiveView) {
    document.getElementById("selCanvas").style.cursor =
      "url(/image//pen.png),auto";
  }
};
const setPolygonNumber = (that, polygonNum) => {
  while (that.MAX_POLYGON_NUM < polygonNum) {
    that.m_polygonAreaX.push([-1, -1, -1, -1, -1, -1, -1, -1]);
    that.m_polygonAreaY.push([-1, -1, -1, -1, -1, -1, -1, -1]);
    that.MAX_POLYGON_NUM++;
  }
  that.MAX_POLYGON_NUM = polygonNum;
};
const setPolygonRegion = (that, pointX, pointY) => {
  that.m_polygonStrX = pointX;
  that.m_polygonStrY = pointY;
  const tx = pointX.split(";");
  const ty = pointY.split(";");
  if (that.canvasobj.clientWidth == 0) {
    that.g_Select = 0;
    that.canvasobj = get_first_element(
      document.getElementsByClassName("h5canvas")
    );
  }
  for (let i = 0; i < that.MAX_POLYGON_NUM; i++) {
    const px = tx[i].split(":");
    const py = ty[i].split(":");
    for (let j = 0; j < that.MAX_SIDES_OF_POLYGON; j++) {
      if (px[j] == -1) that.m_polygonAreaX[i][j] = -1;
      else
        that.m_polygonAreaX[i][j] =
          (parseInt(px[j]) * that.canvasobj.clientWidth) / 1024;
      if (py[j] == -1) that.m_polygonAreaY[i][j] = -1;
      else
        that.m_polygonAreaY[i][j] =
          (parseInt(py[j]) * that.canvasobj.clientHeight) / 1024;
    }
  }
  if (that.m_polygonAreaX[0][0] == -1) that.m_ploygonIndex = 0;
  that.m_polygonalarm = 0;
};
const setPolygonEditable = (that, editable) => {
  that.m_drawPolygon = editable;
  // 如果editable，则绑定事件
  if (editable) {
    if (document.getElementById("selCanvas") == null) {
      if (document.getElementsByClassName("li0").length)
        document
          .getElementsByClassName("li0")[0]
          .insertAdjacentHTML(
            "beforeend",
            '<canvas id="selCanvas" class="selCanvas"></canvas>'
          );
      else if (document.getElementsByClassName("li1").length)
        document
          .getElementsByClassName("li1")[0]
          .insertAdjacentHTML(
            "beforeend",
            '<canvas id="selCanvas" class="selCanvas"></canvas>'
          );
    }
    // bindEvent(that);
    if (document.getElementById("selCanvas")) that.RedrawCanvas();
  }
  if (that.isLiveView == 1) that.m_drawPolygon = 0;
};
const clearPolygonMap = that => {
  for (let i = 0; i < that.MAX_SIDES_OF_POLYGON; i++) {
    that.m_polygonAreaX[0][i] = -1;
    that.m_polygonAreaY[0][i] = -1;
  }
  that.m_ploygonIndex = 0;
  that.RedrawCanvas();
};
export default {
  mouseDown,
  mouseMoveDrag,
  mouseMoveNoDrag,
  contextMenu,
  removeEvent,
  redrawCanvas,
  getPolygonMap,
  getPolygonByIndex,
  setReadPolygon,
  setRegionAlarm,
  setPersonRectRegion,
  setPersonRectWithTime,
  setPolygonMap,
  setPolygonEditable
};
