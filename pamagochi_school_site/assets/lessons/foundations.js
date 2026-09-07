'use strict';
window.mountFoundations=function(document,onProgress){
document.innerHTML=`<section class="task" id="t1">
    <h2><span class="tasknum">1</span>Найди все предметы той же формы</h2>
    <p>Перед тобой образец. Выбери <b>все</b> предметы такой же формы, но другого цвета.</p>
    <div class="story">
      <div class="visual-card">
        <div class="sample-big">🍅</div>
        <div class="sample-props">
          <span class="prop">круглая форма</span>
          <span class="prop">красный цвет</span>
          <span class="prop">без углов</span>
        </div>
      </div>
      <div class="options" data-multi="t1">
        <button class="choice" data-id="ball"><span class="emoji">⚽</span><span class="caption">мяч</span></button>
        <button class="choice" data-id="book"><span class="emoji">📘</span><span class="caption">книга</span></button>
        <button class="choice" data-id="apple"><span class="emoji">🍏</span><span class="caption">яблоко</span></button>
        <button class="choice" data-id="flag"><span class="emoji">🚩</span><span class="caption">флажок</span></button>
      </div>
    </div>
    <div class="actions"><button class="primary" data-action="check1()">Проверить</button><button class="hintbtn" data-action="hint('h1')">Подсказка</button></div>
    <div id="h1" class="hint">Смотри не на назначение предмета, а на форму: помидор круглый. Правильных ответов больше одного.</div>
    <div class="feedback" id="f1"></div>
  </section>
<section class="task" id="t2">
    <h2><span class="tasknum">2</span>Разложи предметы по форме</h2>
    <p>Перетащи предметы в нужные домики. Если неудобно, можно сначала нажать на предмет, а потом на нужный домик.</p>
    <div class="sort-layout">
      <div class="tray"><strong>Предметы</strong><div class="items" id="sortItems1">
        <div class="drag" draggable="true" data-kind="circle" data-home="sortItems1"><div class="emoji">⚽</div><div>мяч</div></div>
        <div class="drag" draggable="true" data-kind="square" data-home="sortItems1"><div class="emoji">🎁</div><div>подарок</div></div>
        <div class="drag" draggable="true" data-kind="triangle" data-home="sortItems1"><div class="emoji">🚩</div><div>флажок</div></div>
        <div class="drag" draggable="true" data-kind="rect" data-home="sortItems1"><div class="emoji">📘</div><div>книга</div></div>
      </div></div>
      <div class="dropzones">
        <div class="zone" data-kind="circle"><h3>Круглые</h3></div>
        <div class="zone" data-kind="square"><h3>Квадратные</h3></div>
        <div class="zone" data-kind="triangle"><h3>Треугольные</h3></div>
        <div class="zone" data-kind="rect"><h3>Прямоугольные</h3></div>
      </div>
    </div>
    <div class="actions"><button class="primary" data-action="check2()">Проверить</button><button class="hintbtn" data-action="hint('h2')">Подсказка</button></div>
    <div id="h2" class="hint">У подарка все стороны почти одинаковые — он похож на квадрат. Книга длиннее, чем шире — она похожа на прямоугольник.</div>
    <div class="feedback" id="f2"></div>
  </section>
<section class="task" id="t3">
    <h2><span class="tasknum">3</span>Соедини объёмную фигуру и предмет</h2>
    <p>Выбери для каждой объёмной фигуры предмет такой же формы.</p>
    <div class="formline">
      <div class="field"><label>Шар</label><select id="m3a"><option value="">Выбери...</option><option value="gift">подарок</option><option value="ball">мяч</option><option value="can">банка</option><option value="hat">колпак</option></select></div>
      <div class="field"><label>Куб</label><select id="m3b"><option value="">Выбери...</option><option value="gift">подарок</option><option value="ball">мяч</option><option value="can">банка</option><option value="hat">колпак</option></select></div>
      <div class="field"><label>Цилиндр</label><select id="m3c"><option value="">Выбери...</option><option value="gift">подарок</option><option value="ball">мяч</option><option value="can">банка</option><option value="hat">колпак</option></select></div>
      <div class="field"><label>Конус</label><select id="m3d"><option value="">Выбери...</option><option value="gift">подарок</option><option value="ball">мяч</option><option value="can">банка</option><option value="hat">колпак</option></select></div>
    </div>
    <div class="small">Подсказка для взрослого: здесь ребёнок связывает пространственные фигуры с предметами.</div>
    <div class="actions"><button class="primary" data-action="check3()">Проверить</button><button class="hintbtn" data-action="hint('h3')">Подсказка</button></div>
    <div id="h3" class="hint">Подумай так: мяч можно катить как шар, банка стоит на круглом основании как цилиндр.</div>
    <div class="feedback" id="f3"></div>
  </section>
<section class="task" id="t4">
    <h2><span class="tasknum">4</span>Двойная закономерность</h2>
    <p>В ряду одновременно меняются и <b>цвет</b>, и <b>форма</b>. Выбери пару, которая должна стоять дальше.</p>
    <div class="sequence">
      <div class="token"><i class="shape circle red"></i></div>
      <div class="token"><i class="shape square blue"></i></div>
      <div class="token"><i class="shape triangle red"></i></div>
      <div class="token"><i class="shape circle blue"></i></div>
      <div class="token"><i class="shape square red"></i></div>
      <div class="token"><i class="shape triangle blue"></i></div>
      <div class="token q">?</div><div class="token q">?</div>
    </div>
    <div class="answer-row" data-single="t4">
      <button class="mini-choice" data-id="A"><i class="shape circle red"></i><i class="shape square blue"></i></button>
      <button class="mini-choice" data-id="B"><i class="shape circle blue"></i><i class="shape square red"></i></button>
      <button class="mini-choice" data-id="C"><i class="shape triangle red"></i><i class="shape circle blue"></i></button>
    </div>
    <div class="actions"><button class="primary" data-action="check4()">Проверить</button><button class="hintbtn" data-action="hint('h4')">Подсказка</button></div>
    <div id="h4" class="hint">Формы идут так: круг, квадрат, треугольник. Цвета идут так: красный, синий, красный, синий...</div>
    <div class="feedback" id="f4"></div>
  </section>
<section class="task" id="t5">
    <h2><span class="tasknum">5</span>Логическая таблица</h2>
    <p>В каждой строке свой цвет, а в каждом столбце — свой порядок фигур. Что должно стоять в пустой клетке?</p>
    <div class="matrix-wrap">
      <div class="matrix">
        <div class="cell"><i class="shape circle red"></i></div>
        <div class="cell"><i class="shape square red"></i></div>
        <div class="cell"><i class="shape triangle red"></i></div>
        <div class="cell"><i class="shape triangle green"></i></div>
        <div class="cell"><i class="shape circle green"></i></div>
        <div class="cell"><i class="shape square green"></i></div>
        <div class="cell"><i class="shape square blue"></i></div>
        <div class="cell"><i class="shape triangle blue"></i></div>
        <div class="cell missing">?</div>
      </div>
      <div>
        <div class="answer-row" data-single="t5">
          <button class="mini-choice" data-id="bluecircle"><i class="shape circle blue"></i></button>
          <button class="mini-choice" data-id="greensquare"><i class="shape square green"></i></button>
          <button class="mini-choice" data-id="bluetriangle"><i class="shape triangle blue"></i></button>
          <button class="mini-choice" data-id="redsquare"><i class="shape square red"></i></button>
        </div>
        <div class="small">Сначала найди, какой цвет нужен, потом — какая фигура.</div>
      </div>
    </div>
    <div class="actions"><button class="primary" data-action="check5()">Проверить</button><button class="hintbtn" data-action="hint('h5')">Подсказка</button></div>
    <div id="h5" class="hint">В нижней строке уже есть квадрат и треугольник, значит, не хватает круга. Цвет нижней строки — синий.</div>
    <div class="feedback" id="f5"></div>
  </section>
<section class="task" id="t6">
    <h2><span class="tasknum">6</span>Бусины: посчитай и сравни</h2>
    <p>Сосчитай бусины каждого цвета, а потом выбери знак между количеством красных и зелёных.</p>
    <div class="beads"><i class="bead red"></i><i class="bead green"></i><i class="bead red"></i><i class="bead yellow"></i><i class="bead green"></i><i class="bead red"></i><i class="bead blue"></i><i class="bead green"></i><i class="bead yellow"></i><i class="bead red"></i><i class="bead green"></i><i class="bead red"></i><i class="bead yellow"></i><i class="bead green"></i></div>
    <div class="count-grid">
      <label class="countbox">🔴 красных<br><input id="redCount" inputmode="numeric" maxlength="2"></label>
      <label class="countbox">🟢 зелёных<br><input id="greenCount" inputmode="numeric" maxlength="2"></label>
      <label class="countbox">🟡 жёлтых<br><input id="yellowCount" inputmode="numeric" maxlength="2"></label>
    </div>
    <div class="compare"><b>красных</b><button class="sym" data-group="cmp6" data-sym="<">&lt;</button><button class="sym" data-group="cmp6" data-sym="=">=</button><button class="sym" data-group="cmp6" data-sym=">">&gt;</button><b>зелёных</b></div>
    <div class="actions"><button class="primary" data-action="check6()">Проверить</button><button class="hintbtn" data-action="hint('h6')">Подсказка</button></div>
    <div id="h6" class="hint">Считать удобно по цветам: сначала все красные, потом все зелёные, затем все жёлтые.</div>
    <div class="feedback" id="f6"></div>
  </section>
<section class="task" id="t7">
    <h2><span class="tasknum">7</span>Сколько углов?</h2>
    <p>Напиши, сколько углов у каждой фигуры. Потом подумай: у каких двух фигур одинаковый ответ?</p>
    <div class="angle-grid">
      <label class="angle-card"><i class="shape circle yellow"></i><br>круг<br><input id="a0" inputmode="numeric"></label>
      <label class="angle-card"><i class="shape triangle blue"></i><br>треугольник<br><input id="a3" inputmode="numeric"></label>
      <label class="angle-card"><i class="shape square green"></i><br>квадрат<br><input id="a4s" inputmode="numeric"></label>
      <label class="angle-card"><i class="shape rect red"></i><br>прямоугольник<br><input id="a4r" inputmode="numeric"></label>
      <label class="angle-card"><i class="shape pentagon purple"></i><br>пятиугольник<br><input id="a5" inputmode="numeric"></label>
    </div>
    <div class="actions"><button class="primary" data-action="check7()">Проверить</button><button class="hintbtn" data-action="hint('h7')">Подсказка</button></div>
    <div id="h7" class="hint">У круга нет углов. У квадрата и прямоугольника ответ одинаковый.</div>
    <div class="feedback" id="f7"></div>
  </section>
<section class="task" id="t8">
    <h2><span class="tasknum">8</span>Математический код</h2>
    <p>Число показывает важное свойство фигуры. Разгадай правило и запиши недостающие числа.</p>
    <div class="code-row"><div class="code">⚪ круг → 0</div><div class="code">🔺 треугольник → 3</div><div class="code">🟩 квадрат → 4</div></div>
    <div class="options">
      <label class="choice"><span class="emoji">▭</span><span class="caption">прямоугольник →</span><br><input id="codeRect" inputmode="numeric" style="width:70px;text-align:center;font-size:1.35rem;margin-top:8px"></label>
      <label class="choice"><span class="emoji">⬟</span><span class="caption">пятиугольник →</span><br><input id="codePent" inputmode="numeric" style="width:70px;text-align:center;font-size:1.35rem;margin-top:8px"></label>
    </div>
    <div class="actions"><button class="primary" data-action="check8()">Проверить</button><button class="hintbtn" data-action="hint('h8')">Подсказка</button></div>
    <div id="h8" class="hint">Подумай, что значат числа 0, 3 и 4 для круга, треугольника и квадрата.</div>
    <div class="feedback" id="f8"></div>
  </section>
<section class="task" id="t9">
    <h2><span class="tasknum">9</span>Детектив: строки и столбцы</h2>
    <p>Рассмотри таблицу. У предметов в каждой строке есть общий признак, и у предметов в каждом столбце тоже есть общий признак. Ответь на три вопроса.</p>
    <div class="table-grid">
      <div class="item-card r1"><span class="icon">🥣</span>миска</div>
      <div class="item-card r1"><span class="icon">🍅</span>помидор</div>
      <div class="item-card r1"><span class="icon">🩳</span>шорты</div>
      <div class="item-card r1"><span class="icon">🔴</span>мяч</div>
      <div class="item-card r2"><span class="icon">🫖</span>чайник</div>
      <div class="item-card r2"><span class="icon">🥒</span>огурец</div>
      <div class="item-card r2"><span class="icon">🧢</span>шапка</div>
      <div class="item-card r2"><span class="icon">🪆</span>матрёшка</div>
      <div class="item-card r3"><span class="icon">🍲</span>кастрюля</div>
      <div class="item-card r3"><span class="icon">🥕</span>овощ</div>
      <div class="item-card r3"><span class="icon">👗</span>платье</div>
      <div class="item-card r3"><span class="icon">🧸</span>игрушка</div>
    </div>
    <div class="formline">
      <div class="field"><label>1) Что общего у строк?</label><select id="t9q1"><option value="">Выбери...</option><option value="color">цвет</option><option value="size">размер</option><option value="use">назначение</option></select></div>
      <div class="field"><label>2) Что общего у столбцов?</label><select id="t9q2"><option value="">Выбери...</option><option value="color">цвет</option><option value="material">материал</option><option value="use">группа предметов / назначение</option></select></div>
      <div class="field"><label>3) Что стоит во 2-й строке и 4-м столбце?</label><select id="t9q3"><option value="">Выбери...</option><option value="matr">матрёшка</option><option value="hat">шапка</option><option value="teapot">чайник</option><option value="toy">игрушка</option></select></div>
    </div>
    <div class="actions"><button class="primary" data-action="check9()">Проверить</button><button class="hintbtn" data-action="hint('h9')">Подсказка</button></div>
    <div id="h9" class="hint">По строкам меняется цвет, а по столбцам — тип предметов: посуда, овощи, одежда, игрушки.</div>
    <div class="feedback" id="f9"></div>
  </section>
<section class="task" id="t10">
    <h2><span class="tasknum">10</span>Круги: считай внимательно</h2>
    <p>Посчитай, сколько здесь кругов каждого цвета, сколько больших и маленьких, и сколько всего.</p>
    <div class="circles-row">
      <i class="dot small bluebg"></i>
      <i class="dot big redbg"></i><i class="dot big redbg"></i>
      <i class="dot small greenbg"></i><i class="dot small greenbg"></i><i class="dot small greenbg"></i>
      <i class="dot big yellowbg"></i><i class="dot big yellowbg"></i><i class="dot big yellowbg"></i><i class="dot big yellowbg"></i>
      <i class="dot small brownbg"></i><i class="dot small brownbg"></i><i class="dot small brownbg"></i><i class="dot small brownbg"></i><i class="dot small brownbg"></i>
    </div>
    <div class="formline">
      <div class="field"><label>Красных</label><input id="t10red" inputmode="numeric"></div>
      <div class="field"><label>Жёлтых</label><input id="t10yellow" inputmode="numeric"></div>
      <div class="field"><label>Больших</label><input id="t10big" inputmode="numeric"></div>
      <div class="field"><label>Маленьких</label><input id="t10small" inputmode="numeric"></div>
      <div class="field"><label>Всего</label><input id="t10all" inputmode="numeric"></div>
    </div>
    <div class="small" style="text-align:center;margin-top:12px"><b>И ещё:</b> сравни количество больших и маленьких кругов и выбери знак.</div><div class="compare"><b>больших</b><button class="sym" data-group="cmp10" data-sym="<">&lt;</button><button class="sym" data-group="cmp10" data-sym="=">=</button><button class="sym" data-group="cmp10" data-sym=">">&gt;</button><b>маленьких</b></div>
    <div class="actions"><button class="primary" data-action="check10()">Проверить</button><button class="hintbtn" data-action="hint('h10')">Подсказка</button></div>
    <div id="h10" class="hint">Сначала сосчитай круги по цветам, потом отдельно большие и маленькие. Проверяй себя: все ответы вместе должны «сходиться».</div>
    <div class="feedback" id="f10"></div>
  </section>
<section class="task" id="t11">
    <h2><span class="tasknum">11</span>Свойства предметов: выбери подходящие</h2>
    <p>На каждой карточке-вопросе выбери <b>все</b> подходящие предметы.</p>
    <div class="statement-wrap">
      <div class="question-area">
        <h4>Какие предметы прозрачные?</h4>
        <div class="item-grid" data-multi="q11a">
          <button class="thing" data-id="glass"><div class="emoji">🥛</div>стакан</button>
          <button class="thing" data-id="ball"><div class="emoji">⚽</div>мяч</button>
          <button class="thing" data-id="globe"><div class="emoji">🌍</div>глобус</button>
          <button class="thing" data-id="tank"><div class="emoji">🐟</div>аквариум</button>
          <button class="thing" data-id="box"><div class="emoji">📦</div>коробка</button>
        </div>
      </div>
      <div class="question-area">
        <h4>Какие предметы круглой формы?</h4>
        <div class="item-grid" data-multi="q11b">
          <button class="thing" data-id="glass"><div class="emoji">🥛</div>стакан</button>
          <button class="thing" data-id="ball"><div class="emoji">⚽</div>мяч</button>
          <button class="thing" data-id="globe"><div class="emoji">🌍</div>глобус</button>
          <button class="thing" data-id="tank"><div class="emoji">🐟</div>аквариум</button>
          <button class="thing" data-id="box"><div class="emoji">📦</div>коробка</button>
        </div>
      </div>
      <div class="question-area">
        <h4>Какие предметы похожи на коробку?</h4>
        <div class="item-grid" data-multi="q11c">
          <button class="thing" data-id="glass"><div class="emoji">🥛</div>стакан</button>
          <button class="thing" data-id="ball"><div class="emoji">⚽</div>мяч</button>
          <button class="thing" data-id="globe"><div class="emoji">🌍</div>глобус</button>
          <button class="thing" data-id="tank"><div class="emoji">🐟</div>аквариум</button>
          <button class="thing" data-id="box"><div class="emoji">📦</div>коробка</button>
        </div>
      </div>
    </div>
    <div class="actions"><button class="primary" data-action="check11()">Проверить</button><button class="hintbtn" data-action="hint('h11')">Подсказка</button></div>
    <div id="h11" class="hint">Подумай отдельно про материал, форму и устройство предмета. Прозрачный — значит сквозь него можно видеть.</div>
    <div class="feedback" id="f11"></div>
  </section>
<section class="task" id="t12">
    <h2><span class="tasknum">12</span>Плоские и объёмные фигуры</h2>
    <p>Разложи фигуры на две группы: плоские и объёмные.</p>
    <div class="sort-layout">
      <div class="tray"><strong>Фигуры</strong><div class="items" id="sortItems2">
        <div class="drag" draggable="true" data-kind="flat" data-home="sortItems2"><i class="shape circle green"></i><div>круг</div></div>
        <div class="drag" draggable="true" data-kind="flat" data-home="sortItems2"><i class="shape square blue"></i><div>квадрат</div></div>
        <div class="drag" draggable="true" data-kind="flat" data-home="sortItems2"><i class="shape triangle yellow"></i><div>треугольник</div></div>
        <div class="drag" draggable="true" data-kind="flat" data-home="sortItems2"><i class="shape rect red"></i><div>прямоугольник</div></div>
        <div class="drag" draggable="true" data-kind="flat" data-home="sortItems2"><i class="shape oval purple"></i><div>овал</div></div>
        <div class="drag" draggable="true" data-kind="solid" data-home="sortItems2"><div class="emoji">⚽</div><div>шар</div></div>
        <div class="drag" draggable="true" data-kind="solid" data-home="sortItems2"><div class="emoji">🧊</div><div>куб</div></div>
        <div class="drag" draggable="true" data-kind="solid" data-home="sortItems2"><div class="emoji">🥫</div><div>цилиндр</div></div>
        <div class="drag" draggable="true" data-kind="solid" data-home="sortItems2"><div class="emoji">🎉</div><div>конус</div></div>
        <div class="drag" draggable="true" data-kind="solid" data-home="sortItems2"><div class="emoji">🔺</div><div>пирамида</div></div>
      </div></div>
      <div class="dropzones two">
        <div class="zone" data-kind="flat"><h3>Плоские фигуры</h3></div>
        <div class="zone" data-kind="solid"><h3>Объёмные фигуры</h3></div>
      </div>
    </div>
    <div class="actions"><button class="primary" data-action="check12()">Проверить</button><button class="hintbtn" data-action="hint('h12')">Подсказка</button></div>
    <div id="h12" class="hint">Плоскую фигуру можно нарисовать на листе, а объёмную можно представить как тело, у которого есть глубина.</div>
    <div class="feedback" id="f12"></div>
  </section>
<section class="task" id="t13">
    <h2><span class="tasknum">13</span>Сосчитай фигуры в группах</h2>
    <p>Посчитай, сколько фигур в каждой группе, и скажи, какая группа самая большая.</p>
    <div class="table-grid counting-grid">
      <div class="visual-card"><div class="row">
        <i class="shape circle yellow" style="transform:scale(.55)"></i><i class="shape circle blue" style="transform:scale(.38)"></i><i class="shape circle red" style="transform:scale(.45)"></i><i class="shape circle green" style="transform:scale(.68)"></i>
      </div><div class="row"><i class="shape circle red" style="transform:scale(.32)"></i><i class="shape circle green" style="transform:scale(.35)"></i><i class="shape circle purple" style="transform:scale(.56)"></i><i class="shape circle blue" style="transform:scale(.33)"></i></div><div class="caption">Круги</div></div>
      <div class="visual-card"><div class="row">
        <i class="shape triangle yellow" style="transform:scale(.48)"></i><i class="shape triangle green" style="transform:scale(.33)"></i><i class="shape triangle red" style="transform:scale(.30)"></i>
      </div><div class="row"><i class="shape triangle blue" style="transform:scale(.36)"></i><i class="shape triangle green" style="transform:scale(.28)"></i><i class="shape triangle red" style="transform:scale(.52)"></i></div><div class="caption">Треугольники</div></div>
      <div class="visual-card"><div class="row"><i class="shape square yellow" style="transform:scale(.45)"></i><i class="shape square green" style="transform:scale(.52)"></i></div><div class="row"><i class="shape square blue" style="transform:scale(.32)"></i><i class="shape square yellow" style="transform:scale(.28)"></i><i class="shape square red" style="transform:scale(.42)"></i></div><div class="caption">Квадраты</div></div>
      <div class="visual-card"><div class="row"><i class="shape rect green" style="transform:scale(.48)"></i><i class="shape rect yellow" style="transform:scale(.30)"></i></div><div class="row"><i class="shape rect red" style="transform:scale(.28)"></i><i class="shape rect blue" style="transform:scale(.44)"></i><i class="shape rect green" style="transform:scale(.20)"></i></div><div class="caption">Прямоугольники</div></div>
    </div>
    <div class="formline">
      <div class="field"><label>Кругов</label><input id="t13c" inputmode="numeric"></div>
      <div class="field"><label>Треугольников</label><input id="t13t" inputmode="numeric"></div>
      <div class="field"><label>Квадратов</label><input id="t13s" inputmode="numeric"></div>
      <div class="field"><label>Прямоугольников</label><input id="t13r" inputmode="numeric"></div>
      <div class="field"><label>Больше всего</label><select id="t13most"><option value="">Выбери...</option><option value="circles">круги</option><option value="triangles">треугольники</option><option value="squares">квадраты</option><option value="rectangles">прямоугольники</option></select></div>
    </div>
    <div class="actions"><button class="primary" data-action="check13()">Проверить</button><button class="hintbtn" data-action="hint('h13')">Подсказка</button></div>
    <div id="h13" class="hint">Считай каждую группу отдельно, слева направо и сверху вниз, чтобы не пропустить ни одной фигуры.</div>
    <div class="feedback" id="f13"></div>
  </section>
<section class="task" id="t14">
    <h2><span class="tasknum">14</span>Найди пары</h2>
    <p>В первом окошке предметы соединяются по цвету, а во втором — по форме. Выбери правильные пары.</p>
    <div class="pair-panels">
      <div class="panel">
        <h3 style="margin-top:0;color:#24587f">Пары по цвету</h3>
        <div class="pair-row"><div class="leftItem">🍋 лимон</div><select id="p14a"><option value="">Выбери пару...</option><option value="mitten">варежка</option><option value="frog">лягушка</option><option value="chick">цыплёнок</option><option value="berry">клубника</option></select></div>
        <div class="pair-row"><div class="leftItem">🔔 синий цветок</div><select id="p14b"><option value="">Выбери пару...</option><option value="mitten">варежка</option><option value="frog">лягушка</option><option value="chick">цыплёнок</option><option value="berry">клубника</option></select></div>
        <div class="pair-row"><div class="leftItem">🍃 зелёный лист</div><select id="p14c"><option value="">Выбери пару...</option><option value="mitten">варежка</option><option value="frog">лягушка</option><option value="chick">цыплёнок</option><option value="berry">клубника</option></select></div>
        <div class="pair-row"><div class="leftItem">🍅 помидор</div><select id="p14d"><option value="">Выбери пару...</option><option value="mitten">варежка</option><option value="frog">лягушка</option><option value="chick">цыплёнок</option><option value="berry">клубника</option></select></div>
      </div>
      <div class="panel">
        <h3 style="margin-top:0;color:#24587f">Пары по форме</h3>
        <div class="pair-row"><div class="leftItem">🟨 квадрат</div><select id="p14e"><option value="">Выбери пару...</option><option value="redtri">красный треугольник</option><option value="bluesq">синий квадрат</option><option value="yellowcir">жёлтый круг</option><option value="greenrect">зелёный прямоугольник</option></select></div>
        <div class="pair-row"><div class="leftItem">🟢 круг</div><select id="p14f"><option value="">Выбери пару...</option><option value="redtri">красный треугольник</option><option value="bluesq">синий квадрат</option><option value="yellowcir">жёлтый круг</option><option value="greenrect">зелёный прямоугольник</option></select></div>
        <div class="pair-row"><div class="leftItem">🟥 прямоугольник</div><select id="p14g"><option value="">Выбери пару...</option><option value="redtri">красный треугольник</option><option value="bluesq">синий квадрат</option><option value="yellowcir">жёлтый круг</option><option value="greenrect">зелёный прямоугольник</option></select></div>
        <div class="pair-row"><div class="leftItem">🔺 треугольник</div><select id="p14h"><option value="">Выбери пару...</option><option value="redtri">красный треугольник</option><option value="bluesq">синий квадрат</option><option value="yellowcir">жёлтый круг</option><option value="greenrect">зелёный прямоугольник</option></select></div>
      </div>
    </div>
    <div class="actions"><button class="primary" data-action="check14()">Проверить</button><button class="hintbtn" data-action="hint('h14')">Подсказка</button></div>
    <div id="h14" class="hint">В левой части цвет важнее формы, а в правой — форма важнее цвета.</div>
    <div class="feedback" id="f14"></div>
  </section>
<section class="task" id="t15">
    <h2><span class="tasknum">15</span>Где нарушено правило?</h2>
    <p>Бусины должны чередоваться: синяя, жёлтая, синяя, жёлтая... Нажми на ошибочную бусину, укажи, какой цвет должен быть на её месте, а потом выбери две следующие бусины.</p>
    <div class="break-row" id="breakRow">
      <button class="breakBead bluebg" data-index="1"></button>
      <button class="breakBead yellowbg" data-index="2"></button>
      <button class="breakBead bluebg" data-index="3"></button>
      <button class="breakBead yellowbg" data-index="4"></button>
      <button class="breakBead bluebg" data-index="5"></button>
      <button class="breakBead yellowbg" data-index="6"></button>
      <button class="breakBead bluebg" data-index="7"></button>
      <button class="breakBead yellowbg" data-index="8"></button>
      <button class="breakBead yellowbg" data-index="9"></button>
      <button class="breakBead bluebg" data-index="10"></button>
    </div>
    <div class="small" style="margin-top:12px"><b>1.</b> Какой цвет должен быть у ошибочной бусины?</div>
    <div class="answer-row" data-single="t15replace">
      <button class="mini-choice" data-id="blue"><span class="bead blue"></span><br><b>синяя</b></button>
      <button class="mini-choice" data-id="yellow"><span class="bead yellow"></span><br><b>жёлтая</b></button>
    </div>
    <div class="small" style="margin-top:12px"><b>2.</b> После исправленной 9-й синей бусины какие две должны стоять дальше?</div>
    <div class="answer-row" data-single="t15a">
      <button class="mini-choice" data-id="yb"><span class="bead yellow"></span><span class="bead blue"></span><br><b>жёлтая, синяя</b></button>
      <button class="mini-choice" data-id="yy"><span class="bead yellow"></span><span class="bead yellow"></span><br><b>жёлтая, жёлтая</b></button>
      <button class="mini-choice" data-id="bb"><span class="bead blue"></span><span class="bead blue"></span><br><b>синяя, синяя</b></button>
    </div>
    <div class="actions"><button class="primary" data-action="check15()">Проверить</button><button class="hintbtn" data-action="hint('h15')">Подсказка</button></div>
    <div id="h15" class="hint">Сначала найди место, где рядом оказались две бусины одного цвета. Затем продолжи чередование.</div>
    <div class="feedback" id="f15"></div>
  </section>
<section class="task" id="t16">
    <h2><span class="tasknum">16</span>Какого флажка не хватает?</h2>
    <p>В каждом квадрате спрятано правило. Слева меняется <b>цвет</b>, справа — <b>форма флажка</b>. Выбери недостающий флажок в каждом квадрате.</p>
    <div class="flag-grid">
      <div class="flag-box">
        <h3 style="margin:0 0 8px;text-align:center;color:#24587f">По цвету</h3>
        <div class="flag-matrix">
          <div class="flag-cell"><div class="flagIcon" style="--fc:#4169e1"><span class="pole"></span><span class="cloth rect"></span></div></div>
          <div class="flag-cell"><div class="flagIcon" style="--fc:#ef4b43"><span class="pole"></span><span class="cloth rect"></span></div></div>
          <div class="flag-cell"><div class="flagIcon" style="--fc:#ffd63c"><span class="pole"></span><span class="cloth rect"></span></div></div>
          <div class="flag-cell"><div class="flagIcon" style="--fc:#ffd63c"><span class="pole"></span><span class="cloth rect"></span></div></div>
          <div class="flag-cell"><div class="flagIcon" style="--fc:#4169e1"><span class="pole"></span><span class="cloth rect"></span></div></div>
          <div class="flag-cell"><div class="flagIcon" style="--fc:#ef4b43"><span class="pole"></span><span class="cloth rect"></span></div></div>
          <div class="flag-cell"><div class="flagIcon" style="--fc:#ef4b43"><span class="pole"></span><span class="cloth rect"></span></div></div>
          <div class="flag-cell"><div class="flagIcon" style="--fc:#ffd63c"><span class="pole"></span><span class="cloth rect"></span></div></div>
          <div class="flag-cell missing">?</div>
        </div>
        <div class="flag-options" data-single="t16left">
          <button class="flagOpt" data-id="blue"><div class="flagIcon" style="--fc:#4169e1"><span class="pole"></span><span class="cloth rect"></span></div></button>
          <button class="flagOpt" data-id="red"><div class="flagIcon" style="--fc:#ef4b43"><span class="pole"></span><span class="cloth rect"></span></div></button>
          <button class="flagOpt" data-id="yellow"><div class="flagIcon" style="--fc:#ffd63c"><span class="pole"></span><span class="cloth rect"></span></div></button>
        </div>
      </div>
      <div class="flag-box">
        <h3 style="margin:0 0 8px;text-align:center;color:#24587f">По форме</h3><div class="small" style="text-align:center;margin-bottom:8px">Смотри на контур флажка, а не на цвет.</div>
        <div class="flag-matrix">
          <div class="flag-cell"><div class="flagIcon" style="--fc:#e7edf2"><span class="pole"></span><span class="cloth tri" style="border-left-color:#e7edf2"></span></div></div>
          <div class="flag-cell"><div class="flagIcon" style="--fc:#e7edf2"><span class="pole"></span><span class="cloth rect"></span></div></div>
          <div class="flag-cell"><div class="flagIcon" style="--fc:#e7edf2"><span class="pole"></span><span class="cloth notch"></span></div></div>
          <div class="flag-cell"><div class="flagIcon" style="--fc:#e7edf2"><span class="pole"></span><span class="cloth notch"></span></div></div>
          <div class="flag-cell"><div class="flagIcon" style="--fc:#e7edf2"><span class="pole"></span><span class="cloth tri" style="border-left-color:#e7edf2"></span></div></div>
          <div class="flag-cell"><div class="flagIcon" style="--fc:#e7edf2"><span class="pole"></span><span class="cloth rect"></span></div></div>
          <div class="flag-cell"><div class="flagIcon" style="--fc:#e7edf2"><span class="pole"></span><span class="cloth rect"></span></div></div>
          <div class="flag-cell"><div class="flagIcon" style="--fc:#e7edf2"><span class="pole"></span><span class="cloth notch"></span></div></div>
          <div class="flag-cell missing">?</div>
        </div>
        <div class="flag-options" data-single="t16right">
          <button class="flagOpt" data-id="tri"><div class="flagIcon" style="--fc:#e7edf2"><span class="pole"></span><span class="cloth tri" style="border-left-color:#e7edf2"></span></div></button>
          <button class="flagOpt" data-id="rect"><div class="flagIcon" style="--fc:#e7edf2"><span class="pole"></span><span class="cloth rect"></span></div></button>
          <button class="flagOpt" data-id="notch"><div class="flagIcon" style="--fc:#e7edf2"><span class="pole"></span><span class="cloth notch"></span></div></button>
        </div>
      </div>
    </div>
    <div class="actions"><button class="primary" data-action="check16()">Проверить</button><button class="hintbtn" data-action="hint('h16')">Подсказка</button></div>
    <div id="h16" class="hint">В левом квадрате цвета повторяются по кругу: синий, красный, жёлтый. В правом — формы: треугольный, прямоугольный, с выемкой.</div>
    <div class="feedback" id="f16"></div>
  </section>`;

const TOTAL=16; const solved=new Set();
function mark(n,good,msg){const t=document.getElementById('t'+n),f=document.getElementById('f'+n);f.className='feedback '+(good?'ok':'bad');f.textContent=msg;if(good){solved.add(n);t.classList.add('done')}else{solved.delete(n);t.classList.remove('done')} update()}
function hint(id){let e=document.getElementById(id);e.style.display=e.style.display==='block'?'none':'block'}

// universal selection behaviour
function setupSelectable(){
  document.querySelectorAll('[data-multi] .choice,[data-multi] .thing,[data-multi].thing').forEach(b=>b.addEventListener('click',()=>b.classList.toggle('selected')));
  document.querySelectorAll('[data-single] .choice,[data-single] .mini-choice,[data-single] .flagOpt').forEach(b=>b.addEventListener('click',()=>{b.parentElement.querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')}));
  document.querySelectorAll('.thing').forEach(b=>b.addEventListener('click',()=>b.classList.toggle('sel')));
  document.querySelectorAll('.pick').forEach(b=>b.addEventListener('click',()=>b.classList.toggle('selected')));
  document.querySelectorAll('.sym').forEach(b=>b.addEventListener('click',()=>{let g=b.dataset.group;document.querySelectorAll('.sym[data-group="'+g+'"]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')}));
  document.querySelectorAll('#breakRow .breakBead').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#breakRow .breakBead').forEach(x=>x.classList.remove('sel'));b.classList.add('sel')}));
}
setupSelectable();

function idsFrom(selector){return [...document.querySelectorAll(selector)].map(x=>x.dataset.id).sort().join(',')}
function check1(){let s=idsFrom('[data-multi="t1"] .selected');mark(1,s==='apple,ball',s==='apple,ball'?'Верно! Яблоко и мяч подходят по форме.':'Пока нет. Правильных ответов два: ищем круглую форму, но другой цвет.')}

// drag and drop + tap-to-place for all sort tasks
let picked=null;
document.querySelectorAll('.drag').forEach(el=>{
  el.addEventListener('dragstart',e=>{picked=el;e.dataTransfer.setData('text/plain','x')});
  el.addEventListener('click',()=>{document.querySelectorAll('.drag.sel').forEach(x=>x.classList.remove('sel'));picked=el;el.classList.add('sel')});
});
document.querySelectorAll('.zone').forEach(z=>{
  z.addEventListener('dragover',e=>{e.preventDefault();z.classList.add('over')});
  z.addEventListener('dragleave',()=>z.classList.remove('over'));
  z.addEventListener('drop',e=>{e.preventDefault();z.classList.remove('over');if(picked){z.appendChild(picked);picked.classList.remove('sel');picked=null}});
  z.addEventListener('click',e=>{if((e.target===z||e.target.tagName==='H3')&&picked){z.appendChild(picked);picked.classList.remove('sel');picked=null}})
});
function check2(){let all=[...document.querySelectorAll('#t2 .drag')];let ok=all.every(x=>x.parentElement.classList.contains('zone')&&x.parentElement.dataset.kind===x.dataset.kind);mark(2,ok,ok?'Отлично! Все предметы разложены по форме верно.':'Есть ошибка. Проверь, действительно ли предмет похож на форму своего домика.')}
function check3(){let ok=document.getElementById('m3a').value==='ball'&&document.getElementById('m3b').value==='gift'&&document.getElementById('m3c').value==='can'&&document.getElementById('m3d').value==='hat';mark(3,ok,ok?'Верно: шар—мяч, куб—подарок, цилиндр—банка, конус—колпак.':'Пока не всё совпало. Подумай, какой предмет можно катить как шар, а какой похож на колпак.')}
function check4(){let s=document.querySelector('[data-single="t4"] .selected');mark(4,s&&s.dataset.id==='A',s&&s.dataset.id==='A'?'Правильно! Дальше идут красный круг и синий квадрат.':'Попробуй ещё раз. Отдельно проследи порядок форм и порядок цветов.')}
function check5(){let s=document.querySelector('[data-single="t5"] .selected');mark(5,s&&s.dataset.id==='bluecircle',s&&s.dataset.id==='bluecircle'?'Да! Не хватало синего круга.':'Не совсем. Определи недостающую фигуру в строке и цвет всей строки.')}
function check6(){let r=+document.getElementById('redCount').value,g=+document.getElementById('greenCount').value,y=+document.getElementById('yellowCount').value,s=document.querySelector('.sym[data-group="cmp6"].selected');let ok=r===5&&g===5&&y===3&&s&&s.dataset.sym==='=';mark(6,ok,ok?'Точно! Красных 5, зелёных 5, жёлтых 3, поэтому 5 = 5.':'Проверь ещё раз числа и знак. Синие бусины считать не нужно.')}
function check7(){let a=['a0','a3','a4s','a4r','a5'].map(id=>+document.getElementById(id).value),ok=JSON.stringify(a)===JSON.stringify([0,3,4,4,5]);mark(7,ok,ok?'Верно! У квадрата и прямоугольника по 4 угла.':'Есть ошибка. Проверь, сколько углов у каждой фигуры.')}
function check8(){let ok=+document.getElementById('codeRect').value===4&&+document.getElementById('codePent').value===5;mark(8,ok,ok?'Код разгадан! Число показывает количество углов.':'Подумай ещё: что общего у чисел 0, 3 и 4?')}
function check9(){let ok=document.getElementById('t9q1').value==='color'&&document.getElementById('t9q2').value==='use'&&document.getElementById('t9q3').value==='matr';mark(9,ok,ok?'Отлично! Ты заметил и правило строк, и правило столбцов.':'Не всё верно. По строкам смотри на цвет, а по столбцам — на группу предметов.')}
function check10(){
  const countsOk=+document.getElementById('t10red').value===2&&+document.getElementById('t10yellow').value===4&&+document.getElementById('t10big').value===6&&+document.getElementById('t10small').value===9&&+document.getElementById('t10all').value===15;
  const s=document.querySelector('.sym[data-group="cmp10"].selected');
  if(countsOk&&!s){const f=document.getElementById('f10');f.className='feedback partial';f.textContent='Все числа верны! Остался один шаг: сравни 6 больших и 9 маленьких кругов и выбери знак.';return}
  if(countsOk&&s&&s.dataset.sym!=='<'){const f=document.getElementById('f10');f.className='feedback partial';f.textContent='Счёт верный. Исправь только знак: 6 больших кругов меньше, чем 9 маленьких.';return}
  const ok=countsOk&&s&&s.dataset.sym==='<';
  mark(10,ok,ok?'Верно! Красных 2, жёлтых 4, больших 6, маленьких 9, всего 15, и 6 < 9.':'Проверь числа ещё раз. Красных 2, жёлтых 4; большие — красные и жёлтые.')
}
function getSel(container){return [...document.querySelectorAll(container+' .thing.sel')].map(x=>x.dataset.id).sort().join(',')}
function check11(){let a=getSel('[data-multi="q11a"]'), b=getSel('[data-multi="q11b"]'), c=getSel('[data-multi="q11c"]');let ok=a==='glass,tank'&&b==='ball,globe'&&c==='box,tank';mark(11,ok,ok?'Верно! Ты отличаешь материал, форму и устройство предмета.':'Пока не всё совпало. Прозрачные — те, через которые видно; похожие на коробку — аквариум и коробка.')}
function check12(){let all=[...document.querySelectorAll('#t12 .drag')];let ok=all.every(x=>x.parentElement.classList.contains('zone')&&x.parentElement.dataset.kind===x.dataset.kind);mark(12,ok,ok?'Отлично! Все фигуры разделены на плоские и объёмные.':'Есть ошибка. Вспомни: объёмную фигуру можно представить как тело, у неё есть глубина.')}
function check13(){let ok=+document.getElementById('t13c').value===8&&+document.getElementById('t13t').value===6&&+document.getElementById('t13s').value===5&&+document.getElementById('t13r').value===5&&document.getElementById('t13most').value==='circles';mark(13,ok,ok?'Верно! Кругов 8, треугольников 6, квадратов 5, прямоугольников 5.':'Проверь счёт. В какой карточке фигур больше всего?')}
function check14(){let ok=document.getElementById('p14a').value==='chick'&&document.getElementById('p14b').value==='mitten'&&document.getElementById('p14c').value==='frog'&&document.getElementById('p14d').value==='berry'&&document.getElementById('p14e').value==='bluesq'&&document.getElementById('p14f').value==='yellowcir'&&document.getElementById('p14g').value==='greenrect'&&document.getElementById('p14h').value==='redtri';mark(14,ok,ok?'Отлично! В левой части пары по цвету, в правой — по форме.':'Есть ошибки в парах. Не забывай: в левой части смотри на цвет, в правой — на форму.')}
function check15(){
  const wrong=document.querySelector('#breakRow .breakBead.sel')?.dataset.index;
  const replacement=document.querySelector('[data-single="t15replace"] .selected')?.dataset.id;
  const next=document.querySelector('[data-single="t15a"] .selected')?.dataset.id;
  const ok=wrong==='9'&&replacement==='blue'&&next==='yb';
  if(!wrong){const f=document.getElementById('f15');f.className='feedback partial';f.textContent='Сначала нажми на бусину, где нарушилось чередование.';return}
  if(!replacement||!next){const f=document.getElementById('f15');f.className='feedback partial';f.textContent='Место выбрано. Теперь укажи правильный цвет для этой бусины и две следующие бусины.';return}
  mark(15,ok,ok?'Да! 9-я бусина должна быть синей, а дальше идут жёлтая и синяя.':'Проверь ещё раз: цвета должны строго чередоваться — синяя, жёлтая, синяя, жёлтая...')
}
function check16(){
  const l=document.querySelector('[data-single="t16left"] .selected')?.dataset.id;
  const r=document.querySelector('[data-single="t16right"] .selected')?.dataset.id;
  if(!l||!r){const f=document.getElementById('f16');f.className='feedback partial';f.textContent='Нужно выбрать два ответа: один флажок слева по цвету и один справа по форме.';return}
  const ok=l==='blue'&&r==='tri';
  mark(16,ok,ok?'Верно! Слева нужен синий прямоугольный флажок, справа — треугольный флажок.':'Попробуй ещё раз. Слева повторяются цвета, справа — именно контуры флажков.')
}


const checks=[check1,check2,check3,check4,check5,check6,check7,check8,check9,check10,check11,check12,check13,check14,check15,check16];
const controls=[...document.querySelectorAll('input,select')];
controls.forEach(e=>{const label=e.closest('.field')?.querySelector('label');if(label)label.htmlFor=e.id;else if(!e.closest('label')){const text=e.closest('.pair-row')?.querySelector('.leftItem')?.textContent;if(text)e.setAttribute('aria-label','Пара для: '+text);}});
const shapeLabels={circle:'круг',square:'квадрат',rect:'прямоугольник',triangle:'треугольник',oval:'овал',pentagon:'пятиугольник',diamond:'ромб',red:'красный',blue:'синий',green:'зелёный',yellow:'жёлтый',purple:'фиолетовый',brown:'коричневый'};
document.querySelectorAll('.shape').forEach(e=>{e.setAttribute('role','img');e.setAttribute('aria-label',[...e.classList].map(c=>shapeLabels[c]).filter(Boolean).join(', '));});

const selectable=[...document.querySelectorAll('.choice,.mini-choice,.flagOpt,.thing,.pick,.sym,.breakBead')];
const drags=[...document.querySelectorAll('.drag')];
const destinations=[...document.querySelectorAll('.zone,.items')];
let ready=false, storageOK=true;
function snapshot(){return {values:controls.map(e=>e.value),selected:selectable.map(e=>[e.classList.contains('selected'),e.classList.contains('sel')]),places:drags.map(e=>destinations.indexOf(e.parentElement)),solved:[...solved]};}
function persist(){if(!ready)return;try{localStorage.setItem('pamagochi-foundations-v1',JSON.stringify(snapshot()));}catch{storageOK=false;}}
function update(){persist();onProgress([...solved],storageOK);}
function invalidate(task){if(!task)return;solved.delete(Number(task.id.slice(1)));task.classList.remove('done');task.querySelector('.feedback').textContent='';update();}
// Every tested answer must be filled explicitly, including the zero-angle circle.
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b){const action=b.dataset.action;const n=/^check(\d+)\(\)$/.exec(action);const h=/^hint\('([^']+)'\)$/.exec(action);if(n){const task=b.closest('.task');if([...task.querySelectorAll('input,select')].some(el=>el.value==='')){mark(+n[1],false,'Заполни все окошки. Если предметов или углов нет, введи 0.');return;}checks[+n[1]-1]();}else if(h){hint(h[1]);b.setAttribute('aria-expanded',document.getElementById(h[1]).style.display==='block');}return;}if(e.target.closest('.choice,.mini-choice,.flagOpt,.thing,.pick,.sym,.breakBead,.drag,.zone'))invalidate(e.target.closest('.task'));});
document.addEventListener('input',e=>invalidate(e.target.closest('.task')));
document.addEventListener('change',e=>invalidate(e.target.closest('.task')));
document.addEventListener('drop',e=>invalidate(e.target.closest('.task')));
document.querySelectorAll('.feedback').forEach(e=>e.setAttribute('aria-live','polite'));
document.querySelectorAll('.drag,.zone,.thing,.pick,.choice,.mini-choice,.flagOpt,.breakBead').forEach(e=>{if(e.tagName!=='BUTTON'&&e.tagName!=='LABEL'){e.tabIndex=0;e.setAttribute('role','button');e.addEventListener('keydown',event=>{if(event.target!==e)return;if(event.key==='Enter'||event.key===' '){event.preventDefault();e.click();}});}});
try{const s=JSON.parse(localStorage.getItem('pamagochi-foundations-v1'));if(s){controls.forEach((e,i)=>{if(typeof s.values?.[i]==='string')e.value=s.values[i];});selectable.forEach((e,i)=>{e.classList.toggle('selected',s.selected?.[i]?.[0]===true);e.classList.toggle('sel',s.selected?.[i]?.[1]===true);});drags.forEach((e,i)=>{const dest=destinations[s.places?.[i]];if(dest&&dest.closest('.task')===e.closest('.task'))dest.append(e);});if(Array.isArray(s.solved))for(const n of new Set(s.solved)){if(Number.isInteger(n)&&n>=1&&n<=16&&![...document.getElementById('t'+n).querySelectorAll('input,select')].some(e=>e.value===''))checks[n-1]();}}}catch{storageOK=false;}
ready=true;update();
return {show(ids){document.querySelectorAll('.task').forEach(t=>t.hidden=!ids.includes(Number(t.id.slice(1))));},reset(ids){ids.forEach(n=>{const task=document.getElementById('t'+n);task.querySelectorAll('input,select').forEach(e=>e.value='');task.querySelectorAll('.selected,.sel').forEach(e=>e.classList.remove('selected','sel'));task.querySelectorAll('.hint').forEach(e=>e.style.display='none');task.querySelectorAll('[aria-expanded]').forEach(e=>e.setAttribute('aria-expanded','false'));task.querySelectorAll('.drag').forEach(e=>document.getElementById(e.dataset.home)?.append(e));invalidate(task);});picked=null;},solved:()=>[...solved]};

};
