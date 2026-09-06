# SmartPost arka planları

Görselleri bu klasöre, aşağıdaki adlarla koy. Uzantı `.png`, `.jpg`, `.jpeg`
veya `.webp` olabilir — uygulama sırayla dener, ilk bulduğunu kullanır.

| Görsel                   | Dosya adı            |
|--------------------------|----------------------|
| Merdiven                 | `merdiven`           |
| Nişte kitap              | `kitap`              |
| Yağmurlu pencere         | `yagmurlu-pencere`   |
| Taş kemer + manzara      | `kemer-manzara`      |
| Duvarda fener            | `fener-duvar`        |
| Ahşapta fener            | `fener-ahsap`        |
| Yeşil kapı               | `yesil-kapi`         |
| Vazo + yaprak gölgesi    | `vazo-golge`         |
| Zeytin yolu              | `zeytin-yolu`        |
| Vazo + çıplak dal        | `vazo-dal`           |

Örnek: `yesil-kapi.png`

Dosyası olmayan sessizce atlanır; hiçbiri yoksa editör "Bir fotoğraf seç"
boş durumunu gösterir. Liste `src/app/smartpost/_lib/config.ts` içindeki
`BUNDLED_BACKGROUNDS` sabitinden gelir.

Not: metin sol sütunda durur, sağdaki ~%36'lık şerit dekora ayrılmıştır —
görsellerin ana öğesi sağda kalmalı.
