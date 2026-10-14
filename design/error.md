# Paywall / error (3:126) — ЧАСТИЧНО

get_design_context не получен: лимит Figma MCP (Starter). Ниже — структура из use_figma (тип, id, имя, размер, позиция, auto-layout, тексты). Цвета/шрифты — см. variables.md.

```
FRAME 3:126 "Paywall / error" 375x812 AL:VERTICAL gap0 pad20,44
  FRAME 3:127 "content" 335x516 @20,44 AL:VERTICAL gap24 pad0,8 FILL/HUG
    FRAME 3:128 "header" 335x200 AL:VERTICAL gap16 FILL/HUG
      INSTANCE 3:129 "Mascot/Fox" 112x112 @112,0
      TEXT 3:142 "title" 335x72 "Откройте весь мир Зверят" autoResize:HEIGHT FILL
    FRAME 3:143 "values" 335x96 @0,232 AL:VERTICAL gap12
      ValueItem 335x24 (Icon/Check 24x24 + gap12 + text 299x24): "120+ развивающих игр для 3–7 лет"
      ValueItem: "Новые уровни каждую неделю"
      ValueItem: "Без рекламы и случайных покупок"
    FRAME 3:159 "plans" 335x164 @0,352 AL:VERTICAL gap12
      FRAME 3:160 "error" 335x164 AL:VERTICAL gap12 pad24,16 FILL/FIXED (высота = 2 карточки 76 + gap 12)
        TEXT 3:161 "title" 285x24 "Не удалось загрузить тарифы" autoResize:HEIGHT FILL
        TEXT 3:162 "subtitle" 285x20 "Проверьте интернет и попробуйте снова" autoResize:HEIGHT FILL
        FRAME 3:163 "Button/Retry" 136x44 AL:HORIZONTAL pad24,0 HUG/FIXED
          TEXT 3:164 "label" "Повторить"
  FRAME 3:165 "footer" 335x124 @20,652 AL:VERTICAL gap4
    INSTANCE 3:166 "CTA" 335x56 pad24,0: "Оформить за 1 990 ₽"
    FRAME 3:169 "Link/Restore" 209x44 pad16,0: "Восстановить покупки"
    TEXT 3:171 "footnote" 335x16 "Это тестовая покупка — деньги не списываются"
```

Визуально (самопроверка): блок error — белая карточка с бордером, текст по центру, кнопка «Повторить» — обводка accent, текст accent.
