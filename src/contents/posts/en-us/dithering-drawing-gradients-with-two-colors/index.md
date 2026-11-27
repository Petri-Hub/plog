---
title: 'Dithering: drawing gradients with only two colors'
description: 'Bayer matrices, error diffusion and why old screens still look good.'
date: '2025-06-03'
tags: ['graphics', 'algorithms']
highlighted: true
alternates:
  - 'en-us/dithering-drawing-gradients-with-two-colors'
  - 'pt-br/dithering-drawing-gradients-with-two-colors'
---

Give a screen only black and white, and ask it to show a smooth gradient. The naive answer is to round every pixel: darker than half becomes black, lighter becomes white. The result is a hard edge where the gradient used to be. _Dithering_ is the trick of trading resolution for tone: instead of one gray pixel, you draw a pattern of black and white pixels that your eye averages back into gray.

## Ordered dithering

The simplest version compares each pixel against a threshold that changes with its position. The thresholds come from a **Bayer matrix**, a small grid where every value is as far as possible from its neighbors:

```text title="bayer 4×4"
 0   8   2  10
12   4  14   6
 3  11   1   9
15   7  13   5
```

Tile it over the image, divide by 16, and each pixel gets its own threshold:

```ts title="dither.ts"
const bayer = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

export const toOrderedDither = (gray: number[][]): number[][] => {
  return gray.map((row, y) => {
    return row.map((value, x) => {
      const threshold = (bayer[y % 4][x % 4] + 0.5) / 16

      return value > threshold ? 1 : 0
    })
  })
}
```

It is fast, needs no memory between pixels and looks the same in every frame, which is why old games used it. The cost is a visible cross-hatch pattern.

## Error diffusion

Error diffusion takes another route. Round the pixel, measure how wrong you were, and push that error onto the pixels you haven't drawn yet. **Floyd–Steinberg**, the best-known version, splits the error like this:

| Neighbor    | Share of the error |
| ----------- | ------------------ |
| Right       | 7/16               |
| Below left  | 3/16               |
| Below       | 5/16               |
| Below right | 1/16               |

The shares add up to one, so no brightness is lost: what one pixel rounds away, its neighbors pay back. The result looks organic instead of patterned, but every pixel depends on the ones before it, so it can't run in parallel the way ordered dithering can.

## Which one to use

1. Use **ordered dithering** for animation, shaders and anything that must stay stable from frame to frame.
2. Use **error diffusion** for still images, where the softer texture is worth the cost.
3. Use neither when you have colors to spare. Dithering is a workaround, and it shows.

There is a longer, illustrated tour on [Wikipedia's dithering article](https://en.wikipedia.org/wiki/Dither), which is where my own rabbit hole started.
