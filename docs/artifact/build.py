# Builds harshita-plot.html (the artifact) from the template, inlining every image as a data URI.
# Run from this folder: python3 build.py
import base64
t=open('harshita-plot.template.html').read()
m=[('__WOBBLE_SHEET__', 'img/wobble-sheet.jpg'), ('__T_NATIONAL__', 'old/s/t-a6IUogCTQURvgRJnVcGxZsIcyVg.jpg'), ('__GH_PARADOX__', 'gh/accessibility-paradox.jpg'), ('__GH_FRAMING__', 'gh/problem-framing.jpg'), ('__SAFE_BOARD__', 'old/s/c-3kai7K9JmSvM6g09fBkMQSHY.jpg'), ('__T_LULLABY__', 'old/s/t-rsiCySHGh2ac1IgG4TPDpxHtLJc.jpg'), ('__P_MIRROR__', 'old/s/c-BnU1UyeP8QRGWtUHRxQ2UztE.jpg'), ('__GH_EXPL3__', 'gh/visual-exploration-3.jpg'), ('__SAFE_AFF__', 'old/s/x-bBzZP3rCZHwDJ9NJcmLqrZxNyPY.jpg'), ('__T_PAPER__', 'old/s/t-iW6hDpdoj8aidxygO2u3Dw6XXI.jpg'), ('__GH_HERO__', 'gh/hero-image.jpg'), ('__GH_DUAL__', 'gh/dual-monitor.jpg'), ('__GH_SOL1__', 'gh/solution1.jpg'), ('__GH_SOL2__', 'gh/solution2.jpg'), ('__GITHUB__', 'img/github.jpg'), ('__WOBBLE__', 'img/wobble-hero.jpg'), ('__T_MIME__', 'old/s/t-ID3grbhewzh3gF4t4eAVqrweNAQ.jpg'), ('__T_CAST__', 'old/s/t-O4Cyw8qPY9uENzcYjeeusaWGug.jpg'), ('__P_BIKE__', 'old/s/c-tl8PyLj9GrpxTqK1SuzFI7WK9A.jpg'), ('__P_LAKE__', 'old/s/c-H4sWYYxdFhKKFv1xJlhGwaIgEgw.jpg'), ('__T_RED__', 'old/s/t-cXlTfcY2CFzMW0scM0MQccvLqGs.jpg'), ('__P_SUN__', 'old/s/c-Wg6t9OlIeNvY4Eak623n5zWh5jc.jpg'), ('__SONY__', 'img/sony.jpg'), ('__SAFE__', 'old/s/c-18OUkAMcZur2sWt51dr0V6QaY.jpg'), ('__HPE2__', 'old/s/x-WZtIkLVfpq1YQW9xvtQspoDZ5I.jpg'), ('__HPE__', 'old/s/c-1jtD9frnrsXfkQQvkEiytcIbIw.jpg'), ('__O10__', 'old/s/o-FdZExjaagOsF7ylelMcma28MBKw.jpg'), ('__O11__', 'old/s/o-9f07w2F9p0g9iyEixtxQJzbpY4E.jpg'), ('__O12__', 'old/s/o-34rkwIMPJTQN6mxUHKj7XINVg.jpg'), ('__O13__', 'old/s/o-RfktmZvJw5W72lhjz55yDTf8QMk.jpg'), ('__O1__', 'old/s/o-ubReJQJsSGx5ayN7JKc2CzBeKew.jpg'), ('__O2__', 'old/s/o-HbX0Emj70kJkAqU9SbtDRCGwL0.jpg'), ('__O3__', 'old/s/o-DqILlBVIyjdrFA07xOtDkg4WMI.jpg'), ('__O4__', 'old/s/o-CbFYEuImQJgMgMTCHMLc0HTqqM.jpg'), ('__O5__', 'old/s/o-83ZdeA7S3LCgurZiBI5lJi1y0.jpg'), ('__O6__', 'old/s/o-xb4y0NeyXPAwhGMBhkf1f4JQjc4.jpg'), ('__O7__', 'old/s/o-fjbUWD0vSlY5Kh95teCbZ5phAWE.jpg'), ('__O8__', 'old/s/o-LgqKU3Aj3lRbyQv19cthPDGd0Q.jpg'), ('__O9__', 'old/s/o-TZy4WxWjjaZQcnsZWHGVM1eQg.jpg')]
cache={}
for k,v in m:
    if v not in cache: cache[v]='data:image/jpeg;base64,'+base64.b64encode(open(v,'rb').read()).decode()
    t=t.replace(k,cache[v])
left=[x for x in __import__('re').findall(r'__[A-Z0-9_]+__',t) if x not in ('__proto__',)]
print('unreplaced:',sorted(set(left)))
open('harshita-plot.html','w').write(t)
print('built',len(t))
