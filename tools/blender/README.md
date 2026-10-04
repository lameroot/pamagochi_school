# Остров фигур: авторинг через официальный Blender Lab MCP

Эксперимент перерабатывает задания 3 и 4 урока «Секреты фигур»: объёмная форма предметов и одновременная закономерность формы/цвета. Финал применяет форму и цвет в конструировании ракеты. Обычные уроки не заменены.

## Результаты

- `pamagochi_school_site/island.html` — отдельный статический 3D-урок.
- `pamagochi_school_site/assets/island/reference.png` — первоначальный сгенерированный 3D-референс; не используется вместо 3D.
- `pamagochi_school_site/assets/island/island.blend` — исходная редактируемая сцена Blender.
- `pamagochi_school_site/assets/island/island.glb` — экспорт сцены с 392 объектами, материалами и метаданными взаимодействия. Примерно 3.7 MiB.
- `pamagochi_school_site/assets/island/blender-preview.png` — контрольный рендер Blender.
- `build_island.py` — воспроизводимый авторинг. Все художественные координаты Y-up преобразуются в Blender Z-up.
- `mcp_client.py` — **настоящий MCP-клиент**: initialize → tools/call по stdio → официальный сервер → установленный аддон → Blender. Прямой TCP вместо MCP не используется.

## Локально открыть сайт

Из корня репозитория:

```sh
python3 -m http.server 8775 --bind 127.0.0.1
```

Открыть http://127.0.0.1:8775/pamagochi_school_site/island.html . Открытие HTML через `file://` не поддерживается ES-модулями/GLB-загрузчиком. Для GitHub Pages всё остаётся обычной статикой, пути относительные. Публикация/commit/push в рамках эксперимента не выполнялись.

В браузере не нужны Blender, MCP, Python, Node.js, ключи API или внешние сервисы. Нужен WebGL 2. Three.js 0.180.0 и необходимые addons включены локально с MIT LICENSE; у GLTFLoader исправлен только относительный путь к соседнему BufferGeometryUtils.js. Никакого CDN-запроса во время урока.

## Проверенная локальная настройка MCP (2026-09-12)

Установлены Blender 5.1.2 и **официальный** аддон Blender Lab `mcp` 1.0.0. Это не community-пакет ahujasid/blender-mcp; протоколы отличаются.

Официальный исходник: https://projects.blender.org/lab/blender_mcp.git , revision `ff54e4d8f6b09502f2f466189cca0e52b4a91643`, Python package `blender-mcp` 1.0.2. Документация: https://www.blender.org/lab/mcp-server/ .

Сервер установлен в отдельное окружение `~/.local/share/blender-lab-mcp/venv` и зарегистрирован в Codex под именем `blender`. Системный Python не менялся. Зависимости скачаны из публичного PyPI только для этой установки: настроенный корпоративный индекс не разрешался по DNS. В установленном MCP SDK initialize serverInfo.version показывает версию SDK 1.30.0, а не версию пакета blender-mcp.

Если инструменты не появились в текущем Codex, перезапустите Codex. Создание этой сцены проверено в текущем сеансе через MCP SDK-клиент, не требует перезагрузки чата.

### Запуск отдельного Blender для авторинга

Чтобы не менять открытую несохранённую сцену пользователя, был запущен отдельный экземпляр:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --online-mode \
  --addons bl_ext.user_default.mcp --command blender_mcp --host 127.0.0.1 --port 9876
```

Адрес только loopback. Не открывайте этот порт в сеть: MCP выполняет Python в Blender. Не запускайте два аддона на одном порту. В интерактивном Blender можно вместо этого включить MCP и запустить сервер в настройках аддона. Автозапуск/глобальные настройки Blender не менялись.

```sh
# Read-only health check:
~/.local/share/blender-lab-mcp/venv/bin/python tools/blender/mcp_client.py
# Create a NEW scene and write the experiment's existing output files:
~/.local/share/blender-lab-mcp/venv/bin/python tools/blender/mcp_client.py tools/blender/build_island.py
```

`MCP_SERVER` переопределяет путь к executable. Клиент добавляет `PROJECT_ROOT` по своему расположению; модель сохраняется внутри этого проекта. Скрипт не удаляет чужие объекты/сцены, но при повторном запуске перезаписывает свои island.blend/island.glb. Из-за русской локализации Blender имена нодов переводятся: скрипт ищет BSDF и Background по **типу**, не по английскому имени.

## Контракт интерактивности

GLB extras: `interactive=item` + `item`, `interactive=dock` + `shape`, `interactive=sequence` + `slot`; роли `explorer` и `rocket`. Веб-слой передвигает экспортированные объекты и добавляет геометрию выбранных ответов. Ошибочная деталь действительно отображается в 3D, а не только в карточке. Дополнительные ответные примитивы создаются Three.js; остров, предметы, робот, ракета и окружение созданы Blender.

Управление: мышь/палец вращают; pinch/кнопки меняют масштаб; нажать предмет → площадку; на мосту выбрать место → деталь; у ракеты выбрать часть → деталь. Кнопки в панели полностью дублируют 3D-выбор. На дорожке можно указать место для робота, станции вызывают маршрут и приближение камеры. Стрелки при фокусе на сцене двигают робота по центральной дорожке. Это исследовательская диорама, не платформер с прыжками/физикой.

Только 3 отдельные зачётные миссии, ключ сохранения `pamagochi:island:v1`. Изменение ответа снимает зачёт текущей миссии. При чтении сохранения проверяются разрешённые значения и ранее зачтённые ответы. Сброс не затрагивает остальные уроки. При недоступном localStorage урок продолжает работать без сохранения. При ошибке WebGL/GLB показаны причина, повторная загрузка и ссылка на обычный урок. Respect `prefers-reduced-motion` (без перелётов камеры и взлёта, но с итоговым сообщением).

## Проверки

```sh
node tests/island.logic.mjs
node tests/island.browser.cjs  # requires Playwright; APP_URL overrides localhost
node tests/app.browser.cjs
node tests/lab.browser.cjs
node tests/collections.browser.cjs
```

Browser suite: реальная GLB/WebGL-загрузка, desktop 1440 и touch/mobile 390, отсутствие горизонтального скролла при 320, пустые/неправильные/частичные/правильные ответы, перенос с занятой площадки, повторная проверка без лишних звёзд, раздельная обратная связь формы/цвета, подсказки, запуск, reload, изменение зачтённого ответа, отмена и подтверждение изолированного сброса, клавиатура, ошибка загрузки GLB, отказ хранилища. Эмуляция мобильного viewport не заменяет проверку на физическом iPhone/Android.
