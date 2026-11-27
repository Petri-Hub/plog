---
title: 'Dithering: desenhando gradientes com só duas cores'
description: 'Matrizes de Bayer, difusão de erro e por que telas antigas ainda ficam bonitas.'
date: '2025-06-03'
tags: ['graphics', 'algorithms']
highlighted: true
alternates:
  - 'en-us/dithering-drawing-gradients-with-two-colors'
  - 'pt-br/dithering-drawing-gradients-with-two-colors'
---

Dê a uma tela só preto e branco e peça para ela mostrar um gradiente suave. A resposta ingênua é arredondar cada pixel: mais escuro que a metade vira preto, mais claro vira branco. O resultado é uma borda dura onde antes havia um gradiente. _Dithering_ é o truque de trocar resolução por tom: em vez de um pixel cinza, você desenha um padrão de pixels pretos e brancos que o olho volta a misturar em cinza.

## Dithering ordenado

A versão mais simples compara cada pixel com um limiar que muda conforme a posição. Os limiares vêm de uma **matriz de Bayer**, uma grade pequena em que cada valor fica o mais longe possível dos vizinhos:

```text title="bayer 4×4"
 0   8   2  10
12   4  14   6
 3  11   1   9
15   7  13   5
```

Repita a matriz sobre a imagem, divida por 16, e cada pixel ganha o seu próprio limiar:

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

É rápido, não precisa de memória entre pixels e fica igual em todo quadro, e é por isso que jogos antigos usavam. O custo é um padrão quadriculado visível.

## Difusão de erro

A difusão de erro segue outro caminho. Arredonde o pixel, meça o quanto errou e empurre esse erro para os pixels que ainda não foram desenhados. **Floyd–Steinberg**, a versão mais conhecida, divide o erro assim:

| Vizinho           | Parte do erro |
| ----------------- | ------------- |
| À direita         | 7/16          |
| Abaixo à esquerda | 3/16          |
| Abaixo            | 5/16          |
| Abaixo à direita  | 1/16          |

As partes somam um, então nenhum brilho se perde: o que um pixel arredonda, os vizinhos devolvem. O resultado parece orgânico em vez de padronizado, mas cada pixel depende dos anteriores, então não dá para rodar em paralelo como o dithering ordenado.

## Qual usar

1. Use **dithering ordenado** em animação, shaders e tudo que precisa ficar estável de um quadro para o outro.
2. Use **difusão de erro** em imagens paradas, onde a textura mais suave compensa o custo.
3. Não use nenhum dos dois quando sobrarem cores. Dithering é uma gambiarra, e aparece.

Tem um tour mais longo e ilustrado no [artigo da Wikipédia sobre dithering](https://en.wikipedia.org/wiki/Dither), que foi onde a minha própria toca de coelho começou.
