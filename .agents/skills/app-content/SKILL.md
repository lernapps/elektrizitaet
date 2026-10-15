---
name: app-content
description: Use for any content work in this app - researching, writing, extending, correcting or reviewing its competencies, chapters, pages, rounds, questions, exercises, figures, terms or sources. This app's own content decisions; they take precedence over the generic lernapps content skills. Load it before you change any content.
---

# Content guide of this app

## Curriculum

Deutschland, länderübergreifend, Schulform-übergreifend, Jahrgang 5 bis 8 (Physik bzw. Naturwissenschaften). Die Lerntexte
nennen kein Land und keinen Lehrplan; das Zitat steht nur hier und im Plan.

- **Klasse 5 und 6** (Kapitel `stromkreis`, `schaltungen`, `alltag`): **kein offizielles Lehrplandokument zitiert**. Die
  Recherche fand nur schulinterne Pläne und Unterrichtsmaterial, die übereinstimmend dieselben Themen nennen (Stromkreis,
  Leiter/Nichtleiter, Schalter und Schaltpläne, Reihen- und Parallelschaltung, Wirkungen des Stroms, Sicherheit). Lehrplan
  nicht geprüft; das Zitat ist nachzureichen, sobald ein Land festgelegt ist.
- **Klasse 7 und 8** (Kapitel `groessen`, `schaltungen-messen`): Lehrplanzitat Bayern, Gymnasium: *Fachlehrplan Physik 8 –
  Phänomene experimentell untersuchen und modellieren*, Staatsinstitut für Schulqualität und Bildungsforschung (ISB),
  LehrplanPLUS, Jahrgangsstufe 8, Lernbereich 1 „Elektrischer Strom“ (ca. 14 Std.),
  <https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/physik>, geöffnet am 2026-10-15. Er nennt: Stromkreismodell,
  Stromstärke, Spannung, Widerstand mit Definitionsgleichung, Kennlinien, Reihen- und Parallelschaltung mit höchstens drei
  Widerständen, Kurzschluss, Haushaltsinstallation. Das ohmsche Gesetz steht dort nicht ausdrücklich (nur „ohmscher und
  nicht-ohmscher Widerstand“); es ist aufgenommen, weil andere Länder es in diesen Jahrgängen behandeln (nicht geprüft). Die
  Jahrgangsstufe ist je nach Land verschieden (Bayern: 8); die App sagt deshalb „Klasse 7 und 8“.
- **Später**: Wechselstrom als eigenes Kapitel `wechselstrom` hinter `schaltungen-messen` (Wechselspannung, Steckdose,
  Generator, Transformator); danach Leistung und Energie, Magnetismus und Elektromagnet. Die Kapitel dieser Klassen heißen nach
  dem Thema, nicht „Gleichstrom“, weil die Größen auch für Wechselstrom gelten; die Einleitung sagt, dass es um Gleichstrom
  geht.


## Competencies

Kapitel `stromkreis` (Der Stromkreis)
- Ich kann einen einfachen Stromkreis aus Stromquelle, Verbraucher und Leitungen beschreiben und erklären, warum er
  geschlossen sein muss. Seite `stromkreis/einfacher-stromkreis`; Übungen `sk-geschlossen`, `sk-teile`, `sk-offen`.
- Ich kann Stoffe als Leiter oder Nichtleiter einordnen. Seite `stromkreis/leiter-nichtleiter`; `ln-leiter`,
  `ln-huelle`, `ln-wasser`.

Kapitel `schaltungen` (Schaltungen)
- Ich kann die Schaltzeichen für Batterie, Lampe und Schalter lesen und die Wirkung eines Schalters erklären. Seite
  `schaltungen/schalter-schaltzeichen`; `sz-zuordnen`, `sz-offen`, `sz-schalter`.
- Ich kann eine Reihenschaltung erkennen und vorhersagen, was passiert, wenn ein Bauteil ausfällt. Seite
  `schaltungen/reihenschaltung`; `rs-ausfall`, `rs-wege`, `rs-reihenfolge`.
- Ich kann eine Parallelschaltung erkennen und von der Reihenschaltung unterscheiden. Seite
  `schaltungen/parallelschaltung`; `ps-ausfall`, `ps-zuordnen`, `ps-haus`.
- Ich kann Stromkreise planen und bauen, die eine vorgegebene Aufgabe erfüllen. Komponente `SchaltungBauen`, auf den Seiten
  verteilt: `schaltungen/schalter-schaltzeichen` (Ziele `eine`, `schalter`), `schaltungen/reihenschaltung` (`reihe`),
  `schaltungen/parallelschaltung` (`parallel`, `je-schalter`, `haupt`; dort auch `be-kurzschluss`).

Kapitel `alltag` (Strom im Alltag)
- Ich kann Wärme-, Licht- und Magnetwirkung des Stroms an Geräten zuordnen. Seite `alltag/wirkungen`; `wk-zuordnen`,
  `wk-kabel`, `wk-gluehlampe`.
- Ich kann Alltagssituationen mit Strom als sicher oder gefährlich beurteilen und begründen. Seite
  `alltag/sicherheit`; `si-sicher`, `si-gewitter`, `si-sicherung`.

Kapitel `groessen` (Größen im Stromkreis)
- Ich kann die Stromstärke in A und mA angeben, am Amperemeter ablesen und das Amperemeter richtig einbauen. Seite
  `groessen/stromstaerke`; Komponente `StromMessen`, `sa-einbau`, `sa-umrechnen`, `sa-rechnen` (`generated`).
- Ich kann Spannung als „Antrieb“ des Stroms erklären, in V angeben und das Voltmeter richtig anschließen. Seite
  `groessen/spannung`; Komponente `SpannungMessen`, `sp-anschluss`, `sp-offen`, `sp-zuordnen`.
- Ich kann erklären, wovon der Widerstand eines Drahts abhängt (Material, Länge, Querschnitt), und ihn in Ω angeben. Seite
  `groessen/widerstand`; Komponente `DrahtLabor`, `wd-laenge`, `wd-kleiner`, `wd-ordnen`.
- Ich kann mit R = U / I eine fehlende Größe berechnen und eine Kennlinie lesen. Seite `groessen/ohmsches-gesetz`;
  Komponente `OhmLabor`, `og-strom`, `og-widerstand` (beide `generated`), `og-doppelt`.

Kapitel `schaltungen-messen` (Schaltungen mit Messgeräten)
- Ich kann Stromstärke und Spannung in einer Reihenschaltung mit zwei Widerständen vorhersagen und berechnen. Seite
  `schaltungen-messen/reihenschaltung`; Komponente `SchaltungVorhersage` (`reihe-strom`, `reihe-spannung`), `rr-strom`,
  `rr-teilspannung` (beide `generated`), `rr-ampere`.
- Ich kann Stromstärke und Spannung in einer Parallelschaltung (zwei Zweige) vorhersagen und berechnen. Seite
  `schaltungen-messen/parallelschaltung`; Komponente `SchaltungVorhersage` (`parallel-gesamt`, `parallel-zweig`),
  `pr-gesamtstrom`, `pr-zweigstrom` (beide `generated`), `pr-spannung`.


## Content structure

Jede Seite hat dieselben vier Sektionen in dieser Reihenfolge: `idee` (Die Idee: 2 bis 4 Sätze, Alltagsbezug),
`merke` (Das merkst du dir: `definition`-Blöcke für Fachwörter, Tabelle oder Figur, Regeln als Liste), `beispiel`
(ein `example`-Kasten) und `uebung` (3 Quizübungen und, wo die Kompetenz es verlangt, dazu eine Komponente als erste Übung: seit Klasse 7 und 8 hat jede Seite der
Kapitel `groessen` und `schaltungen-messen` eine; die Seiten von Klasse 5 und 6 haben eine für das Bauen). Eine Seite
umfasst eine Kompetenz und passt auf einen Bildschirm voll Text. Kapitel haben 2 bis 4 Seiten.


## Terminology

**Sprachen:** Deutsch und Englisch (`languages: [de, en]` in `src/app.yaml`). Jeder Lerntext ist eine Map `{ de: …, en: … }`,
auch die `texts` der Komponente. Links in Fragen verweisen für beide Sprachen auf den deutschen Wikipedia-Artikel; der englische
Linktitel sagt „(German Wikipedia)“. Englische Fachwörter: circuit, power source, load, wire, switch, circuit symbol, circuit
diagram, series circuit, parallel circuit, short circuit, fuse, conductor, insulator.

- Stromkreis (nicht „Stromlauf“), Stromquelle, Verbraucher, Leitung, Schalter, Schaltzeichen, Schaltplan,
  Reihenschaltung, Parallelschaltung, Kurzschluss, Sicherung; Leiter und Nichtleiter (Isolator als Nebenwort).
- „Der Strom fließt“ ist die Sprechweise; Elektronen kommen erst in höheren Jahrgängen vor. In Klasse 5 und 6 gibt es keine
  Größen. Ab Kapitel `groessen` heißen sie Stromstärke $I$ (Ampere, A; 1 A = 1000 mA), Spannung $U$ (Volt, V) und Widerstand
  $R$ (Ohm, Ω). Als Bild dient der Wasserkreislauf (Pumpe, enges Rohr); jede Seite sagt, dass das Bild Grenzen hat. Zahlen
  haben immer eine Einheit; Dezimalkomma in Deutsch, Dezimalpunkt in Englisch (`decimal` in den Texten der Komponente).
- Englisch zusätzlich: current (Stromstärke), voltage, resistance, resistor, ammeter, voltmeter, Ohm's law, characteristic
  curve, total resistance. Deutsch zusätzlich: Stromstärke, Spannung, Widerstand (auch das Bauteil), Amperemeter, Voltmeter,
  ohmsches Gesetz, Kennlinie, Gesamtwiderstand. Das Amperemeter wird **in Reihe eingebaut**, das Voltmeter **parallel
  angeschlossen**.
- Die Lernenden werden mit „du“ angesprochen. Jedes Fachwort steht einmal als `definition` (daraus entsteht das Glossar).


## Exercise patterns

- **Einordnen** (Kompetenz: Stoffe, Bauteile, Geräte zuordnen): `multiple-choice` oder `matching` mit je Option einer
  wahren `info`. Beispiel: `src/stromkreis/leiter-nichtleiter.yaml`, `ln-leiter`. Bei `matching` hat jede rechte Seite
  genau einen Partner (keine doppelten Antworten).
- **Vorhersagen** (Kompetenz: Reihen-/Parallelschaltung): `single-choice` oder `true-false` zum Ausfall einer Lampe.
  Beispiel: `src/schaltungen/parallelschaltung.yaml`, `ps-ausfall`.
- **Beurteilen** (Kompetenz: Sicherheit): `multiple-choice` mit sicheren und unsicheren Handlungen, die Begründung
  steht in der `info`. Beispiel: `src/alltag/sicherheit.yaml`, `si-sicher`.
- Die ersten drei Muster nutzen die Fragetypen `single-choice`, `multiple-choice`, `true-false`, `matching` und `ordering`.
- **Rechnen** (Kompetenz: eine Größe mit Einheit berechnen): `generated`-Aufgabe mit Zahlen aus kurzen Listen
  (`oneOf`): Spannung 3 bis 12 V (3, 4,5, 6, 9, 12), Widerstände 10, 20, 30, 50, 100 (200) Ω, Ströme in Zehntelampere. `where`
  hält das Ergebnis auf höchstens drei (Ampere) bzw. null (Ohm) Nachkommastellen und hindert, dass ein Fehler gleich der Antwort
  ist (`U != 2 * U1`). Die Antwort ist eine Zahl mit Einheit: `compare: { number: { format, decimals, unit: { de, en } } }`
  (die Einheit ist eine Sprachtabelle). Jede Aufgabe hat zwei typische Fehler mit Rückmeldung („R / U statt U / R“, „nur den
  ersten Widerstand genommen“, „Parallelschaltung gerechnet“, „mA nicht umgerechnet“), einen Tipp und die Schritte mit Formel.
  Beispiel: `src/groessen/ohmsches-gesetz.yaml`, `og-strom`.
- **Sehen und messen** (Kompetenz: Größen ablesen, Messgeräte richtig anschließen, Zusammenhänge erkennen): Komponenten, in
  denen man den Stromkreis sieht, statt Zahlen zu tippen. Gemeinsam ist ihnen die Darstellung: der Strom läuft als Punkte durch
  die Leitungen, dichter und schneller bei größerer Stromstärke (`Fluss.vue`, Aussehen in `Fluss.ts`, bei reduzierter Bewegung
  stehen die Punkte still und tragen die Stärke noch in ihrer Dichte); Messgeräte haben Zeiger und Zahl (`Zeiger.vue`); die
  Zahlen jeder Aufgabe kommen aus einem Startwert, Ziele sind runde Werte und werden aus einer echten Lösung gerechnet; geprüft
  wird, was die Messgeräte zeigen, nicht der Aufbau. Eine Komponente je Kompetenz:
  - `StromMessen` (`groessen/stromstaerke`): ein Amperemeter an einer von drei Stellen einbauen (obere oder untere Leitung:
    richtig, quer über der Batterie: Kurzschluss), dann den Widerstand wählen, bis der Zielstrom fließt.
  - `SpannungMessen` (`groessen/spannung`): ein Voltmeter an zwei der vier Punkte eines Kreises mit zwei Widerständen
    anschließen, bis es den Zielwert zeigt; die Leitungen sind nach der Höhe der Spannung rot bis blau gefärbt.
  - `DrahtLabor` (`groessen/widerstand`): Länge (1 bis 6 m) und Dicke (0,1 bis 0,5 mm²) eines Drahts bei 3 V einstellen, bis der
    Strom mindestens k-mal so groß ist wie am Anfang; der Draht wird so lang und dick gezeichnet, wie er eingestellt ist.
  - `OhmLabor` (`groessen/ohmsches-gesetz`): Spannung einstellen (0 bis 12 V in Schritten von 1,5 V), Messpunkte setzen, die ein
    Diagramm füllen, und den unbekannten Widerstand angeben (mindestens drei Punkte, Abweichung höchstens 0,5 Ω).
  - `SchaltungVorhersage` (`schaltungen-messen/reihenschaltung` und `parallelschaltung`): erst eine Zahl vorhersagen (Aufgabenarten
    `reihe-strom`, `reihe-spannung`, `parallel-gesamt`, `parallel-zweig`), dann einschalten: Punkte laufen, das Messgerät zeigt
    den Wert, die Rückmeldung nennt ihn.
  Jede Komponente liegt als `<Name>.vue`, `<Name>.ts` (Logik: `generate`, `check`, `solution`, `wrong`) und `<Name>.test.ts` in
  `src/components/` (der Build erlaubt nur diese Namensform). Gemeinsame Hilfen (Zufall, Runden, Zahlenformat mit Dezimalzeichen
  der Sprache, Texte füllen, Aussehen des Flusses) stehen in `Fluss.ts`, die des Zeigers in `Zeiger.ts`. Die Props einer
  Komponente sind einfache Typen (`string`, `number`, Literal-Unions im Text von `defineProps`, kein `null`). Die Komponenten
  können nicht: Wechselstrom, Innenwiderstände, nicht-ohmsche Bauteile, mehr als zwei Widerstände (außer dem Draht), Leistung. Eine
  neue Aufgabenart braucht: einen Eintrag in `generate`, `check` und der Darstellung, einen Test, den Text `task…` in den `texts`
  der Seite (beide Sprachen).
- **Bauen** (Kompetenz: Schaltungen planen): Komponente `SchaltungBauen` (`src/components/SchaltungBauen.vue`, Logik
  `SchaltungBauen.ts`), auf den Seiten `schalter-schaltzeichen`, `reihenschaltung` und `parallelschaltung` jeweils mit den Zielen
  dieser Seite (Prop `goals`); der Strom läuft als Punkte (`flows` verteilt ihn auf Hauptleitung und Zweige), leuchtende Lampen
  haben einen Schein. Sechs Aufgaben (Ziele `eine`, `schalter`, `reihe`, `parallel`, `je-schalter`, `haupt`). Grafisches Schaltbrett (SVG) mit sechs festen Plätzen: zwei in der Hauptleitung (Platz 1 = `m1`,
  Platz 6 = `m2`) und zwei je senkrechtem Zweig einer Parallelschaltung (Plätze 2 bis 5 = `p1a`, `p1b`, `p2a`, `p2b`). Man
  wählt Kabel, Lampe oder Schalter und tippt auf einen Platz; im Modus „Testen“ legt man Schalter um und schraubt Lampen
  heraus. Ein leerer Platz ist ein Kabel; sind beide Zweige ganz leer, entfällt die Parallelschaltung. Der Simulator prüft pro
  Aufgabe das Verhalten bei allen Schalterstellungen und mit herausgeschraubten Lampen, nicht den Aufbau. Eine neue Aufgabe
  braucht: ein Ziel in `Goal`, `meets` und `solutionSlots` (Logik), einen Test, den Text `goal…` in den `texts` der Seite (beide
  Sprachen) und einen Eintrag in `goals`. Sie kann nur Reihe und einen Parallelabschnitt mit Lampen und Schaltern; keine
  Spannung, keine Helligkeit.
Eine Datendatei in `src/data/` gibt es noch nicht; sobald Stoffe oder Bauteile in mehreren Übungen vorkommen, entsteht
`src/data/stoffe.yaml`.


## Figures

Schaltbilder sind eigene SVG-Zeichnungen in `src/images/` (`stromkreis`, `reihenschaltung`, `parallelschaltung`,
`schaltzeichen`), schwarze Linien auf weißem Grund. Seit Klasse 7 und 8 auch `amperemeter`, `voltmeter`, `kennlinie`, `reihe-messen`, `parallel-messen`: Messgeräte als Kreis mit dem
Buchstaben A oder V (Symbol, kein Wort); die Batterie mit langer dünner Platte oben (Plus) und kurzer dicker darunter (Minus), Widerstände als Rechteck, die Kennlinie mit den Achsenzeichen I und U und Ziffern 1, 2
für gleiche Schritte. Die Bilder enthalten **keine Wörter**, nur Ziffern (1, 2, 3 …), damit sie in
beiden Sprachen gelten; die Legende („Beschriftung: 1 Batterie, 2 Lampe …“) steht in der Bildunterschrift, je Sprache. In der
Parallelschaltung gibt es keine Querleitung, die die Zweige überbrückt, Schaltzeichen nach der üblichen Norm
(Batterie, Lampe als Kreis mit Kreuz, Schalter mit Lücke). Quelle ist die Adresse des Repos `https://github.com/lernapps/elektrizitaet` (sprachneutral: die Bildnachweise stehen
sonst in der Sprache der Seite, und ein Text ließe sich dort nicht übersetzen), Lizenz `CC0-1.0`.
Der Alt-Text beschreibt, was die Zeichnung zeigt (Bauteile und Lage), die Bildunterschrift sagt, worauf man achten soll.


## Sources

Die Fakten stammen aus den Wikipedia-Artikeln, die in `src/app.yaml` unter `sources` stehen (geladen und geprüft,
Quelle für Fakten, nicht für Formulierungen); für die Größen: Elektrische Stromstärke, Elektrische Spannung, Elektrischer
Widerstand, Ohmsches Gesetz (am 2026-10-15 geöffnet: richtiger Artikel, keine Begriffsklärung). Die Fragen verlinken jeweils auf
einen passenden Artikel. Serlo und LeifiPhysik sind nicht verwendet: Serlo hat zur Elektrizitätslehre nur Seiten ohne Inhalt
(„Fächer im Aufbau“), LeifiPhysik lieferte 403 (nicht umgangen). Eigenes Material der Auftraggeber
bleibt lokal und wird nie committet.


## Adding a chapter or round

1. Kompetenz als „Ich kann …“ in „Competencies“ eintragen und Lehrplanbezug in „Curriculum“ ergänzen.
2. Ordner `src/<kapitel>/` mit `chapter.yaml` anlegen, in `src/app.yaml` unter `chapters` eintragen.
3. Pro Kompetenz eine Seite mit den Sektionen `idee`, `merke`, `beispiel`, `uebung` schreiben und in `pages` listen.
4. Übungen nach den Mustern oben, jede Frage mit mindestens einem geprüften Link.
5. Jede Seite mit Themenpfad in die Katalogeintrags-`topics` (`<kapitel>/<seite>/`) aufnehmen.
6. `npx lernapps check` laufen lassen, committen.

Nächstes Kapitel: `wechselstrom` hinter `schaltungen-messen` in `src/app.yaml`; zuerst die Kompetenzen oben eintragen und
das Lehrplanzitat prüfen (Bayern, Gymnasium, Jahrgangsstufe 9 oder 10, nicht geprüft).


## Rules learned from mistakes

- Eine `unit` in `compare.number` ist eine Sprachtabelle `{ de: A, en: A }`, kein String.
- Die Props einer Komponente nutzen Literal-Unions im Text von `defineProps` (`("strom" | "spannung")[]`), keinen importierten
  Typ-Alias (`vue-component-props-valid`).
- `src/components/` enthält nur `<Name>.vue`, `<Name>.ts` und `<Name>.test.ts` (PascalCase, jede `.vue` mit Test): gemeinsame Hilfen
  gehören in die `.ts` einer Komponente, die die anderen importieren.
- Der Explainer schreibt keine Weiterleitungen: eine entfernte Seite (hier `schaltungen/bau-editor`) gibt danach 404; der Themenpfad
  im Katalogeintrag muss dann in demselben Zug ersetzt werden.
- Komponenten setzen **kein** `defineOptions({ nojs: "caption" })`: sonst bleibt der `nojs`-Text als lange Beschreibung unter der Übung
  stehen. Ohne diese Option ersetzt die laufende Komponente ihn.
- Die Prüfung einer Bauaufgabe urteilt nur über das, was ihr Text verlangt: die Aufgabe `eine` erlaubt zum Beispiel einen Schalter im
  Kreis, solange die Lampe leuchtet. Nach dem Prüfen sagt `diagnose` (Text `why…`), was fehlt: Zahl der Lampen, Zahl der Schalter,
  Kurzschluss, etwas dunkel (offener Schalter) oder Verhalten; das Template meldet selbst nur „Leider nicht richtig.“.
- Messen und Bauen folgen der Reihenfolge „bauen, dann Strom einschalten, dann prüfen“: Vor dem Einschalten fließt nichts, leuchtet
  nichts und zeigt kein Messgerät etwas, Kurzschluss-Warnungen kommen erst mit dem Strom; „Prüfen“ schaltet selbst ein. Beim Bauen
  wählt man ein Bauteil und tippt auf einen Platz; das Schalter-Werkzeug klappt einen eingebauten Schalter auf und zu, bei
  eingeschaltetem Strom prüft jedes Tippen (Schalter umlegen, Lampe herausschrauben).
- Ein Brett zeigt nur die Plätze, die die Aufgabe braucht: die Ziele `eine`, `schalter`, `reihe` haben zwei Plätze in einem
  Stromkreis (beide Plätze sind gültig), nur die Ziele mit parallelen Lampen haben die zwei Zweige.
- Vor dem Commit `npx vp fmt src`, sonst scheitert die Formatprüfung.

- Kommas in YAML-Flow-Listen (`[a, b]`, `{ left: a, right: b }`) trennen Zellen und Felder: Texte mit Komma in Anführungszeichen.
- Links zwischen Seiten haben die Form `/<kapitel>/<seite>/`, nicht relativ.
- Der Block `labelled-figure` zeigt das Bild ohne JavaScript nicht (die Prüfung `explainer › without JavaScript` scheitert):
  stattdessen `figure` mit Ziffern im Bild und Legende in der Bildunterschrift.
- Texte in YAML-Flow-Listen mit „?“ in Anführungszeichen setzen.
- Eine Seite braucht mindestens eine Quiz-Übung, auch wenn sie eine Komponente enthält.
- `vue-tsc` prüft nur `src/` (`tsconfig.json` mit `"include": ["src"]`); ein Behelf mit `@types/node` ist nicht mehr nötig.

