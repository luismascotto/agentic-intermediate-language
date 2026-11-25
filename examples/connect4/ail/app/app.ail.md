# App

The shell around the play area.

```ail
node App : flow   level: experience
  why   One place to play Connect 4 on this device.   <- Connect4
  what
    shows the play area and nothing else
    Scenario: opening the app
      Given a fresh visit
      Then the status says "Red's turn"
      And the board is empty
  look
    layout       stack(v, gap: space.4, align: stretch, pad: space.6) [ PlayAGame ]
    width        at most 420px, centered horizontally on the page
    background   color.surface
  binds
    area    PlayAGame
  uses      PlayAGame, Stack
  children  PlayAGame
```
