---
name: app-content
description: Use for any content work in this app - researching, writing, extending, correcting or reviewing its competencies, chapters, pages, rounds, questions, exercises, figures, terms or sources. This app's own content decisions; they take precedence over the generic lernapps content skills. Load it before you change any content.
---

# Content guide of this app

## Curriculum

Deutschland, länderübergreifend, Schulform-übergreifend, Jahrgang 5 und 6 (Physik bzw. Naturwissenschaften). Es ist
**kein offizielles Lehrplandokument zitiert**: die Recherche fand nur schulinterne Pläne und Unterrichtsmaterial, die
übereinstimmend dieselben Themen für Klasse 5/6 nennen (Stromkreis, Leiter/Nichtleiter, Schalter und Schaltpläne,
Reihen- und Parallelschaltung, Wirkungen des Stroms, Sicherheit). Das Lehrplanzitat (Titel, Herausgeber, Jahr, Seite,
Einheit) ist nachzureichen, sobald ein Land festgelegt ist; bis dahin gilt: Lehrplan nicht geprüft. Spätere Jahrgänge
(Spannung, Stromstärke, Widerstand, ohmsches Gesetz) kommen als weitere Kapitel dazu.


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
- Ich kann Stromkreise planen und bauen, die eine vorgegebene Aufgabe erfüllen. Seite `schaltungen/bau-editor`;
  Komponente `SchaltungBauen` (Ziele `eine`, `schalter`, `reihe`, `parallel`, `je-schalter`, `haupt`), `be-kurzschluss`.

Kapitel `alltag` (Strom im Alltag)
- Ich kann Wärme-, Licht- und Magnetwirkung des Stroms an Geräten zuordnen. Seite `alltag/wirkungen`; `wk-zuordnen`,
  `wk-kabel`, `wk-gluehlampe`.
- Ich kann Alltagssituationen mit Strom als sicher oder gefährlich beurteilen und begründen. Seite
  `alltag/sicherheit`; `si-sicher`, `si-gewitter`, `si-sicherung`.


## Content structure

Jede Seite hat dieselben vier Sektionen in dieser Reihenfolge: `idee` (Die Idee: 2 bis 4 Sätze, Alltagsbezug),
`merke` (Das merkst du dir: `definition`-Blöcke für Fachwörter, Tabelle oder Figur, Regeln als Liste), `beispiel`
(ein `example`-Kasten) und `uebung` (3 Übungen, auf der Seite `bau-editor` die Komponente plus eine Frage). Eine Seite
umfasst eine Kompetenz und passt auf einen Bildschirm voll Text. Kapitel haben 2 bis 4 Seiten.


## Terminology

**Sprachen:** Deutsch und Englisch (`languages: [de, en]` in `src/app.yaml`). Jeder Lerntext ist eine Map `{ de: …, en: … }`,
auch die `texts` der Komponente. Links in Fragen verweisen für beide Sprachen auf den deutschen Wikipedia-Artikel; der englische
Linktitel sagt „(German Wikipedia)“. Englische Fachwörter: circuit, power source, load, wire, switch, circuit symbol, circuit
diagram, series circuit, parallel circuit, short circuit, fuse, conductor, insulator.

- Stromkreis (nicht „Stromlauf“), Stromquelle, Verbraucher, Leitung, Schalter, Schaltzeichen, Schaltplan,
  Reihenschaltung, Parallelschaltung, Kurzschluss, Sicherung; Leiter und Nichtleiter (Isolator als Nebenwort).
- „Der Strom fließt“ ist die Sprechweise; Elektronen, Spannung und Stromstärke kommen erst in höheren Jahrgängen vor.
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
- **Bauen** (Kompetenz: Schaltungen planen): Komponente `SchaltungBauen` (`src/components/SchaltungBauen.vue`, Logik
  `SchaltungBauen.ts`). Sechs Aufgaben (Ziele `eine`, `schalter`, `reihe`, `parallel`, `je-schalter`, `haupt`). Grafisches Schaltbrett (SVG) mit sechs festen Plätzen: zwei in der Hauptleitung (Platz 1 = `m1`,
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
`schaltzeichen`), schwarze Linien auf weißem Grund. Die Bilder enthalten **keine Wörter**, nur Ziffern (1, 2, 3 …), damit sie in
beiden Sprachen gelten; die Legende („Beschriftung: 1 Batterie, 2 Lampe …“) steht in der Bildunterschrift, je Sprache. In der
Parallelschaltung gibt es keine Querleitung, die die Zweige überbrückt, Schaltzeichen nach der üblichen Norm
(Batterie, Lampe als Kreis mit Kreuz, Schalter mit Lücke). Quelle ist die Adresse des Repos `https://github.com/lernapps/elektrizitaet` (sprachneutral: die Bildnachweise stehen
sonst in der Sprache der Seite, und ein Text ließe sich dort nicht übersetzen), Lizenz `CC0-1.0`.
Der Alt-Text beschreibt, was die Zeichnung zeigt (Bauteile und Lage), die Bildunterschrift sagt, worauf man achten soll.


## Sources

Die Fakten stammen aus den Wikipedia-Artikeln, die in `src/app.yaml` unter `sources` stehen (geladen und geprüft,
Quelle für Fakten, nicht für Formulierungen). Die Fragen verlinken jeweils auf einen passenden Artikel. Serlo und LeifiPhysik
sind nicht verwendet: Serlo wurde nur als Übersicht geladen, LeifiPhysik lieferte 403. Eigenes Material der Auftraggeber
bleibt lokal und wird nie committet.


## Adding a chapter or round

1. Kompetenz als „Ich kann …“ in „Competencies“ eintragen und Lehrplanbezug in „Curriculum“ ergänzen.
2. Ordner `src/<kapitel>/` mit `chapter.yaml` anlegen, in `src/app.yaml` unter `chapters` eintragen.
3. Pro Kompetenz eine Seite mit den Sektionen `idee`, `merke`, `beispiel`, `uebung` schreiben und in `pages` listen.
4. Übungen nach den Mustern oben, jede Frage mit mindestens einem geprüften Link.
5. Jede Seite mit Themenpfad in die Katalogeintrags-`topics` (`<kapitel>/<seite>/`) aufnehmen.
6. `npx lernapps check` laufen lassen, committen.


## Rules learned from mistakes

- Kommas in YAML-Flow-Listen (`[a, b]`, `{ left: a, right: b }`) trennen Zellen und Felder: Texte mit Komma in Anführungszeichen.
- Links zwischen Seiten haben die Form `/<kapitel>/<seite>/`, nicht relativ.
- Der Block `labelled-figure` zeigt das Bild ohne JavaScript nicht (die Prüfung `explainer › without JavaScript` scheitert):
  stattdessen `figure` mit Ziffern im Bild und Legende in der Bildunterschrift.
- Texte in YAML-Flow-Listen mit „?“ in Anführungszeichen setzen.
- Eine Seite braucht mindestens eine Quiz-Übung, auch wenn sie eine Komponente enthält.
- `vue-tsc` prüft nur `src/` (`tsconfig.json` mit `"include": ["src"]`); ein Behelf mit `@types/node` ist nicht mehr nötig.

