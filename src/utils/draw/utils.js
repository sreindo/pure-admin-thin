function pnpoly(npol, xp, yp, x, y) {
  let i,
    j,
    c = 0;
  for (i = 0, j = npol - 1; i < npol; j = i++) {
    if (
      ((yp[i] <= y && y < yp[j]) || (yp[j] <= y && y < yp[i])) &&
      x < ((xp[j] - xp[i]) * (y - yp[i])) / (yp[j] - yp[i]) + xp[i]
    )
      c = !c;
  }
  return c;
}

function intersection(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
  if (
    (ax1 > ax2 ? ax1 : ax2) < (bx1 < bx2 ? bx1 : bx2) ||
    (ay1 > ay2 ? ay1 : ay2) < (by1 < by2 ? by1 : by2) ||
    (bx1 > bx2 ? bx1 : bx2) < (ax1 < ax2 ? ax1 : ax2) ||
    (by1 > by2 ? by1 : by2) < (ay1 < ay2 ? ay1 : ay2)
  ) {
    return false;
  }

  if (
    ((ax1 - bx1) * (by2 - by1) - (ay1 - by1) * (bx2 - bx1)) *
      ((ax2 - bx1) * (by2 - by1) - (ay2 - by1) * (bx2 - bx1)) >
      0 ||
    ((bx1 - ax1) * (ay2 - ay1) - (by1 - ay1) * (ax2 - ax1)) *
      ((bx2 - ax1) * (ay2 - ay1) - (by2 - ay1) * (ax2 - ax1)) >
      0
  ) {
    return false;
  }
  return true;
}

function mod_oper(val, num) {
  return (val + num) % num;
}

function get_cross_by_ray_x(n, xp, yp, x, y, s, w) {
  let p = 0;
  for (let i = 0; i < n; i++) {
    if (i == s) continue;
    if (
      intersection(
        xp[i],
        yp[i],
        xp[mod_oper(i + 1, n)],
        yp[mod_oper(i + 1, n)],
        x,
        y,
        w,
        y
      )
    )
      p++;
  }
  return p;
}

function get_cross_by_ray_y(n, xp, yp, x, y, s) {
  let p = 0;
  for (let i = 0; i < n; i++) {
    if (i == s) continue;
    if (
      intersection(
        xp[i],
        yp[i],
        xp[mod_oper(i + 1, n)],
        yp[mod_oper(i + 1, n)],
        x,
        y,
        x,
        0
      )
    )
      p++;
  }
  return p;
}

function get_start_point(t1, t2) {
  if (Math.abs(t1 - t2) == 1) return Math.min(t1, t2);
  else return t1 == 0 ? t2 : t1;
}

function get_first_element(obj) {
  if (obj.length) {
    return obj[0];
  }
  return obj;
}

export {
  pnpoly,
  intersection,
  mod_oper,
  get_cross_by_ray_x,
  get_cross_by_ray_y,
  get_start_point,
  get_first_element
};
