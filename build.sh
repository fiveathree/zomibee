#!/bin/sh
# 將 src/ 入面嘅檔案按次序砌成單一 index.html（遊戲本體）
# 用法：sh build.sh
set -e
cd "$(dirname "$0")"
S=src
JS="2_data.js 2b_more.js 2d_water.js 3_engine.js 4_events.js 4b_events.js 5_ui.js 6_fig.js 6b_cast.js 7_gear.js 7b_more.js 8_ach.js 8b_layout.js 8c_outpost.js 9a_char.js 9b_crew.js 9c_reveal.js 9d_net.js 9e_newgame.js 9_boot.js "
{
  echo '<!doctype html>'
  echo '<html lang="zh-Hant">'
  echo '<head>'
  echo '<meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
  sed -n '1,/<\/style>/p' $S/1_head.html
  echo '</head>'
  echo '<body>'
  sed -n '/<\/style>/,$p' $S/1_head.html | tail -n +2
  echo '<script>'
  for f in $JS; do cat "$S/$f"; done
  echo '</script>'
  echo '</body>'
  echo '</html>'
} > index.html
echo "built index.html ($(wc -c < index.html) bytes)"
