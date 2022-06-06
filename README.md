# Dizajn webstránky  

Prvý design s ktorým som uspokojený.

## Časti webovej stránky

![Screenshot_webstránky](./docs/webpage-screenshot.png)

### Hlavička stránky

Hlavička webstránky obsahuje **Hľadanie**. Nemá teraz žiadnu funkcialitu, ale mal by existuvať pre nájdenie toho  

### Items

![Ide_na_cas](./docs/item-design-base.png)
![Meska](./docs/item-design-base-meska.png)
![Nadbieha](./docs/item-design-base-early.png)

#### Hlavicka items

V hlavicke je vidiet cislo vozidla s pozadim, ktore povie aj v akom stave je vozidla (ci meska, nadbieha alebo ci ide na cas). Farba pozadia pre cislo vozidla je **taka ista** ako farba pozadia v pravo dole, ako pri vypise stavu vozidla (ci meska, nadbieha alebo ide na cas).
![Hlavicka_cislo_vozidla](./docs/item-design-time-status.png)

Farba pozadia strednej casti hlavicky je tak isto podla stavu vozidla (ci meska, nadbieha alebo ide na cas).
![Hlavicka_blur](./docs/item-design-time-status-blur.png)

V pravom rohu je cislo linky. Pozadie predstavuje typ vozidla (modre - autobus, atd).
![Hlavicka_cislo_linky](./docs/item-design-line-number.png)

#### Informacie o vozidle

V časti itemu kde sa udáva informácia o vozidle, prvý text hovorí o službu akú má vodič vozidla. Je to označené ikonkou poznámkového zošita s ceruzkou.  

Druhý riadok zodpovedá stavu vozidla (online, offline). Ak je vozidlo je 'Online' krúžok je vyplnená zelenou farbou, ak je 'Offline' krúžok pred textom je vyplnená šedou farbou.
![Information_part](./docs/item-design-information.png)

Posledný riadok zodopedá času kedy bola správa odoslaná z vozidla (**state_dtime**).  
![Msg_Time](./docs/item-design-msg-time.png)
Mal by to byť implementované tak, že:

- ak správa bola odoslaná z vozidla ten istý deň, tak vypíše len hodiny, minúty a sekundy
- ak správa bola odoslaná z vozidla *iný deň* - napríklad o deň na to - tak vypíše sa celý dátum vo formáte: dd/MM/YYYY HH:mm:ss.

Existujú 3 ikonky pre túto časť správy a každý má iný význam:

- Správa bola odoslaná pred 1-2 minútami
![before2min](./docs/item-design-msg-time-okay.png)

- Správa bola odoslaná pred viac ako 2 minút, ale menej ako 5 minút
![before5min](./docs/item-design-msg-time-notsookay.png)

- Správa bola odoslaná pred viac ako 5 minútami
![after5min](./docs/item-design-msg-time-notokayatall.png)
