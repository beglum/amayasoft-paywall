# Paywall / restore-empty (3:261) — ЧАСТИЧНО

get_design_context не получен: лимит Figma MCP (Starter). Ниже — структура из use_figma. Цвета/шрифты — см. variables.md.

```
FRAME 3:261 "Paywall / restore-empty" 375x812 AL:VERTICAL gap0 pad20,44
  FRAME 3:262 "content" 335x564 @20,44 AL:VERTICAL gap24 pad0,8
    header 335x200: Mascot/Fox 112x112 + gap16 + title "Откройте весь мир Зверят" 335x72
    values 335x96 @0,232: 3 ValueItem (как в error.md)
    FRAME 3:294 "plans" 335x212 @0,352 AL:VERTICAL gap12
      INSTANCE 3:295 "PlanCard/year" 335x76 AL:HORIZONTAL gap12 pad16,16 (выбрана: бордер 2 accent, фон accent-tint)
        radio (checked) 24x24 | info: "Год" + badge "Выгоднее" (pad8,4) / caption "166 ₽ в месяц" | price "1 990 ₽"
      INSTANCE 3:306 "PlanCard/month" 335x76 (белая, бордер 1 border)
        radio (empty) 24x24 | "Месяц" / "Отмена в любой момент" | "299 ₽"
      FRAME 3:316 "InfoBanner" 335x36 AL:HORIZONTAL gap8 pad12,8 FILL/HUG
        FRAME 3:317 "icon/info" 16x16 (круг + "i")
        TEXT 3:321 "text" 287x20 "Покупок на этом устройстве не найдено" autoResize:HEIGHT FILL
  FRAME 3:322 "footer" 335x124 @20,652: CTA "Оформить за 1 990 ₽" / Link "Восстановить покупки" / footnote
```
